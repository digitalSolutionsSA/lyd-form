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
    applicationType, maritalStatus, numberOfChildren, currentCity,
    currentlyInUSProgram, usProgramDetails,
    canAfford, englishLevel, everArrested, immigrationProblems,
    overstayedUS, visaDenied,
    heardFrom, referredBy,
  } = data;

  const fullName = `${title} ${firstName} ${lastName}`;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px;background:#f0f7eb;font-weight:600;width:220px">${label}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e0e0e0">${value || "—"}</td>
    </tr>`;

  const managementHtml = `
    <h2 style="color:#2d5a1b">New LYD Application</h2>
    <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">

      <tr><td colspan="2" style="padding:10px 12px;background:#2d5a1b;color:#fff;font-weight:700;font-size:13px;letter-spacing:.05em">PERSONAL INFORMATION</td></tr>
      ${row("Full Name", fullName)}
      ${row("Email", email)}
      ${row("Phone", `+27 ${phone}`)}
      ${row("WhatsApp", whatsapp || "Not provided")}
      ${row("Date of Birth", dob)}
      ${row("Country of Birth", countryOfBirth)}
      ${row("Country of Citizenship", countryOfCitizenship)}
      ${row("Country of Residence", countryOfResidence)}

      <tr><td colspan="2" style="padding:10px 12px;background:#2d5a1b;color:#fff;font-weight:700;font-size:13px;letter-spacing:.05em">BACKGROUND INFORMATION</td></tr>
      ${row("Application For", applicationType)}
      ${row("Marital Status", maritalStatus)}
      ${row("Number of Children", numberOfChildren)}
      ${row("Current City / Town", currentCity)}
      ${row("Currently in US Work Programme", currentlyInUSProgram)}
      ${currentlyInUSProgram === "Yes" ? row("US Programme Details", usProgramDetails || "Not provided") : ""}

      <tr><td colspan="2" style="padding:10px 12px;background:#2d5a1b;color:#fff;font-weight:700;font-size:13px;letter-spacing:.05em">PROGRAMME ELIGIBILITY</td></tr>
      ${row("Can Afford Fees", canAfford)}
      ${row("English Level", englishLevel)}
      ${row("Ever Arrested", everArrested)}
      ${row("Immigration Problems (US)", immigrationProblems)}
      ${row("Overstayed in US", overstayedUS)}
      ${row("US Visa Denied", visaDenied)}

      <tr><td colspan="2" style="padding:10px 12px;background:#2d5a1b;color:#fff;font-weight:700;font-size:13px;letter-spacing:.05em">REFERRAL</td></tr>
      ${row("Heard About LYD Via", heardFrom)}
      ${heardFrom === "Referred by someone" ? row("Referred By", referredBy || "Not provided") : ""}

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
