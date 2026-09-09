import { NextResponse, after } from "next/server";
import { validateEnquiry, isValid } from "@/lib/validation";
import { sendEnquiryNotification, sendEnquiryConfirmation } from "@/lib/email";

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, errors: { form: "Invalid request body." } },
      { status: 400 }
    );
  }

  const errors = validateEnquiry(data);
  if (!isValid(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  console.log("New enquiry received:", {
    fullName: data.fullName,
    email: data.email,
    mobile: data.mobile,
    city: data.city || null,
    course: data.course,
    format: data.format || null,
    message: data.message,
    consent: data.consent,
    submittedAt: new Date().toISOString(),
  });

  try {
    await sendEnquiryNotification(data);
  } catch (err) {
    console.error("Failed to send enquiry notification email:", err);
    return NextResponse.json(
      {
        ok: false,
        errors: { form: "Something went wrong — please try again." },
      },
      { status: 502 }
    );
  }

  after(async () => {
    try {
      await sendEnquiryConfirmation(data);
    } catch (err) {
      console.error("Failed to send enquiry confirmation email:", err);
    }
  });

  return NextResponse.json({ ok: true });
}
