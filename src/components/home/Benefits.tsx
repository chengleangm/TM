import {
  Brain,
  Heart,
  Moon,
  Sprout,
  UsersRound,
  Wind,
  ArrowUpRight,
} from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { SectionHeading } from "../ui/SectionHeading";
import { Carousel } from "../ui/Carousel";
const sources = [
  "https://kh.tm.org/reduce-anxiety",
  "https://kh.tm.org/meditate-for-creativity",
  "https://kh.tm.org/benefits-of-meditation",
  "https://kh.tm.org/lower-blood-pressure",
  "https://kh.tm.org/benefits-of-meditation",
  "https://kh.tm.org/reduce-stress",
];
export function Benefits({ t }: { t: Dictionary }) {
  const icons = [Wind, Brain, Moon, Heart, UsersRound, Sprout];
  return (
    <section id="benefits" className="section benefits-section">
      <div className="container">
        <div className="section-header-row">
          <SectionHeading label={t.benefitsLabel} title={t.benefitsTitle} />
          <p>{t.benefitsIntro}</p>
        </div>
        <Carousel label={t.benefitsTitle} previous={t.previous} next={t.next}>
          {t.benefits.map(([title, description], i) => {
            const Icon = icons[i];
            return (
              <article
                id={`benefit-${i}`}
                className={`benefit-card benefit-${i}`}
                key={title}
              >
                <div className="benefit-visual">
                  <Icon size={78} strokeWidth={0.8} aria-hidden="true" />
                  <span className="orb orb-one" />
                  <span className="orb orb-two" />
                </div>
                <div className="benefit-copy">
                  <span className="card-index">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <a
                    className="text-link"
                    href={sources[i]}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t.learnMore}
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </Carousel>
        <p className="research-note">{t.researchNote}</p>
      </div>
    </section>
  );
}
