"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { label, tr } from "@/lib/platform";
import type { Locale } from "@/types/platform";
export function Header({
  lang,
  nav,
  siteName,
}: {
  lang: Locale;
  nav: string[];
  siteName: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    if (!open) return;
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [open]);
  const link = (key: string) => (
    <Link
      href={`/${lang}/${key === "home" ? "" : key}`}
      aria-current={pathname === `/${lang}/${key}` ? "page" : undefined}
      onClick={() => setOpen(false)}
    >
      {label(key, lang)}
    </Link>
  );
  return (
    <>
      <a href="#main" className="skip-link">
        {tr(lang, "Skip to content", "រំលងទៅមាតិកា")}
      </a>
      <header className="platform-header">
        <div className="platform-header-inner">
          <Link
            className="platform-brand"
            href={`/${lang}`}
            onClick={() => setOpen(false)}
          >
            <Image src="/images/tm-logo.png" alt="" width={115} height={29} />
            <span>
              {siteName}
              <small>
                {tr(lang, "TRANSCENDENTAL MEDITATION", "ការតាំងសមាធិ TM")}
              </small>
            </span>
          </Link>
          <nav
            className={`platform-nav ${open ? "open" : ""}`}
            id="public-navigation"
            aria-label={tr(lang, "Main navigation", "មុខងាររុករកសំខាន់")}
          >
            {link("home")}
            {nav.map((key) =>
              key === "learn" || key === "resources" ? (
                <details key={key}>
                  <summary>
                    {label(key, lang)} <span>⌄</span>
                  </summary>
                  <div className="platform-dropdown">
                    {(key === "learn"
                      ? ["what-is-tm", "benefits", "learn"]
                      : ["testimonials", "videos", "faq"]
                    ).map((item) => (
                      <div key={item}>{link(item)}</div>
                    ))}
                  </div>
                </details>
              ) : (
                <div key={key}>{link(key)}</div>
              ),
            )}
          </nav>
          <div className="platform-header-actions">
            <LanguageSwitcher
              lang={lang}
              label={tr(lang, "Choose language", "ជ្រើសរើសភាសា")}
            />
            <Link
              className="button small desktop-course"
              href={`/${lang}/courses`}
            >
              {tr(lang, "Find a course", "ស្វែងរកវគ្គ")}
              <ArrowUpRight size={15} />
            </Link>
            <button
              className="platform-menu"
              aria-label={
                open
                  ? tr(lang, "Close menu", "បិទម៉ឺនុយ")
                  : tr(lang, "Open menu", "បើកម៉ឺនុយ")
              }
              aria-expanded={open}
              aria-controls="public-navigation"
              onClick={() => setOpen(!open)}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
