import Image from "next/image";
import { ArrowUpRight, Play, Quote } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import { SectionHeading } from "../ui/SectionHeading";
import { Carousel } from "../ui/Carousel";
export function Testimonials({ t }: { t: Dictionary }) {
  return (
    <section className="section container stories-section">
      <div className="section-header-row">
        <SectionHeading label={t.storiesLabel} title={t.storiesTitle} />
        <p>{t.storiesIntro}</p>
      </div>
      <Carousel label={t.storiesTitle} previous={t.previous} next={t.next}>
        <article className="story-card video-card">
          <a
            href="https://player.vimeo.com/video/259069130?autoplay=0"
            target="_blank"
            rel="noreferrer"
            aria-label={t.videoTitle}
          >
            <div className="story-image">
              <Image
                src="/images/cameron.jpg"
                alt="Cameron Diaz"
                fill
                sizes="(max-width: 640px) 90vw, 560px"
              />
              <span className="play-icon">
                <Play size={24} fill="currentColor" />
              </span>
              <span className="video-label">
                {t.watch}
                <ArrowUpRight size={16} />
              </span>
            </div>
          </a>
          <div className="story-copy">
            <h3>{t.cameronQuote}</h3>
            <div>
              <strong>Cameron Diaz</strong>
              <span>{t.cameronRole}</span>
            </div>
            <small>{t.videoNote}</small>
          </div>
        </article>
        <article className="story-card quote-card">
          <Quote size={42} strokeWidth={1} aria-hidden="true" />
          <h3>{t.paulQuote}</h3>
          <div className="quote-person">
            <Image
              src="/images/paul.png"
              alt="Paul McCartney"
              width={64}
              height={64}
            />
            <div>
              <strong>Paul McCartney</strong>
              <span>{t.paulRole}</span>
            </div>
          </div>
          <a
            href="https://kh.tm.org/"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            {t.readStory}
            <ArrowUpRight size={18} />
          </a>
        </article>
      </Carousel>
    </section>
  );
}
