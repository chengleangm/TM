import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import type { Language } from "@/lib/translations";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
export function Footer({ t, lang }: { t: Dictionary; lang: Language }) {
  const groups = [
    [
      [t.aboutLinks[0], "#what-is-tm"],
      [t.foundation, "#cambodia"],
      [t.nav[2], "#benefits"],
      [t.aboutLinks[3], "#faq"],
    ],
    [
      [t.learnLinks[0], "#learn"],
      [t.intro, "#intro"],
      [t.teacher, "#cambodia"],
    ],
    [
      [t.contact, "#contact"],
      ["010 980 840", "tel:+85510980840"],
      [t.form.privacy, "https://kh.tm.org/privacy-policy"],
      [t.legal, "https://kh.tm.org/legal-details"],
    ],
  ];
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href={`/${lang}`} className="brand">
              <span className="brand-emblem">
                <Image
                  src="/images/tm-logo.png"
                  alt=""
                  width={230}
                  height={58}
                  className="brand-mark"
                />
              </span>
              <span className="brand-name">
                {t.brand}
                <small>{t.country}</small>
              </span>
            </Link>
            <h2>{t.footerTag}</h2>
            <p>{t.footerAbout}</p>
          </div>
          {groups.map((links, i) => (
            <div className="footer-column" key={i}>
              <h3>{t.footerGroups[i]}</h3>
              {links.map(([label, href]) => (
                <Link href={href} key={label}>
                  {label}
                  {href.startsWith("http") && (
                    <ArrowUpRight size={13} aria-hidden="true" />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <div>
            <p>
              © {new Date().getFullYear()} Maharishi Foundation for World Peace
              – Cambodia. {t.rights}
            </p>
            <p>{t.trademark}</p>
          </div>
          <LanguageSwitcher lang={lang} label={t.languageLabel} />
        </div>
      </div>
    </footer>
  );
}
