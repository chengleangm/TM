import Image from "next/image";
import { MapPin, Phone, ArrowUpRight, Flower2 } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { SectionHeading } from "../ui/SectionHeading";
import { ActionLink } from "../ui/ActionLink";
export function CambodiaSection({ t }: { t: Dictionary }) {
  return (
    <section id="cambodia" className="cambodia-section section">
      <div className="container cambodia-grid">
        <div>
          <SectionHeading label={t.cambodiaLabel} title={t.cambodiaTitle} />
          <p>{t.cambodiaText}</p>
          <p>{t.cambodiaExtra}</p>
          <ActionLink href="#contact">{t.teacher}</ActionLink>
        </div>
        <div className="teacher-card">
          <div className="teacher-portrait">
            <Image
              src="/images/samen.jpg"
              alt={t.teacherName}
              fill
              sizes="(max-width: 768px) 90vw, 450px"
            />
            <span>
              <MapPin size={16} />
              {t.country}
            </span>
          </div>
          <div className="teacher-info">
            <p className="eyebrow">{t.localTeacher}</p>
            <h3>{t.teacherName}</h3>
            <p>{t.teacherRole}</p>
            <a href="tel:+85510980840" aria-label={`${t.call}: 010 980 840`}>
              <Phone size={17} />
              010 980 840
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export function LearningSteps({ t }: { t: Dictionary }) {
  return (
    <section id="learn" className="section container learning-section">
      <SectionHeading label={t.stepsLabel} title={t.stepsTitle} />
      <ol className="steps-grid">
        {t.steps.map(([title, text], i) => (
          <li key={title}>
            <span className="step-number">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
export function InfoSessionCTA({ t }: { t: Dictionary }) {
  return (
    <section id="intro" className="intro-section">
      <div className="container intro-grid">
        <Flower2
          className="intro-flower"
          size={350}
          strokeWidth={0.4}
          aria-hidden="true"
        />
        <div>
          <p className="eyebrow">{t.ctaLabel}</p>
          <h2>{t.ctaTitle}</h2>
        </div>
        <div>
          <p>{t.ctaText}</p>
          <ActionLink href="#contact">{t.ctaButton}</ActionLink>
          <p className="intro-note">{t.ctaNote}</p>
        </div>
      </div>
    </section>
  );
}
export function FAQ({ t }: { t: Dictionary }) {
  return (
    <section id="faq" className="section container faq-section">
      <SectionHeading label={t.faqLabel} title={t.faqTitle} />
      <div className="faq-list">
        {t.faqs.map(([question, answer], i) => (
          <details key={question} name="faq">
            <summary>
              <span className="faq-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{question}</h3>
              <span className="faq-plus" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
