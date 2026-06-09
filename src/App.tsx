import { useState } from "react";
import "./App.css";
import { COUNTRIES } from "./countries";

const TITLES = ["Mr", "Mrs", "Ms", "Miss", "Dr", "Prof", "Rev"];
const ENGLISH_LEVELS = ["Basic", "Conversational", "Intermediate", "Advanced", "Fluent / Native"];

type FormData = {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  whatsapp: string;
  dobMonth: string;
  dobDay: string;
  dobYear: string;
  countryOfBirth: string;
  countryOfCitizenship: string;
  countryOfResidence: string;
  canAfford: string;
  englishLevel: string;
  everArrested: string;
  immigrationProblems: string;
  overstayedUS: string;
  visaDenied: string;
};

const blank: FormData = {
  firstName: "", lastName: "", title: "", email: "",
  phone: "", whatsapp: "",
  dobMonth: "", dobDay: "", dobYear: "",
  countryOfBirth: "", countryOfCitizenship: "", countryOfResidence: "",
  canAfford: "", englishLevel: "",
  everArrested: "", immigrationProblems: "", overstayedUS: "", visaDenied: "",
};

export default function App() {
  const [form, setForm] = useState<FormData>(blank);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: "" }));
    };

  const validate = () => {
    const required: (keyof FormData)[] = [
      "firstName", "lastName", "title", "email", "phone",
      "dobMonth", "dobDay", "dobYear",
      "countryOfBirth", "countryOfCitizenship", "countryOfResidence",
      "canAfford", "englishLevel",
      "everArrested", "immigrationProblems", "overstayedUS", "visaDenied",
    ];
    const errs: Partial<Record<keyof FormData, string>> = {};
    required.forEach((k) => { if (!form[k]) errs[k] = "Required"; });
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    const dob = `${form.dobMonth}/${form.dobDay}/${form.dobYear}`;

    try {
      const res = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, dob }),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
      setForm(blank);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="page">
      {status === "success" && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">✓</div>
            <h2>Form Successfully Submitted!</h2>
            <p className="modal-msg">Please check your email for confirmation!!</p>
            <p className="modal-sub">
              Our team at NS Pinnacle Recruit will review your details and be in touch with you shortly.
            </p>
            <button className="btn-submit" onClick={() => setStatus("idle")}>
              Submit Another Application
            </button>
          </div>
        </div>
      )}
      <div className="form-card">
        <div className="form-header">
          <picture>
            <source srcSet="/lyd-logo.webp" type="image/webp" />
            <img src="/lyd-logo.png" alt="Live Your Dream" className="header-logo" />
          </picture>
          <h1>Live Your Dream</h1>
          <p>H-2A Agricultural Worker Programme</p>
          <p className="sub">Complete the form below and our team will be in touch.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          <div className="section-label">Personal Information</div>

          <div className="row-2">
            <Field label="First Name" required error={errors.firstName}>
              <input type="text" placeholder="First name" value={form.firstName} onChange={set("firstName")} />
            </Field>
            <Field label="Last Name" required error={errors.lastName}>
              <input type="text" placeholder="Last name" value={form.lastName} onChange={set("lastName")} />
            </Field>
          </div>

          <Field label="Title" required error={errors.title}>
            <select value={form.title} onChange={set("title")}>
              <option value="">Please Select</option>
              {TITLES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>

          <Field label="Email" required error={errors.email}>
            <input type="email" placeholder="your@email.com" value={form.email} onChange={set("email")} />
          </Field>

          <Field label="Phone Number" required error={errors.phone}>
            <div className="phone-wrap">
              <span className="phone-flag">🇿🇦 +27</span>
              <input
                type="tel"
                placeholder="82 123 4567"
                value={form.phone}
                onChange={set("phone")}
                className="phone-input"
              />
            </div>
          </Field>

          <Field label="WhatsApp Number" error={errors.whatsapp}>
            <input type="tel" placeholder="Optional — include country code e.g. +27 82 123 4567" value={form.whatsapp} onChange={set("whatsapp")} />
          </Field>

          <Field label="Date of Birth" required error={errors.dobMonth || errors.dobDay || errors.dobYear}>
            <div className="dob-wrap">
              <select value={form.dobMonth} onChange={set("dobMonth")}>
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={String(m).padStart(2, "0")}>{String(m).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="sep">/</span>
              <select value={form.dobDay} onChange={set("dobDay")}>
                <option value="">DD</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d).padStart(2, "0")}>{String(d).padStart(2, "0")}</option>
                ))}
              </select>
              <span className="sep">/</span>
              <select value={form.dobYear} onChange={set("dobYear")} className="dob-year">
                <option value="">YYYY</option>
                {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 18 - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </Field>

          <Field label="Country of Birth" required error={errors.countryOfBirth}>
            <select value={form.countryOfBirth} onChange={set("countryOfBirth")}>
              <option value="">Please Select</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Country of Citizenship" required error={errors.countryOfCitizenship}>
            <select value={form.countryOfCitizenship} onChange={set("countryOfCitizenship")}>
              <option value="">Please Select</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Country of Residence" required error={errors.countryOfResidence}>
            <select value={form.countryOfResidence} onChange={set("countryOfResidence")}>
              <option value="">Please Select</option>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <div className="section-label">Programme Eligibility</div>

          <Field
            label="Are you able to afford the Live Your Dream programme fees? Payment terms are available."
            required
            error={errors.canAfford}
          >
            <div className="toggle-group">
              {["Yes", "No"].map((v) => (
                <label key={v} className={`toggle-btn${form.canAfford === v ? " toggle-btn--active" : ""}`}>
                  <input type="radio" name="canAfford" value={v} checked={form.canAfford === v} onChange={set("canAfford")} />
                  {form.canAfford === v && <span className="toggle-tick">✓</span>}
                  {v}
                </label>
              ))}
            </div>
          </Field>

          <Field label="English Level" required error={errors.englishLevel}>
            <select value={form.englishLevel} onChange={set("englishLevel")}>
              <option value="">Please Select</option>
              {ENGLISH_LEVELS.map((l) => <option key={l}>{l}</option>)}
            </select>
          </Field>

          <Field
            label="Have you ever been arrested or convicted for any offence or crime anywhere in the world?"
            required
            error={errors.everArrested}
          >
            <div className="toggle-group">
              {["Yes", "No"].map((v) => (
                <label key={v} className={`toggle-btn${form.everArrested === v ? " toggle-btn--active" : ""}`}>
                  <input type="radio" name="everArrested" value={v} checked={form.everArrested === v} onChange={set("everArrested")} />
                  {form.everArrested === v && <span className="toggle-tick">✓</span>}
                  {v}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Have you had immigration problems in the US?" required error={errors.immigrationProblems}>
            <div className="toggle-group">
              {["Yes", "No"].map((v) => (
                <label key={v} className={`toggle-btn${form.immigrationProblems === v ? " toggle-btn--active" : ""}`}>
                  <input type="radio" name="immigrationProblems" value={v} checked={form.immigrationProblems === v} onChange={set("immigrationProblems")} />
                  {form.immigrationProblems === v && <span className="toggle-tick">✓</span>}
                  {v}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Have you ever overstayed in the US?" required error={errors.overstayedUS}>
            <select value={form.overstayedUS} onChange={set("overstayedUS")}>
              <option value="">Please Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>

          <Field label="Have you ever had a US Visa denied?" required error={errors.visaDenied}>
            <select value={form.visaDenied} onChange={set("visaDenied")}>
              <option value="">Please Select</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </Field>

          {status === "error" && (
            <div className="error-banner">
              Something went wrong — please try again or contact us directly.
            </div>
          )}

          <button type="submit" className="btn-submit" disabled={status === "sending"}>
            {status === "sending" ? "Submitting…" : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label, required, error, children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label className="field-label">
        {label}{required && <span className="req">*</span>}
      </label>
      {children}
      {error && <span className="field-error-msg">{error}</span>}
    </div>
  );
}
