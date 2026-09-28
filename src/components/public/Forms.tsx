"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import {
  registerAction,
  beginPayment,
  simulateAction,
  messageAction,
  loginAction,
} from "@/services/actions";
import { money, tr } from "@/lib/platform";
import type { Course, Locale, Payment } from "@/types/platform";
export function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button className="button" type="submit" disabled={pending}>
      {pending ? "…" : children}
      <ArrowRight size={16} />
    </button>
  );
}
export function Field({
  label,
  name,
  type = "text",
  required = true,
  defaultValue,
  maxLength = 200,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  maxLength?: number;
}) {
  return (
    <label className="form-field">
      <span>
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        maxLength={maxLength}
      />
    </label>
  );
}
function ErrorText({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="form-error">
      {error}
    </p>
  ) : null;
}
export function RegistrationForm({
  lang,
  courses,
  selected,
  centers,
}: {
  lang: Locale;
  courses: (Course & { dateRange: string })[];
  selected: string;
  centers: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(registerAction, { error: "" });
  const [courseId, setCourseId] = useState(selected || courses[0]?.id || "");
  const course = courses.find((c) => c.id === courseId);
  return (
    <form action={action} className="form-panel">
      <input type="hidden" name="lang" value={lang} />
      <div className="form-heading">
        <span className="step-number">01</span>
        <div>
          <h2>{tr(lang, "Your details", "ព័ត៌មានរបស់អ្នក")}</h2>
          <p>
            {tr(
              lang,
              "Please use fictional details for this demo.",
              "សូមប្រើព័ត៌មានប្រឌិតសម្រាប់សាកល្បង។",
            )}
          </p>
        </div>
      </div>
      <div className="form-grid">
        <Field name="firstName" label={tr(lang, "First name", "នាមខ្លួន")} />
        <Field name="lastName" label={tr(lang, "Last name", "នាមត្រកូល")} />
        <Field name="email" label={tr(lang, "Email", "អ៊ីមែល")} type="email" />
        <Field
          name="phone"
          label={tr(lang, "Phone number", "លេខទូរស័ព្ទ")}
          type="tel"
        />
        <Field
          name="messenger"
          label={tr(
            lang,
            "Telegram / WhatsApp (optional)",
            "Telegram / WhatsApp (មិនចាំបាច់)",
          )}
          required={false}
        />
        <Field name="nationality" label={tr(lang, "Nationality", "សញ្ជាតិ")} />
        <Field
          name="city"
          label={tr(lang, "City / province", "ក្រុង / ខេត្ត")}
        />
        <label className="form-field">
          <span>{tr(lang, "Preferred language", "ភាសាដែលចង់រៀន")} *</span>
          <select name="preferredLanguage" defaultValue={lang}>
            <option value="en">English</option>
            <option value="km">ខ្មែរ</option>
          </select>
        </label>
      </div>
      <div className="form-heading">
        <span className="step-number">02</span>
        <h2>{tr(lang, "Your course", "វគ្គរបស់អ្នក")}</h2>
      </div>
      <label className="form-field">
        <span>{tr(lang, "Selected course", "វគ្គដែលជ្រើសរើស")} *</span>
        <select
          name="courseId"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          {courses.map((c) => (
            <option value={c.id} key={c.id}>
              {c.title[lang]} — {money(c.price)}
            </option>
          ))}
        </select>
      </label>
      {course && (
        <div className="selection-summary">
          <p>{centers.find((c) => c.id === course.centerId)?.name}</p>
          <strong>
            {course.dateRange}
          </strong>
          <p>{course.schedule[lang]}</p>
        </div>
      )}
      <label className="form-field">
        <span>
          {tr(
            lang,
            "Additional notes (optional)",
            "ព័ត៌មានបន្ថែម (មិនចាំបាច់)",
          )}
        </span>
        <textarea name="notes" rows={3} maxLength={2000} />
      </label>
      <label className="check-field">
        <input name="terms" type="checkbox" required />
        <span>
          {tr(lang, "I agree to the", "ខ្ញុំយល់ព្រមនឹង")}{" "}
          <Link href={`/${lang}/terms`} target="_blank">
            {tr(lang, "Terms & Conditions", "លក្ខខណ្ឌប្រើប្រាស់")}
          </Link>{" "}
          {tr(lang, "and have read the", "និងបានអាន")}{" "}
          <Link href={`/${lang}/privacy`} target="_blank">
            {tr(lang, "Privacy Policy", "គោលការណ៍ឯកជនភាព")}
          </Link>
          .
        </span>
      </label>
      <ErrorText error={state.error} />
      <Submit>{tr(lang, "Continue to payment", "បន្តទៅការទូទាត់")}</Submit>
    </form>
  );
}
export function PaymentMethodSelector({
  lang,
  registrationId,
  khqr,
  card,
}: {
  lang: Locale;
  registrationId: string;
  khqr: boolean;
  card: boolean;
}) {
  const [state, action] = useActionState(beginPayment, { error: "" });
  return (
    <form action={action}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="registrationId" value={registrationId} />
      <fieldset className="payment-methods">
        <legend>
          {tr(lang, "Choose your payment method", "ជ្រើសរើសវិធីបង់ប្រាក់")}
        </legend>
        {khqr && (
          <label>
            <input type="radio" name="method" value="khqr" defaultChecked />
            <span>
              <b className="khqr-word">KHQR</b>
              <strong>{tr(lang, "Pay with KHQR", "បង់ជាមួយ KHQR")}</strong>
              <small>
                {tr(lang, "Cambodian banking apps", "កម្មវិធីធនាគារកម្ពុជា")}
              </small>
            </span>
          </label>
        )}
        {card && (
          <label>
            <input
              type="radio"
              name="method"
              value="card"
              defaultChecked={!khqr}
            />
            <span>
              <b className="card-brands">
                VISA <i>●●</i>
              </b>
              <strong>
                {tr(lang, "Credit / debit card", "កាតឥណទាន / ឥណពន្ធ")}
              </strong>
              <small>Visa · Mastercard</small>
            </span>
          </label>
        )}
      </fieldset>
      <ErrorText error={state.error} />
      {khqr || card ? (
        <Submit>{tr(lang, "Continue securely", "បន្តដោយសុវត្ថិភាព")}</Submit>
      ) : (
        <p>
          {tr(
            lang,
            "Payment methods are currently unavailable.",
            "វិធីទូទាត់មិនទាន់អាចប្រើបានទេ។",
          )}
        </p>
      )}
      <p className="secure-note">
        <ShieldCheck size={16} />
        {tr(
          lang,
          "No card details are collected in this demo.",
          "មិនប្រមូលព័ត៌មានកាតក្នុងការសាកល្បងនេះទេ។",
        )}
      </p>
    </form>
  );
}
export function DemoControls({
  lang,
  payment,
}: {
  lang: Locale;
  payment: Payment;
}) {
  const [state, action] = useActionState(simulateAction, { error: "" });
  const outcomes = [
    ["paid", "Simulate successful payment", "សាកល្បងបង់ប្រាក់ជោគជ័យ"],
    ["pending", "Simulate pending payment", "សាកល្បងការទូទាត់កំពុងរង់ចាំ"],
    ["failed", "Simulate failed payment", "សាកល្បងការទូទាត់បរាជ័យ"],
    ["cancelled", "Cancel payment", "លុបចោលការទូទាត់"],
  ];
  return (
    <div className="demo-controls">
      <p className="eyebrow">
        {tr(
          lang,
          "DEMO CONTROLS · NO MONEY MOVES",
          "សាកល្បង · មិនមានការផ្ទេរប្រាក់",
        )}
      </p>
      <form action={action}>
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="paymentId" value={payment.id} />
        <div className="demo-buttons">
          {outcomes.map(([outcome, en, km]) => (
            <OutcomeButton
              key={outcome}
              outcome={outcome}
              text={tr(lang, en, km)}
            />
          ))}
        </div>
        <ErrorText error={state.error} />
      </form>
    </div>
  );
}
function OutcomeButton({ outcome, text }: { outcome: string; text: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="outcome"
      value={outcome}
      className="button button-secondary small"
      disabled={pending}
    >
      {text}
    </button>
  );
}
export function ContactForm({ lang }: { lang: Locale }) {
  const [state, action] = useActionState(messageAction, { error: "" });
  return state.success ? (
    <div role="status" className="notice success">
      {tr(
        lang,
        "Your demo message has been saved to the admin inbox. No email was sent.",
        "សារសាកល្បងរបស់អ្នកបានរក្សាទុកក្នុងប្រអប់សារអ្នកគ្រប់គ្រង។ មិនបានផ្ញើអ៊ីមែលទេ។",
      )}
    </div>
  ) : (
    <form action={action} className="form-panel">
      <input type="hidden" name="lang" value={lang} />
      <h2>{tr(lang, "Send us a message", "ផ្ញើសារមកយើង")}</h2>
      <Field name="name" label={tr(lang, "Name", "ឈ្មោះ")} />
      <Field name="email" type="email" label={tr(lang, "Email", "អ៊ីមែល")} />
      <label className="form-field">
        <span>{tr(lang, "Your message", "សាររបស់អ្នក")} *</span>
        <textarea name="message" required maxLength={2000} rows={5} />
      </label>
      <label className="check-field">
        <input name="consent" type="checkbox" required />
        <span>
          {tr(
            lang,
            "I agree to my details being used to respond to this enquiry.",
            "ខ្ញុំយល់ព្រមឱ្យប្រើព័ត៌មានរបស់ខ្ញុំដើម្បីឆ្លើយតបសំណួរនេះ។",
          )}{" "}
          <Link href={`/${lang}/privacy`}>
            {tr(lang, "Privacy policy", "គោលការណ៍ឯកជនភាព")}
          </Link>
        </span>
      </label>
      <ErrorText error={state.error} />
      <Submit>{tr(lang, "Save demo enquiry", "រក្សាទុកសារសាកល្បង")}</Submit>
    </form>
  );
}
export function LoginForm({ localDemo }: { localDemo: boolean }) {
  const [state, action] = useActionState(loginAction, { error: "" });
  return (
    <form className="form-panel login-form" action={action}>
      <p className="eyebrow">TM CAMBODIA · ADMIN</p>
      <h1>Welcome back.</h1>
      <p>Sign in to manage your website and courses.</p>
      <Field name="password" label="Admin password" type="password" />
      {localDemo && (
        <p className="notice">
          Local development password: <code>tm-demo-admin</code>
        </p>
      )}
      <ErrorText error={state.error} />
      <Submit>Sign in</Submit>
      <Link className="text-link" href="/en">
        Return to website
      </Link>
    </form>
  );
}
