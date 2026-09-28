import Image from "next/image";
import { ArrowDown, Sparkles } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { ActionLink } from "../ui/ActionLink";
export function Hero({ t }: { t: Dictionary }) {
  return (
    <section className="hero">
      <Image
        src="/images/hero.jpg"
        alt={t.heroAlt}
        fill
        priority
        sizes="100vw"
        className="hero-image"
      />
      <div className="hero-shade" />
      <div className="container hero-content">
        <p className="eyebrow hero-eyebrow">{t.eyebrow}</p>
        <p className="hero-brand">{t.brand}</p>
        <h1>{t.heroTitle}</h1>
        <p className="hero-description">{t.heroDescription}</p>
        <div className="hero-actions">
          <ActionLink href="#cambodia">{t.teacher}</ActionLink>
          <ActionLink href="#intro" secondary>
            {t.intro}
          </ActionLink>
        </div>
        <p className="hero-note">
          <Sparkles size={17} aria-hidden="true" />
          {t.heroNote}
        </p>
      </div>
      <div className="hero-bottom">
        <span>{t.scroll}</span>
        <a href="#start" aria-label={t.heroSecondary}>
          <ArrowDown size={19} />
        </a>
        <span className="hero-location">
          11.5564° N &nbsp; 104.9282° E<br />
          {t.country}
        </span>
      </div>
    </section>
  );
}
