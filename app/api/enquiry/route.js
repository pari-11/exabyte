import { NextResponse } from "next/server";
import { validateEnquiry, isValid } from "@/lib/validation";

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

  return NextResponse.json({ ok: true });
}
