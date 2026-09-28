import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Feather,
  UserRoundCheck,
  Microscope,
  Clock3,
  Waves,
} from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { SectionHeading } from "../ui/SectionHeading";
import { ActionLink } from "../ui/ActionLink";
export function TrustSection({ t }: { t: Dictionary }) {
  const icons = [Feather, UserRoundCheck, Microscope, Clock3];
  return (
    <section className="trust-section">
      <div className="container trust-grid">
        {t.trust.map(([title, text], i) => {
          const Icon = icons[i];
          return (
            <div className="trust-item" key={title}>
              <Icon size={27} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <h2>{title}</h2>
                <p>{text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
export function WhereToStart({ t }: { t: Dictionary }) {
  return (
    <section id="start" className="section container">
      <SectionHeading label={t.startLabel} title={t.startTitle} />
      <div className="start-grid">
        {t.startCards.map(([title, description, cta], i) => (
          <Link
            href={i === 0 ? "#what-is-tm" : "#cambodia"}
            key={title}
            className={`start-card start-card-${i}`}
          >
            <div>
              <span className="card-index">0{i + 1} /</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="text-link">
                {cta}
                <ArrowUpRight size={20} aria-hidden="true" />
              </span>
            </div>
            <div className="start-art" aria-hidden="true">
              {i === 0 ? (
                <Image
                  src="/images/practice.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 640px) 35vw, 240px"
                />
              ) : (
                <div className="arch-art">
                  <span />
                  <span />
                  <span />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
export function WhatIsTM({ t }: { t: Dictionary }) {
  return (
    <section id="what-is-tm" className="section container what-grid">
      <div className="water-image">
        <Image
          src="/images/practice.jpg"
          alt={t.waterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="water-caption">
          <Waves size={32} strokeWidth={1} />
          <span>{t.whatAccent}</span>
        </div>
      </div>
      <div className="what-content">
        <SectionHeading label={t.whatLabel} title={t.whatTitle} />
        <p className="accent-line">{t.whatAccent}</p>
        <p>{t.whatText}</p>
        <p>{t.whatExtra}</p>
        <ActionLink href="#learn" secondary>
          {t.whatLink}
        </ActionLink>
      </div>
    </section>
  );
}
