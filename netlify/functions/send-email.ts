import { Resend } from "resend";
import type { Handler } from "@netlify/functions";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "LYD Applications <lyd@nspinnaclerecruit.co.za>";
const MANAGEMENT = "lyd@nspinnaclerecruit.co.za";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data: Record<string, string>;
  try {
    data = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const {
    firstName, lastName, title, email, phone, whatsapp, dob,
    countryOfBirth, countryOfCitizenship, countryOfResidence,
    canAfford, englishLevel, everArrested, immigrationProblems,
    overstayedUS, visaDenied,
  } = data;

  const fullName = `${title} ${firstName} ${lastName}`;

  const managementHtml = `
    <h2 style="color:#2d5a1b">New LYD Application</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600;width:220px">Full Name</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${fullName}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Email</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${email}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Phone</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">+27 ${phone}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">WhatsApp</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${whatsapp || "Not provided"}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Date of Birth</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${dob}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Country of Birth</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${countryOfBirth}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Country of Citizenship</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${countryOfCitizenship}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Country of Residence</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${countryOfResidence}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Can Afford Fees</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${canAfford}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">English Level</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${englishLevel}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Ever Arrested</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${everArrested}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Immigration Problems (US)</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${immigrationProblems}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">Overstayed in US</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${overstayedUS}</td></tr>
      <tr><td style="padding:8px 12px;background:#f0f7eb;font-weight:600">US Visa Denied</td><td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${visaDenied}</td></tr>
    </table>
  `;

  const applicantHtml = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#2d5a1b,#4a8c2a);padding:32px;text-align:center;border-radius:8px 8px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Live Your Dream</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px">NS Pinnacle Recruit</p>
      </div>
      <div style="background:#fff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
        <p style="font-size:16px;color:#1a2a14">Dear ${title} ${lastName},</p>
        <p style="color:#444;line-height:1.6">
          Thank you for submitting your Live Your Dream application. We have received your details and our team will review your application and be in touch with you shortly.
        </p>
        <p style="color:#444;line-height:1.6">
          If you have any questions in the meantime, please feel free to reply to this email.
        </p>
        <p style="color:#444;margin-top:24px">Kind regards,<br><strong style="color:#2d5a1b">NS Pinnacle Recruit — LYD Team</strong></p>
      </div>
    </div>
  `;

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to: MANAGEMENT,
        replyTo: email,
        subject: `LYD Application — ${fullName}`,
        html: managementHtml,
      }),
      resend.emails.send({
        from: FROM,
        to: email,
        subject: "Your Live Your Dream Application — NS Pinnacle Recruit",
        html: applicantHtml,
      }),
    ]);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email" }) };
  }
};
