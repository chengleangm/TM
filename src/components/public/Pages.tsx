import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Feather, Heart, Sun, Waves, Play } from "lucide-react";
import { isLanguage, dictionaries } from "@/lib/translations";
import { date, label, money, statusLabel, tr } from "@/lib/platform";
import { repository, seats } from "@/services/repository";
import { demoMode, isAdmin } from "@/services/auth";
import type { Locale, Center } from "@/types/platform";
import {
  Button,
  PageHero,
  SectionTitle,
  CTASection,
  CourseGrid,
  TeacherCard,
  CenterCard,
  FAQAccordion,
  Prose,
  Breadcrumb,
  Included,
} from "./Shared";
import { ContactForm, RegistrationForm } from "./Forms";
import { ContactSection } from "@/components/home/ContactSection";
export type PublicProps = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function pageMetadata(
  slug: string,
  props: PublicProps,
): Promise<Metadata> {
  const { lang } = await props.params;
  if (!isLanguage(lang)) return {};
  const db = await repository();
  const p = db.pages.find((p) => p.slug === slug);
  const suffix = slug === "home" ? "" : `/${slug}`;
  return {
    metadataBase: new URL("https://kh.tm.org"),
    title: `${p?.title[lang].replace(/\n/g, " ") ?? label(slug, lang)} | ${db.settings.siteName}`,
    description: (p?.seo[lang] || db.settings.seo[lang]).slice(0, 170),
    alternates: {
      canonical: `/${lang}${suffix}`,
      languages: { en: `/en${suffix}`, km: `/km${suffix}` },
    },
    robots:
      ["register", "checkout"].includes(slug) || !p?.published
        ? { index: false, follow: false }
        : undefined,
    openGraph: { images: [p?.image ?? "/images/hero.jpg"] },
  };
}
export function BenefitsPreview({ lang }: { lang: Locale }) {
  const items = [
    ["A calmer everyday", "ជីវិតប្រចាំថ្ងៃស្ងប់ជាងមុន", Feather],
    ["Room for fresh thinking", "ពេលសម្រាប់ការគិតថ្មី", Sun],
    ["Time to rest", "ពេលសម្រាប់សម្រាក", Waves],
    ["Space to reconnect", "ពេលសម្រាប់ទំនាក់ទំនង", Heart],
  ] as const;
  return (
    <div className="platform-grid four">
      {items.map(([en, km, Icon], i) => (
        <article className="benefit-tile" key={en}>
          <Icon size={30} strokeWidth={1.3} />
          <span>0{i + 1}</span>
          <h3>{tr(lang, en, km)}</h3>
        </article>
      ))}
    </div>
  );
}
export function TestimonialCards({ lang }: { lang: Locale }) {
  return (
    <div className="platform-grid three">
      {[
        {
          name: "Cameron Diaz",
          image: "/images/cameron.jpg",
          en: "On discovering how approachable meditation can be.",
          km: "អំពីការស្វែងយល់ថាការតាំងសមាធិងាយស្រួលយ៉ាងណា។",
        },
        {
          name: "Paul McCartney",
          image: "/images/paul.png",
          en: "On creating a moment of calm within a busy life.",
          km: "អំពីការបង្កើតពេលស្ងប់ក្នុងជីវិតមមាញឹក។",
        },
        {
          name: "Ellen DeGeneres",
          image: "",
          en: "On making time for meditation in everyday life.",
          km: "អំពីការទុកពេលតាំងសមាធិក្នុងជីវិតប្រចាំថ្ងៃ។",
        },
      ].map((s) => (
        <article className="testimonial-tile" key={s.name}>
          <span className="quote-mark">“</span>
          <h3>{tr(lang, s.en, s.km)}</h3>
          <div>
            {s.image && <Image src={s.image} alt="" width={48} height={48} />}
            <strong>{s.name}</strong>
          </div>
          <a
            className="text-link"
            href="https://kh.tm.org/"
            target="_blank"
            rel="noreferrer"
          >
            {tr(lang, "Read the original story", "អានរឿងរ៉ាវដើម")}
            <ArrowUpRight size={15} />
          </a>
        </article>
      ))}
    </div>
  );
}
export async function renderPublic(
  slug: string,
  { params, searchParams }: PublicProps,
) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const q = await searchParams;
  const db = await repository();
  const p = db.pages.find((p) => p.slug === slug);
  if (!p || (!p.published && !(q.preview === "1" && (await isAdmin()))))
    notFound();
  const preview = q.preview === "1" && (await isAdmin());
  if (slug === "home")
    return (
      <>
        {preview && <div className="notice">Admin preview</div>}
        <section className="platform-home-hero">
          <Image src={p.image} alt="" fill priority sizes="100vw" />
          <div className="platform-home-shade" />
          <div className="container">
            <p className="eyebrow">
              {tr(
                lang,
                "PERSONAL. NATURAL. HERE IN CAMBODIA.",
                "ផ្ទាល់ខ្លួន។ ធម្មជាតិ។ នៅកម្ពុជា។",
              )}
            </p>
            <h1>{p.title[lang]}</h1>
            <p>{p.content[lang]}</p>
            <div className="button-row">
              <Button href={`/${lang}/courses`}>
                {tr(lang, "Find your course", "ស្វែងរកវគ្គរបស់អ្នក")}
              </Button>
              <Button href={`/${lang}/what-is-tm`} secondary>
                {tr(lang, "Discover TM", "ស្វែងយល់ពី TM")}
              </Button>
            </div>
            <span className="hero-caption">
              {tr(
                lang,
                "A little pause. A new beginning.",
                "ការសម្រាកបន្តិច។ ការចាប់ផ្តើមថ្មី។",
              )}
            </span>
          </div>
        </section>
        <div className="platform-trust">
          <div className="container">
            <span>{tr(lang, "Personally taught", "បង្រៀនដោយផ្ទាល់")}</span>
            <span>
              {tr(lang, "20 minutes, twice a day", "២០ នាទី ពីរដងក្នុងមួយថ្ងៃ")}
            </span>
            <span>
              {tr(lang, "No experience needed", "មិនត្រូវការបទពិសោធន៍")}
            </span>
          </div>
        </div>
        <section className="container platform-section intro-split">
          <div>
            <p className="eyebrow">
              {tr(
                lang,
                "MEET TRANSCENDENTAL MEDITATION",
                "ស្វែងយល់ពីការតាំងសមាធិ TM",
              )}
            </p>
            <h2>
              {tr(
                lang,
                "You don’t need to\nquiet your mind.",
                "អ្នកមិនចាំបាច់ព្យាយាម\nធ្វើឱ្យចិត្តស្ងប់ទេ។",
              )}
            </h2>
          </div>
          <div>
            <p>
              {tr(
                lang,
                "A simple, natural practice. A little space in your day to let the mind settle, without concentration or trying to stop your thoughts.",
                "ការអនុវត្តងាយស្រួល និងធម្មជាតិ។ ពេលបន្តិចក្នុងថ្ងៃដើម្បីឱ្យចិត្តស្ងប់ ដោយមិនបាច់ផ្តោត ឬព្យាយាមបញ្ឈប់គំនិត។",
              )}
            </p>
            <Button href={`/${lang}/what-is-tm`} secondary>
              {tr(lang, "What is TM?", "តើ TM ជាអ្វី?")}
            </Button>
          </div>
        </section>
        <section className="tinted-section">
          <div className="container platform-section">
            <SectionTitle
              eyebrow={tr(
                lang,
                "MORE ROOM FOR WHAT MATTERS",
                "ពេលសម្រាប់អ្វីដែលសំខាន់",
              )}
              title={tr(
                lang,
                "Find your everyday balance.",
                "ស្វែងរកតុល្យភាពប្រចាំថ្ងៃ។",
              )}
              link={{
                href: `/${lang}/benefits`,
                label: tr(
                  lang,
                  "Explore the benefits",
                  "ស្វែងយល់ពីអត្ថប្រយោជន៍",
                ),
              }}
            />
            <BenefitsPreview lang={lang} />
          </div>
        </section>
        <section className="container platform-section">
          <SectionTitle
            eyebrow={tr(
              lang,
              "YOUR JOURNEY STARTS HERE",
              "ដំណើររបស់អ្នកចាប់ផ្តើមនៅទីនេះ",
            )}
            title={tr(
              lang,
              "A small step. A personal beginning.",
              "ជំហានតូច។ ការចាប់ផ្តើមផ្ទាល់ខ្លួន។",
            )}
            link={{ href: `/${lang}/learn`, label: label("learn", lang) }}
          />
          <div className="platform-grid three">
            {[
              ["Meet your teacher", "ជួបគ្រូរបស់អ្នក"],
              ["Learn personally", "រៀនដោយផ្ទាល់"],
              ["Build your practice", "បង្កើតទម្លាប់អនុវត្ត"],
            ].map(([en, km], i) => (
              <div className="step-tile" key={en}>
                <span>0{i + 1}</span>
                <h3>{tr(lang, en, km)}</h3>
              </div>
            ))}
          </div>
        </section>
        <section className="container platform-section section-divider">
          <SectionTitle
            eyebrow={tr(lang, "LEARN WITH US", "រៀនជាមួយយើង")}
            title={tr(
              lang,
              "Make time for a new beginning.",
              "ទុកពេលសម្រាប់ការចាប់ផ្តើមថ្មី។",
            )}
            link={{
              href: `/${lang}/courses`,
              label: tr(lang, "View all courses", "មើលវគ្គទាំងអស់"),
            }}
          />
          <CourseGrid
            courses={db.courses
              .filter((c) => c.status !== "archived")
              .slice(0, 3)}
            lang={lang}
            db={db}
          />
        </section>
        <section className="tinted-section">
          <div className="container platform-section">
            <SectionTitle
              title={tr(
                lang,
                "A little stillness. Different stories.",
                "ភាពស្ងប់បន្តិច។ រឿងរ៉ាវខុសគ្នា។",
              )}
              link={{
                href: `/${lang}/testimonials`,
                label: tr(lang, "Read more", "អានបន្ថែម"),
              }}
            />
            <TestimonialCards lang={lang} />
          </div>
        </section>
        <section className="container platform-section">
          <SectionTitle
            title={tr(
              lang,
              "Personal guidance, closer to home.",
              "ការណែនាំផ្ទាល់ខ្លួន នៅជិតអ្នក។",
            )}
            link={{
              href: `/${lang}/centers`,
              label: tr(lang, "Find a center", "ស្វែងរកមជ្ឈមណ្ឌល"),
            }}
          />
          <div className="platform-grid two">
            {db.centers
              .filter((c) => c.published)
              .map((c) => (
                <CenterCard key={c.id} center={c} lang={lang} />
              ))}
          </div>
        </section>
        <CTASection lang={lang} />
      </>
    );
  const hero = (
    <>
      {preview && (
        <div className="notice">
          Admin preview · {p.published ? "Published" : "Draft"}
        </div>
      )}
      <div className="container">
        <Breadcrumb lang={lang} items={[{ label: label(slug, lang) }]} />
      </div>
      <PageHero
        lang={lang}
        title={p.title[lang]}
        description={
          [
            "about",
            "what-is-tm",
            "benefits",
            "learn",
            "faq",
            "privacy",
            "terms",
          ].includes(slug)
            ? undefined
            : p.content[lang]
        }
        image={["about", "what-is-tm"].includes(slug) ? p.image : undefined}
      />
    </>
  );
  let body: React.ReactNode;
  if (slug === "courses") {
    const search = typeof q.search === "string" ? q.search.toLowerCase() : "";
    const courses = db.courses.filter(
      (c) =>
        c.status !== "archived" &&
        (!q.location || c.centerId === q.location) &&
        (!q.type || c.type === q.type) &&
        (!q.date || c.start >= String(q.date)) &&
        (!q.language || c.language === q.language || c.language === "both") &&
        (!q.availability ||
          (q.availability === "open"
            ? c.status === "open" && seats(db, c.id) > 0
            : c.status !== "open" || seats(db, c.id) === 0)) &&
        (!search ||
          `${c.title.en} ${c.title.km}`.toLowerCase().includes(search)),
    );
    body = (
      <>
        <form className="course-filters" action={`/${lang}/courses`}>
          <label>
            {tr(lang, "Search courses", "ស្វែងរកវគ្គ")}
            <input
              name="search"
              type="search"
              defaultValue={String(q.search ?? "")}
              placeholder={tr(lang, "Find your course…", "ស្វែងរកវគ្គ…")}
            />
          </label>
          <label>
            {tr(lang, "Location", "ទីតាំង")}
            <select name="location" defaultValue={String(q.location ?? "")}>
              <option value="">
                {tr(lang, "All locations", "គ្រប់ទីតាំង")}
              </option>
              {db.centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city[lang]}
                </option>
              ))}
            </select>
          </label>
          <label>
            {tr(lang, "Course type", "ប្រភេទវគ្គ")}
            <select name="type" defaultValue={String(q.type ?? "")}>
              <option value="">{tr(lang, "All types", "គ្រប់ប្រភេទ")}</option>
              <option value="course">{tr(lang, "TM course", "វគ្គ TM")}</option>
              <option value="intro">
                {tr(lang, "Intro session", "វគ្គណែនាំ")}
              </option>
              <option value="followup">
                {tr(lang, "Follow-up", "វគ្គតាមដាន")}
              </option>
            </select>
          </label>
          <label>
            {tr(lang, "Starting from", "ចាប់ពីថ្ងៃ")}
            <input
              type="date"
              name="date"
              defaultValue={String(q.date ?? "")}
            />
          </label>
          <label>
            {tr(lang, "Availability", "កន្លែងទំនេរ")}
            <select
              name="availability"
              defaultValue={String(q.availability ?? "")}
            >
              <option value="">{tr(lang, "All courses", "គ្រប់វគ្គ")}</option>
              <option value="open">{tr(lang, "Available", "មានកន្លែង")}</option>
              <option value="closed">
                {tr(lang, "Full / closed", "ពេញ / បិទ")}
              </option>
            </select>
          </label>
          <label>
            {tr(lang, "Language", "ភាសា")}
            <select name="language" defaultValue={String(q.language ?? "")}>
              <option value="">{tr(lang, "All languages", "គ្រប់ភាសា")}</option>
              <option value="km">ខ្មែរ</option>
              <option value="en">English</option>
            </select>
          </label>
          <button className="button small">
            {tr(lang, "Find courses", "ស្វែងរកវគ្គ")}
          </button>
          <Link href={`/${lang}/courses`} className="text-link">
            {tr(lang, "Reset", "កំណត់ឡើងវិញ")}
          </Link>
        </form>
        <div className="results-line">
          <span>
            {tr(
              lang,
              `${courses.length} courses to explore`,
              `មាន ${courses.length} វគ្គ`,
            )}
          </span>
          <span>
            {tr(
              lang,
              "All times are Cambodia time",
              "ពេលវេលាទាំងអស់ជាម៉ោងកម្ពុជា",
            )}
          </span>
        </div>
        {courses.length ? (
          <CourseGrid courses={courses} lang={lang} db={db} />
        ) : (
          <div className="empty-state">
            <h2>
              {tr(
                lang,
                "No courses match just yet.",
                "មិនមានវគ្គត្រូវនឹងការស្វែងរកទេ។",
              )}
            </h2>
            <Link href={`/${lang}/courses`}>
              {tr(lang, "Clear filters", "សម្អាតតម្រង")}
            </Link>
          </div>
        )}
      </>
    );
  } else if (slug === "teachers")
    body = (
      <div className="platform-grid two">
        {db.teachers
          .filter((t) => t.published)
          .map((t) => (
            <TeacherCard key={t.id} teacher={t} lang={lang} />
          ))}
      </div>
    );
  else if (slug === "centers")
    body = (
      <div className="platform-grid two">
        {db.centers
          .filter((c) => c.published)
          .map((c) => (
            <CenterCard key={c.id} center={c} lang={lang} />
          ))}
      </div>
    );
  else if (slug === "faq") body = <FAQAccordion content={p.content[lang]} />;
  else if (slug === "testimonials") body = <TestimonialCards lang={lang} />;
  else if (slug === "videos")
    body = (
      <div className="platform-grid two">
        <a
          className="video-tile"
          href="https://player.vimeo.com/video/259069130?autoplay=0"
          target="_blank"
          rel="noreferrer"
        >
          <div>
            <Image
              src="/images/cameron.jpg"
              alt="Cameron Diaz"
              fill
              sizes="(max-width:768px) 100vw, 50vw"
            />
            <span>
              <Play />
            </span>
          </div>
          <h3>
            {tr(
              lang,
              "Cameron Diaz on learning TM",
              "Cameron Diaz អំពីការរៀន TM",
            )}
          </h3>
          <p>
            {tr(lang, "English · Opens on Vimeo", "អង់គ្លេស · បើកលើ Vimeo")}
          </p>
        </a>
        <div className="soft-card">
          <h3>
            {tr(
              lang,
              "Prefer a personal introduction?",
              "ចង់បានការណែនាំផ្ទាល់ខ្លួន?",
            )}
          </h3>
          <p>
            {tr(
              lang,
              "Meet a teacher, explore the practice, and ask the questions that matter to you.",
              "ជួបគ្រូ ស្វែងយល់ពីការអនុវត្ត និងសួរសំណួរដែលសំខាន់សម្រាប់អ្នក។",
            )}
          </p>
          <Button href={`/${lang}/contact`}>
            {tr(lang, "Arrange an introduction", "រៀបចំវគ្គណែនាំ")}
          </Button>
        </div>
      </div>
    );
  else if (slug === "contact")
    body = (
      <div className="platform-grid two">
        <div className="contact-details">
          <p className="eyebrow">TM CAMBODIA</p>
          <h2>
            {tr(
              lang,
              "Let’s find your next step.",
              "ស្វែងរកជំហានបន្ទាប់របស់អ្នក។",
            )}
          </h2>
          <a
            className="contact-phone"
            href={`tel:${db.settings.phone.replace(/\s/g, "")}`}
          >
            {db.settings.phone}
          </a>
          {db.settings.email && (
            <a href={`mailto:${db.settings.email}`}>{db.settings.email}</a>
          )}
          <p>
            {tr(
              lang,
              "Khmer & English · By appointment",
              "ខ្មែរ និងអង់គ្លេស · តាមការណាត់ជួប",
            )}
          </p>
          <Link className="text-link" href={`/${lang}/centers`}>
            {tr(lang, "Explore our locations", "មើលទីតាំងរបស់យើង")}
          </Link>
        </div>
        {demoMode() ? (
          <ContactForm lang={lang} />
        ) : (
          <ContactSection
            t={dictionaries[lang]}
            lang={lang}
            enabled={
              !!process.env.CONTACT_WEBHOOK_URL?.startsWith("https://") &&
              !!process.env.CONTACT_WEBHOOK_TOKEN
            }
          />
        )}
      </div>
    );
  else if (slug === "register") {
    const courses = db.courses.filter(
      (c) => c.status === "open" && seats(db, c.id) > 0,
    );
    body =
      demoMode() && courses.length ? (
        <div className="registration-layout">
          <RegistrationForm
            lang={lang}
            courses={courses.map((course) => ({
              ...course,
              dateRange: `${date(course.start, lang)} – ${date(course.end, lang)}`,
            }))}
            selected={
              courses.some((c) => c.id === q.course)
                ? String(q.course)
                : courses[0].id
            }
            centers={db.centers.map((c) => ({ id: c.id, name: c.name[lang] }))}
          />
          <aside className="soft-card">
            <p className="eyebrow">
              {tr(lang, "YOUR NEXT CHAPTER", "ជំហានបន្ទាប់របស់អ្នក")}
            </p>
            <h2>
              {tr(
                lang,
                "A little time.\nJust for you.",
                "ពេលបន្តិច។\nសម្រាប់ខ្លួនអ្នក។",
              )}
            </h2>
            <p>
              {tr(
                lang,
                "1. Your details\n2. Review & payment\n3. Registration confirmation",
                "១. ព័ត៌មានរបស់អ្នក\n២. ពិនិត្យ និងទូទាត់\n៣. បញ្ជាក់ការចុះឈ្មោះ",
              )}
            </p>
            <p>
              {tr(
                lang,
                "Questions before you begin? We are here to help.",
                "មានសំណួរមុនចាប់ផ្តើម? យើងនៅទីនេះដើម្បីជួយ។",
              )}
            </p>
            <Button href={`/${lang}/contact`} secondary>
              {label("contact", lang)}
            </Button>
          </aside>
        </div>
      ) : (
        <div className="empty-state">
          <h2>
            {tr(
              lang,
              "Please contact us to arrange your course.",
              "សូមទាក់ទងយើងដើម្បីរៀបចំវគ្គរបស់អ្នក។",
            )}
          </h2>
          <Button href={`/${lang}/contact`}>{label("contact", lang)}</Button>
        </div>
      );
  } else
    body = (
      <>
        <div className="reading-width">
          <Prose text={p.content[lang]} />
        </div>
        {slug === "benefits" && <BenefitsPreview lang={lang} />}
        <div className="reading-width button-row">
          <Button href={`/${lang}/${slug === "learn" ? "courses" : "learn"}`}>
            {tr(
              lang,
              slug === "learn" ? "Find a course" : "How to learn TM",
              slug === "learn" ? "ស្វែងរកវគ្គ" : "របៀបរៀន TM",
            )}
          </Button>
        </div>
      </>
    );
  return (
    <>
      {hero}
      <section className="container platform-section page-body">{body}</section>
      {!["register", "privacy", "terms", "contact"].includes(slug) && (
        <CTASection lang={lang} />
      )}
    </>
  );
}
export async function renderDetail(
  kind: "courses" | "teachers" | "centers",
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) notFound();
  const db = await repository();
  const item = db[kind].find((x) => x.slug === slug);
  if (!item) notFound();
  if ("published" in item && !item.published) notFound();
  if ("status" in item && item.status === "archived") notFound();
  if (kind === "courses") {
    const c = db.courses.find((c) => c.slug === slug)!;
    const center = db.centers.find((x) => x.id === c.centerId)!;
    const teacher = db.teachers.find((x) => x.id === c.teacherId)!;
    const available = c.status === "open" && seats(db, c.id) > 0;
    const faq = db.pages.find((p) => p.slug === "faq" && p.published);
    return (
      <>
        <div className="container">
          <Breadcrumb
            lang={lang}
            items={[
              { label: label("courses", lang), href: `/${lang}/courses` },
              { label: c.title[lang] },
            ]}
          />
        </div>
        <PageHero
          lang={lang}
          title={c.title[lang]}
          description={c.description[lang]}
          image={c.image}
        />
        <section className="container platform-section detail-layout">
          <div>
            <p className="eyebrow">
              {tr(lang, "A PRACTICE FOR LIFE", "ការអនុវត្តសម្រាប់ជីវិត")}
            </p>
            <h2>
              {tr(
                lang,
                "Personal instruction.\nA comfortable beginning.",
                "ការបង្រៀនផ្ទាល់ខ្លួន។\nការចាប់ផ្តើមងាយស្រួល។",
              )}
            </h2>
            <div className="detail-facts">
              <div>
                <span>{tr(lang, "Your teacher", "គ្រូរបស់អ្នក")}</span>
                <Link href={`/${lang}/teachers/${teacher.slug}`}>
                  {teacher.name[lang]} ↗
                </Link>
              </div>
              <div>
                <span>{tr(lang, "Location", "ទីតាំង")}</span>
                <Link href={`/${lang}/centers/${center.slug}`}>
                  {center.name[lang]} ↗
                </Link>
              </div>
              <div>
                <span>{tr(lang, "Dates", "កាលបរិច្ឆេទ")}</span>
                <strong>
                  {date(c.start, lang)} – {date(c.end, lang)}
                </strong>
              </div>
              <div>
                <span>{tr(lang, "Language", "ភាសា")}</span>
                <strong>
                  {c.language === "both"
                    ? tr(lang, "Khmer & English", "ខ្មែរ និងអង់គ្លេស")
                    : c.language === "km"
                      ? "ខ្មែរ"
                      : "English"}
                </strong>
              </div>
            </div>
            <h3>{tr(lang, "Your schedule", "កាលវិភាគរបស់អ្នក")}</h3>
            <Prose text={c.schedule[lang]} />
            <h3>{tr(lang, "What is included", "អ្វីដែលរួមបញ្ចូល")}</h3>
            <Included content={c.included} lang={lang} />
            <h3>{tr(lang, "Before you begin", "មុនពេលចាប់ផ្តើម")}</h3>
            <Prose text={c.requirements[lang]} />
            <a
              className="text-link"
              href={center.map}
              target="_blank"
              rel="noreferrer"
            >
              {tr(lang, "View city on Google Maps", "មើលក្រុងនៅលើ Google Maps")}
              <ArrowUpRight size={16} />
            </a>
            <p>{center.address[lang]}</p>
            {faq && (
              <>
                <h3>
                  {tr(
                    lang,
                    "Your questions, answered",
                    "ចម្លើយសម្រាប់សំណួររបស់អ្នក",
                  )}
                </h3>
                <FAQAccordion content={faq.content[lang]} />
              </>
            )}
          </div>
          <aside className="booking-card">
            <p className="eyebrow">
              {tr(lang, "YOUR INVESTMENT IN YOU", "ការវិនិយោគលើខ្លួនអ្នក")}
            </p>
            <div className="booking-price">
              {money(c.price)}
              <small>USD</small>
            </div>
            <p>
              {c.priceKhr.toLocaleString()} KHR ·{" "}
              {tr(lang, "sample local price", "តម្លៃគំរូ")}
            </p>
            <hr />
            <p className="icon-line">{date(c.start, lang)}</p>
            <p>{center.city[lang]}</p>
            <p className="status open">
              {available
                ? tr(
                    lang,
                    `${seats(db, c.id)} places available`,
                    `នៅសល់ ${seats(db, c.id)} កន្លែង`,
                  )
                : statusLabel(c.status === "open" ? "full" : c.status, lang)}
            </p>
            {available ? (
              <Button href={`/${lang}/register?course=${c.id}`}>
                {tr(lang, "Register & pay", "ចុះឈ្មោះ និងបង់ប្រាក់")}
              </Button>
            ) : (
              <Button href={`/${lang}/contact`}>
                {tr(lang, "Ask about the next course", "សួរអំពីវគ្គបន្ទាប់")}
              </Button>
            )}
            <p className="secure-note">
              {tr(
                lang,
                "Demo booking · No real money collected",
                "ការកក់សាកល្បង · មិនប្រមូលប្រាក់ពិតទេ",
              )}
            </p>
          </aside>
        </section>
      </>
    );
  }
  const person =
    kind === "teachers"
      ? db.teachers.find((p) => p.slug === slug)!
      : db.centers.find((p) => p.slug === slug)!;
  return (
    <>
      <div className="container">
        <Breadcrumb
          lang={lang}
          items={[
            { label: label(kind, lang), href: `/${lang}/${kind}` },
            { label: person.name[lang] },
          ]}
        />
      </div>
      <PageHero
        lang={lang}
        title={person.name[lang]}
        description={person.description[lang]}
        image={person.image}
      />
      <section className="container platform-section">
        {"address" in person && (
          <div className="soft-card">
            <p>{(person as Center).address[lang]}</p>
            <a
              className="text-link"
              href={(person as Center).map}
              target="_blank"
              rel="noreferrer"
            >
              {tr(lang, "View city on Google Maps", "មើលក្រុងលើ Google Maps")} ↗
            </a>
          </div>
        )}
        <SectionTitle title={tr(lang, "Upcoming courses", "វគ្គខាងមុខ")} />
        <CourseGrid
          courses={db.courses.filter(
            (c) =>
              c.status !== "archived" &&
              (kind === "teachers"
                ? c.teacherId === person.id
                : c.centerId === person.id),
          )}
          lang={lang}
          db={db}
        />
      </section>
      <CTASection lang={lang} />
    </>
  );
}
