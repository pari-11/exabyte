<?php
// Enquiry endpoint for the static site. PHP port of the former
// app/api/enquiry/route.js + lib/validation.js + lib/email.js: validates the
// submission, then sends the notification and confirmation emails via
// Resend's REST API. Written for PHP 7.4+.
//
// Secrets live in enquiry-config.php (same folder, never in git; the deploy
// workflow writes it). Course/option lists come from enquiry-data.json, which
// is generated from data/*.js at build time so they cannot drift.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond($status, array $body)
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

function fail($status, array $errors)
{
    respond($status, array('ok' => false, 'errors' => $errors));
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    fail(405, array('form' => 'Invalid request.'));
}

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 100000) {
    fail(400, array('form' => 'Invalid request body.'));
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    fail(400, array('form' => 'Invalid request body.'));
}

// Honeypot: real visitors never see or fill this field. Pretend success.
if (isset($data['website']) && trim((string) $data['website']) !== '') {
    respond(200, array('ok' => true));
}

// Light rate limit per IP: 5 submissions per 10 minutes.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateFile = sys_get_temp_dir() . '/exabyte-enquiry-' . md5($ip) . '.json';
$now = time();
$hits = array();
if (is_file($rateFile)) {
    $stored = json_decode((string) @file_get_contents($rateFile), true);
    if (is_array($stored)) {
        $hits = array_values(array_filter($stored, function ($t) use ($now) {
            return is_int($t) && $t > $now - 600;
        }));
    }
}
if (count($hits) >= 5) {
    fail(429, array('form' => 'Too many requests — please try again in a few minutes.'));
}
$hits[] = $now;
@file_put_contents($rateFile, json_encode($hits), LOCK_EX);

$meta = json_decode((string) @file_get_contents(__DIR__ . '/enquiry-data.json'), true);
$config = is_file(__DIR__ . '/enquiry-config.php') ? include __DIR__ . '/enquiry-config.php' : null;
if (!is_array($meta) || !is_array($config)
    || empty($config['api_key']) || empty($config['recipient']) || empty($config['from'])) {
    error_log('enquiry.php: enquiry-data.json or enquiry-config.php is missing or incomplete.');
    fail(500, array('form' => 'Something went wrong — please try again.'));
}

// ---------- helpers ----------

function str($data, $key)
{
    $value = $data[$key] ?? '';
    return is_scalar($value) ? trim((string) $value) : '';
}

function list_of($data, $key)
{
    $value = $data[$key] ?? array();
    if (!is_array($value)) {
        return array();
    }
    return array_values(array_filter($value, 'is_string'));
}

function values_of(array $options)
{
    return array_map(function ($o) {
        return $o['value'];
    }, $options);
}

function label_from(array $options, $value)
{
    foreach ($options as $o) {
        if ($o['value'] === $value) {
            return $o['label'];
        }
    }
    return $value;
}

function labels_from(array $options, array $values)
{
    if (count($values) === 0) {
        return null;
    }
    return implode(', ', array_map(function ($v) use ($options) {
        return label_from($options, $v);
    }, $values));
}

function esc($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function normalize_mobile($mobile)
{
    $digits = preg_replace('/[\s-]/', '', (string) $mobile);
    if (substr($digits, 0, 3) === '+91') {
        $digits = substr($digits, 3);
    } elseif (substr($digits, 0, 1) === '0') {
        $digits = substr($digits, 1);
    }
    return $digits;
}

function courses_for_type(array $meta, $type)
{
    if ($type === '' || $type === $meta['demoType']) {
        return $meta['courses'];
    }
    return array_values(array_filter($meta['courses'], function ($c) use ($type) {
        return in_array($type, $c['availableFor'], true);
    }));
}

// ---------- validation (port of lib/validation.js) ----------

function validate_enquiry(array $data, array $meta)
{
    $errors = array();
    $typeSlugs = array_map(function ($t) {
        return $t['slug'];
    }, $meta['types']);
    $type = str($data, 'format');

    if ($type === '') {
        return array('format' => 'Please select an option.');
    }
    if (!in_array($type, $typeSlugs, true)) {
        return array('format' => 'Please select a valid option.');
    }

    $requireText = function ($field, $label, $minLength = 0) use (&$errors, $data) {
        $value = str($data, $field);
        if ($value === '') {
            $errors[$field] = $label . ' is required.';
        } elseif ($minLength && mb_strlen($value) < $minLength) {
            $errors[$field] = $label . ' must be at least ' . $minLength . ' characters.';
        }
    };

    $requireText('fullName', 'Name', 2);

    $mobile = str($data, 'mobile');
    if ($mobile === '') {
        $errors['mobile'] = 'Mobile number is required.';
    } elseif (!preg_match('/^[6-9]\d{9}$/', normalize_mobile($mobile))) {
        $errors['mobile'] = 'Enter a valid 10-digit mobile number.';
    }

    $email = str($data, 'email');
    if ($email === '') {
        $errors['email'] = 'Email is required.';
    } elseif (!preg_match('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', $email)) {
        $errors['email'] = 'Enter a valid email address.';
    }

    if ($type === 'community-learning') {
        $requireText('organizationName', 'Organization / society / school name', 2);

        $groupType = str($data, 'groupType');
        if ($groupType === '') {
            $errors['groupType'] = 'Please select a group type.';
        } elseif (!in_array($groupType, values_of($meta['options']['groupType']), true)) {
            $errors['groupType'] = 'Please select a valid group type.';
        }

        $participants = str($data, 'participants');
        if ($participants === '') {
            $errors['participants'] = 'Number of participants is required.';
        } elseif (!preg_match('/^\d+$/', $participants) || (int) $participants < 1) {
            $errors['participants'] = 'Enter a valid number of participants.';
        }

        $requireText('ageGroup', 'Age group');
        $requireText('city', 'City');
        $requireText('venueAddress', 'Venue address');
    } elseif ($type === 'academy-classroom') {
        $requireText('studentAge', 'Student age');

        if (str($data, 'visitDate') === '') {
            $errors['visitDate'] = 'Preferred visit date is required.';
        }
        if (str($data, 'visitTimeSlot') === '') {
            $errors['visitTimeSlot'] = 'Preferred time is required.';
        }
    } elseif ($type === 'personal-mentoring') {
        $requireText('studentAge', 'Student age');
        $requireText('city', 'City');
    }

    $course = str($data, 'course');
    $courseRequired = $type !== 'academy-classroom';
    if ($courseRequired && $course === '') {
        $errors['course'] = 'Please select a course.';
    } elseif ($course !== '') {
        $valid = false;
        foreach (courses_for_type($meta, $type) as $c) {
            if ($c['slug'] === $course) {
                $valid = true;
            }
        }
        if (!$valid) {
            $errors['course'] = 'Please select a valid course.';
        }
    }

    if (mb_strlen(str($data, 'message')) > 1000) {
        $errors['message'] = 'Message must be 1000 characters or fewer.';
    }

    if (empty($data['consent'])) {
        $errors['consent'] = 'Please agree to be contacted about this enquiry.';
    }

    return $errors;
}

$errors = validate_enquiry($data, $meta);
if (count($errors) > 0) {
    fail(400, $errors);
}

// ---------- emails (port of lib/email.js) ----------

function type_name(array $meta, $slug)
{
    foreach ($meta['types'] as $t) {
        if ($t['slug'] === $slug) {
            return $t['name'];
        }
    }
    return 'Not specified';
}

function course_name(array $meta, $slug)
{
    foreach ($meta['courses'] as $c) {
        if ($c['slug'] === $slug) {
            return $c['name'];
        }
    }
    return null;
}

function build_summary_rows(array $data, array $meta)
{
    $o = $meta['options'];
    $type = str($data, 'format');
    $rows = array();
    $add = function ($label, $value) use (&$rows) {
        if ($value === null || $value === '') {
            return;
        }
        $rows[] = array('label' => $label, 'value' => $value);
    };

    $add('Enquiry type', type_name($meta, $type));

    if ($type === 'community-learning') {
        $add('Organizer name', str($data, 'fullName'));
        $add('Organization / society / school', str($data, 'organizationName'));
        $add('Contact person', str($data, 'contactPerson'));
    } else {
        $add($type === 'academy-classroom' ? 'Visitor name' : 'Student name', str($data, 'fullName'));
        $add('Parent/guardian name', str($data, 'guardianName'));
    }

    $add('Mobile', str($data, 'mobile'));
    $add('WhatsApp', str($data, 'whatsapp'));
    $add('Email', str($data, 'email'));

    if ($type === 'community-learning') {
        $add('Group type', label_from($o['groupType'], str($data, 'groupType')));
        $add('Number of participants', str($data, 'participants'));
        $add('Age group', str($data, 'ageGroup'));
        $add('City', str($data, 'city'));
        $add('Venue address', str($data, 'venueAddress'));
    } elseif ($type === 'academy-classroom') {
        $add('Student age', str($data, 'studentAge'));
        $add('School / college', str($data, 'schoolName'));
        $add('Grade / year', str($data, 'grade'));
    } else {
        $add('Student age', str($data, 'studentAge'));
        $add('School / college name', str($data, 'schoolName'));
        $add('Grade / year of study', str($data, 'grade'));
        $add('City', str($data, 'city'));
        $add('Area / locality', str($data, 'locality'));
    }

    $add('Interested course', course_name($meta, str($data, 'course')));

    if ($type === 'personal-mentoring' || $type === 'community-learning') {
        $add('Preferred learning days', labels_from($o['days'], list_of($data, 'days')));
        $add('Preferred time slot', label_from($o['timeSlot'], str($data, 'timeSlot')));
    }

    if ($type === 'community-learning') {
        $add('Preferred start date', str($data, 'startDate'));
    }

    if ($type === 'academy-classroom') {
        $add('Preferred visit date', str($data, 'visitDate'));
        $add('Preferred time', label_from($o['visitTimeSlot'], str($data, 'visitTimeSlot')));
        $add('Number of visitors', label_from($o['numberOfVisitors'], str($data, 'numberOfVisitors')));
        $add('Interested in', labels_from($o['visitPurpose'], list_of($data, 'visitPurpose')));
    }

    $add('Message', str($data, 'message'));

    return $rows;
}

// Returns null on success, or an error string.
function send_via_resend(array $config, array $payload)
{
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer ' . $config['api_key'],
            'Content-Type: application/json',
            'User-Agent: exabyte-enquiry/1.0',
        ),
    ));
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        return 'Resend request failed: ' . $curlError;
    }
    if ($status < 200 || $status >= 300) {
        return 'Resend returned HTTP ' . $status . ': ' . $body;
    }
    return null;
}

function send_notification(array $data, array $meta, array $config)
{
    $html = '<h2>New enquiry from ' . esc(str($data, 'fullName')) . '</h2>' . "\n";
    foreach (build_summary_rows($data, $meta) as $row) {
        $html .= '<p><strong>' . esc($row['label']) . ':</strong> '
            . str_replace("\n", '<br />', esc($row['value'])) . '</p>' . "\n";
    }
    $html .= '<p><strong>Consent to be contacted:</strong> ' . (!empty($data['consent']) ? 'Yes' : 'No') . '</p>' . "\n";
    $html .= '<p style="color:#666;font-size:12px;">Submitted at ' . gmdate('Y-m-d\TH:i:s.000\Z') . '</p>';

    return send_via_resend($config, array(
        'from' => $config['from'],
        'to' => $config['recipient'],
        'reply_to' => str($data, 'email'),
        'subject' => 'New enquiry — ' . str($data, 'fullName'),
        'html' => $html,
    ));
}

function send_confirmation(array $data, array $meta, array $config)
{
    $typeName = type_name($meta, str($data, 'format'));
    $courseName = course_name($meta, str($data, 'course'));
    $isDemo = str($data, 'format') === $meta['demoType'];

    $html = '<h2>Thanks for reaching out, ' . esc(str($data, 'fullName')) . '!</h2>' . "\n"
        . '<p>' . "\n"
        . '  We\'ve received your ' . esc($isDemo ? 'demo request' : 'enquiry') . "\n"
        . ($courseName ? ' for <strong>' . esc($courseName) . '</strong>' : '') . "\n"
        . '  (' . esc($typeName) . ') and will get back to you soon.' . "\n"
        . '</p>' . "\n"
        . '<p>If anything above doesn\'t look right, just reply to this email and let us know.</p>' . "\n"
        . '<p>— ' . esc($meta['siteName']) . '</p>';

    return send_via_resend($config, array(
        'from' => $config['from'],
        'to' => str($data, 'email'),
        'reply_to' => $meta['siteEmail'],
        'subject' => 'We\'ve received your enquiry — ' . $meta['siteName'],
        'html' => $html,
    ));
}

// ---------- send ----------

$error = send_notification($data, $meta, $config);
if ($error !== null) {
    error_log('enquiry.php: failed to send enquiry notification email: ' . $error);
    fail(502, array('form' => 'Something went wrong — please try again.'));
}

// Answer the visitor now; the confirmation email goes out afterwards.
ignore_user_abort(true);
http_response_code(200);
$body = json_encode(array('ok' => true));
header('Content-Length: ' . strlen($body));
header('Connection: close');
echo $body;
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    @ob_end_flush();
    flush();
}

$error = send_confirmation($data, $meta, $config);
if ($error !== null) {
    error_log('enquiry.php: failed to send enquiry confirmation email: ' . $error);
}
