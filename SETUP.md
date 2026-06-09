# LYD Application Form — Setup Guide

## EmailJS Configuration (required for emails to send)

This form uses [EmailJS](https://www.emailjs.com/) to send emails directly from the browser — no backend needed.

### Step 1 — Create a free EmailJS account
Go to https://www.emailjs.com and sign up.

### Step 2 — Add an Email Service
- In the EmailJS dashboard → **Email Services** → **Add New Service**
- Connect your Gmail, Outlook, or custom SMTP (e.g. management@nspinnaclerecruit.com)
- Copy the **Service ID**

### Step 3 — Create an Email Template
- Go to **Email Templates** → **Create New Template**
- Set **To Email**: `{{to_email}}`
- Set **Reply To**: `{{reply_to}}`
- Set **Subject**: `{{subject}}`
- Paste this into the **Body**:

```
New LYD Application received:

Name: {{full_name}}
Email: {{email}}
Phone: {{phone}}
WhatsApp: {{whatsapp}}
Date of Birth: {{dob}}
Country of Birth: {{country_of_birth}}
Country of Citizenship: {{country_of_citizenship}}
Country of Residence: {{country_of_residence}}

Can Afford Fees: {{can_afford}}
English Level: {{english_level}}
Ever Arrested: {{ever_arrested}}
Immigration Problems in US: {{immigration_problems}}
Overstayed in US: {{overstayed_us}}
US Visa Denied: {{visa_denied}}
```

- Copy the **Template ID**

### Step 4 — Get your Public Key
- Go to **Account** → **General** → copy your **Public Key**

### Step 5 — Update the form
Open `src/App.tsx` and replace the three placeholders at the top:

```ts
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";   // ← paste here
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // ← paste here
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";   // ← paste here
const MANAGEMENT_EMAIL = "management@nspinnaclerecruit.com"; // ← confirm this
```

### Step 6 — Run or build
```bash
npm run dev    # local development
npm run build  # production build → deploy the /dist folder
```

---

## Deployment
Upload the contents of the `/dist` folder to any static host:
- Netlify (drag & drop the dist folder)
- Vercel
- cPanel File Manager (public_html or a subdirectory)
