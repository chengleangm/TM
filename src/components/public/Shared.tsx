import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  MapPin,
  CalendarDays,
  ArrowRight,
  Check,
} from "lucide-react";
import type {
  Bilingual,
  Course,
  Database,
  Locale,
  Person,
  Center,
} from "@/types/platform";
import { date, label, money, statusLabel, tr } from "@/lib/platform";
import { seats } from "@/services/repository";

export function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      className={`button ${secondary ? "button-secondary" : ""}`}
      href={href}
    >
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
export function Breadcrumb({
  lang,
  items,
}: {
  lang: Locale;
  items: { label: string; href?: string }[];
}) {
  return (
    <nav
      className="breadcrumb"
      aria-label={tr(lang, "Breadcrumb", "ទីតាំងទំព័រ")}
    >
      <Link href={`/${lang}`}>{label("home", lang)}</Link>
      {items.map((item, i) => (
        <span key={i}>
          {" "}
          /{" "}
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </span>
      ))}
    </nav>
  );
}
export function PageHero({
  lang,
  title,
  description,
  eyebrow,
  image,
}: {
  lang: Locale;
  title: string;
  description?: string;
  eyebrow?: string;
  image?: string;
}) {
  return (
    <section className={`page-hero ${image ? "with-image" : ""}`}>
      <div className="container page-hero-inner">
        <div>
          <p className="eyebrow">
            {eyebrow ??
              tr(
                lang,
                "A LITTLE TIME FOR YOURSELF",
                "ពេលបន្តិចសម្រាប់ខ្លួនអ្នក",
              )}
          </p>
          <h1>{title}</h1>
          {description && <p className="page-lede">{description}</p>}
        </div>
        {image && (
          <div className="page-hero-image">
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  link,
}: {
  eyebrow?: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="platform-section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {link && (
        <Link className="text-link" href={link.href}>
          {link.label}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function CTASection({ lang }: { lang: Locale }) {
  return (
    <section className="platform-cta">
      <div className="container">
        <p className="eyebrow">
          {tr(
            lang,
            "NO EXPERIENCE NEEDED. JUST CURIOSITY.",
            "មិនត្រូវការបទពិសោធន៍ទេ។ គ្រាន់តែចង់ស្វែងយល់។",
          )}
        </p>
        <h2>
          {tr(
            lang,
            "Your first step can be a conversation.",
            "ជំហានដំបូងរបស់អ្នកអាចជាការសន្ទនា។",
          )}
        </h2>
        <p>
          {tr(
            lang,
            "Meet a teacher, ask your questions, and see where it takes you.",
            "ជួបគ្រូ សួរសំណួរ និងស្វែងយល់ពីជំហានបន្ទាប់។",
          )}
        </p>
        <Button href={`/${lang}/contact`}>
          {tr(lang, "Book an intro session", "កក់វគ្គណែនាំ")}
        </Button>
      </div>
    </section>
  );
}
export function Footer({ lang, db }: { lang: Locale; db: Database }) {
  return (
    <footer className="platform-footer">
      <div className="container">
        <div className="platform-footer-grid">
          <div>
            <p className="eyebrow">{db.settings.siteName}</p>
            <h2>{db.settings.footer[lang]}</h2>
            <p>
              {tr(
                lang,
                "Personally taught. Practised with ease. Here in Cambodia.",
                "បង្រៀនដោយផ្ទាល់។ អនុវត្តដោយងាយស្រួល។ នៅកម្ពុជា។",
              )}
            </p>
          </div>
          {[
            ["about", "what-is-tm", "benefits", "learn"],
            ["courses", "teachers", "centers", "contact"],
            ["testimonials", "videos", "faq", "privacy", "terms"],
          ].map((group, i) => (
            <div key={i}>
              {group.map((k) => (
                <Link key={k} href={`/${lang}/${k}`}>
                  {label(k, lang)}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="platform-footer-bottom">
          <p>
            © {new Date().getFullYear()} Maharishi Foundation for World Peace –
            Cambodia
          </p>
          <a href={`tel:${db.settings.phone.replace(/\s/g, "")}`}>
            {db.settings.phone}
          </a>
          <Link href="/admin">{tr(lang, "Admin", "អ្នកគ្រប់គ្រង")}</Link>
        </div>
      </div>
    </footer>
  );
}
export function CourseCard({
  course,
  lang,
  db,
}: {
  course: Course;
  lang: Locale;
  db: Database;
}) {
  const center = db.centers.find((c) => c.id === course.centerId);
  const teacher = db.teachers.find((t) => t.id === course.teacherId);
  const count = seats(db, course.id);
  return (
    <article className="course-card">
      <Link className="course-photo" href={`/${lang}/courses/${course.slug}`}>
        <Image
          src={course.image}
          alt={course.title[lang]}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        <span className="photo-badge">
          {tr(
            lang,
            course.type === "intro"
              ? "INTRO SESSION"
              : course.type === "followup"
                ? "FOLLOW-UP"
                : "PERSONAL INSTRUCTION",
            course.type === "intro"
              ? "វគ្គណែនាំ"
              : course.type === "followup"
                ? "វគ្គតាមដាន"
                : "ការបង្រៀនផ្ទាល់",
          )}
        </span>
      </Link>
      <div className="course-card-body">
        <div className="card-meta">
          <span>
            <MapPin size={14} />
            {center?.city[lang]}
          </span>
          <span
            className={`status ${course.status === "open" && count ? "open" : ""}`}
          >
            {statusLabel(count === 0 ? "full" : course.status, lang)}
          </span>
        </div>
        <h3>
          <Link href={`/${lang}/courses/${course.slug}`}>
            {course.title[lang]}
          </Link>
        </h3>
        <p className="course-teacher">
          {tr(lang, "With", "ជាមួយ")} {teacher?.name[lang]}
        </p>
        <p className="icon-line">
          <CalendarDays size={16} />
          {date(course.start, lang)}
        </p>
        <div className="course-card-bottom">
          <div>
            <strong>
              {course.price
                ? money(course.price)
                : tr(lang, "Free", "ឥតគិតថ្លៃ")}
            </strong>
            <small>
              {tr(lang, `${count} places available`, `នៅសល់ ${count} កន្លែង`)}
            </small>
          </div>
          <Link
            className="circle-link"
            href={`/${lang}/courses/${course.slug}`}
            aria-label={`${tr(lang, "View course", "មើលវគ្គ")} ${course.title[lang]}`}
          >
            <ArrowUpRight />
          </Link>
        </div>
      </div>
    </article>
  );
}
export function CourseGrid({
  courses,
  lang,
  db,
}: {
  courses: Course[];
  lang: Locale;
  db: Database;
}) {
  return (
    <div className="platform-grid three">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} lang={lang} db={db} />
      ))}
    </div>
  );
}
export function TeacherCard({
  teacher,
  lang,
}: {
  teacher: Person;
  lang: Locale;
}) {
  return (
    <article className="person-card">
      <div className="person-photo">
        <Image
          src={teacher.image}
          alt={teacher.name[lang]}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
        />
      </div>
      <div>
        <p className="eyebrow">
          {tr(lang, "YOUR LOCAL TEAM", "ក្រុមការងារមូលដ្ឋាន")}
        </p>
        <h3>{teacher.name[lang]}</h3>
        <p>{teacher.description[lang]}</p>
        <Button href={`/${lang}/teachers/${teacher.slug}`}>
          {tr(lang, "Meet your teacher", "ជួបគ្រូរបស់អ្នក")}
        </Button>
      </div>
    </article>
  );
}
export function CenterCard({ center, lang }: { center: Center; lang: Locale }) {
  return (
    <article className="soft-card">
      <MapPin size={28} />
      <h3>{center.name[lang]}</h3>
      <p>{center.address[lang]}</p>
      <p>{center.description[lang]}</p>
      <Link className="text-link" href={`/${lang}/centers/${center.slug}`}>
        {tr(lang, "Explore location", "មើលទីតាំង")}
        <ArrowUpRight size={18} />
      </Link>
    </article>
  );
}
export function FAQAccordion({ content }: { content: string }) {
  return (
    <div className="platform-faq">
      {content
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((entry, i) => {
          const [q, ...answer] = entry.split("\n");
          return (
            <details key={i}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{answer.join("\n")}</p>
            </details>
          );
        })}
    </div>
  );
}
export function Prose({ text }: { text: string }) {
  return (
    <div className="platform-prose">
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}
export function Included({
  content,
  lang,
}: {
  content: Bilingual;
  lang: Locale;
}) {
  return (
    <ul className="included">
      {content[lang].split("\n").map((item) => (
        <li key={item}>
          <Check size={18} />
          {item}
        </li>
      ))}
    </ul>
  );
}
