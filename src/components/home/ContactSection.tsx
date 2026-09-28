"use client";
import { useRef, useState } from "react";
import { ArrowUpRight, Phone, MapPin } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { officialContact, type Language } from "@/lib/translations";
import { SectionHeading } from "../ui/SectionHeading";
import { validateContact, type ContactData } from "@/lib/contact";
export function ContactSection({
  t,
  lang,
  enabled,
}: {
  t: Dictionary;
  lang: Language;
  enabled: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error" | "unavailable"
  >("idle");
  const formRef = useRef<HTMLFormElement>(null);
  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const data = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    ) as unknown as ContactData;
    const invalid = validateContact(data);
    setErrors(invalid);
    setStatus("idle");
    if (Object.keys(invalid).length) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${Object.keys(invalid)[0]}"]`)
        ?.focus();
      return;
    }
    if (!enabled) {
      setStatus("unavailable");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(15000),
      });
      if (response.status === 503) {
        setStatus("unavailable");
        return;
      }
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      formRef.current?.reset();
    } catch {
      setStatus("error");
    }
  }
  const fields = ["name", "email", "phone", "city"] as const;
  function errorText(key: string) {
    return errors[key] === "email"
      ? t.form.invalidEmail
      : errors[key] === "phone"
        ? t.form.invalidPhone
        : t.form.required;
  }
  return (
    <section id="contact" className="section contact-section">
      <div className="container contact-grid">
        <div>
          <SectionHeading label={t.contactLabel} title={t.contactTitle} />
          <p>{t.contactText}</p>
          <a className="contact-phone" href="tel:+85510980840">
            <Phone size={22} />
            010 980 840
          </a>
          <p className="contact-location">
            <MapPin size={18} />
            {t.teacherRole}
          </p>
          <a
            className="text-link"
            href={officialContact}
            target="_blank"
            rel="noreferrer"
          >
            {t.form.official}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <form
          ref={formRef}
          onSubmit={submit}
          noValidate
          className="contact-form"
          aria-busy={status === "sending"}
        >
          {!enabled && <p className="form-notice">{t.form.unavailable}</p>}
          <div className="form-grid">
            {fields.map((field) => (
              <div className="form-field" key={field}>
                <label htmlFor={`contact-${field}`}>
                  {t.form[field]} <span aria-hidden="true">*</span>
                </label>
                <input
                  id={`contact-${field}`}
                  name={field}
                  type={
                    field === "email"
                      ? "email"
                      : field === "phone"
                        ? "tel"
                        : "text"
                  }
                  autoComplete={
                    {
                      name: "name",
                      email: "email",
                      phone: "tel",
                      city: "address-level2",
                    }[field]
                  }
                  required
                  maxLength={field === "email" ? 254 : 100}
                  aria-invalid={!!errors[field]}
                  aria-describedby={
                    errors[field] ? `error-${field}` : undefined
                  }
                />
                {errors[field] && (
                  <span className="field-error" id={`error-${field}`}>
                    {errorText(field)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="form-field">
            <label htmlFor="contact-language">{t.form.language}</label>
            <select id="contact-language" name="language" defaultValue={lang}>
              <option value="km">ខ្មែរ</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">
              {t.form.message} <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="contact-message"
              name="message"
              rows={4}
              required
              maxLength={3000}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "error-message" : undefined}
            />
            {errors.message && (
              <span className="field-error" id="error-message">
                {errorText("message")}
              </span>
            )}
          </div>
          <div className="consent-field">
            <label>
              <input
                type="checkbox"
                name="consent"
                value="yes"
                required
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? "error-consent" : undefined}
              />
              <span>
                {t.form.consent}{" "}
                <a
                  href="https://kh.tm.org/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  {t.form.privacy}
                </a>
              </span>
            </label>
            {errors.consent && (
              <span id="error-consent" className="field-error">
                {errorText("consent")}
              </span>
            )}
          </div>
          <button
            className="button"
            disabled={status === "sending"}
            type="submit"
          >
            {status === "sending" ? t.form.sending : t.form.submit}
            <ArrowUpRight size={18} />
          </button>
          <div aria-live="polite" aria-atomic="true">
            {status === "success" && (
              <p className="form-success">{t.form.success}</p>
            )}
            {(status === "error" || status === "unavailable") && (
              <p className="field-error form-status">{t.form[status]}</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
