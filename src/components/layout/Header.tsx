"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import type { Dictionary } from "@/locales/en";
import type { Language } from "@/lib/translations";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
export function Header({ t, lang }: { t: Dictionary; lang: Language }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const elements = [
      document.querySelector("main"),
      document.querySelector("footer"),
    ];
    elements.forEach((element) => {
      if (element) element.inert = mobileOpen;
    });
    const media = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (media.matches) setMobileOpen(false);
    };
    media.addEventListener("change", closeOnDesktop);
    return () => {
      elements.forEach((element) => {
        if (element) element.inert = false;
      });
      media.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileOpen]);
  const groups = [
    t.aboutLinks.map((label, i) => ({
      label,
      href: ["#what-is-tm", "#intro", "#cambodia", "#faq", "#contact"][i],
    })),
    t.learnLinks.map((label, i) => ({
      label,
      href: ["#learn", "#contact", "#learn"][i],
    })),
    [
      ...t.benefits.map(([label], i) => ({ label, href: `#benefit-${i}` })),
      { label: t.research, href: "#benefits" },
    ],
  ];
  function close() {
    setMobileOpen(false);
    setActive(null);
  }
  return (
    <>
      <a className="skip-link" href="#main">
        {t.skip}
      </a>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            if (active !== null) {
              buttons.current[active]?.focus();
              setActive(null);
            } else {
              close();
              menuButton.current?.focus();
            }
          }
        }}
      >
        <div className="header-inner">
          <Link
            href={`/${lang}`}
            className="brand"
            aria-label={`${t.brand} ${t.country}`}
            onClick={close}
          >
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
          <nav
            className={`main-nav ${mobileOpen ? "is-open" : ""}`}
            aria-label={t.navLabel}
            id="main-navigation"
          >
            {groups.map((items, i) => (
              <div
                className="nav-group"
                key={i}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget))
                    setActive((current) => (current === i ? null : current));
                }}
              >
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  aria-expanded={active === i}
                  aria-controls={`nav-panel-${i}`}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  {t.nav[i]}
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                <div
                  id={`nav-panel-${i}`}
                  className="nav-dropdown"
                  hidden={active !== i}
                >
                  <p className="eyebrow">{t.nav[i]}</p>
                  {items.map((item) => (
                    <Link href={item.href} key={item.label} onClick={close}>
                      {item.label}
                      <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="#cambodia" onClick={close}>
              {t.nav[3]}
            </Link>
            <Link className="mobile-cta button" href="#intro" onClick={close}>
              {t.intro}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </nav>
          <div className="header-actions">
            <LanguageSwitcher lang={lang} label={t.languageLabel} />
            <Link className="button header-cta" href="#intro">
              {t.intro}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <button
              className="menu-toggle"
              ref={menuButton}
              aria-label={mobileOpen ? t.close : t.menu}
              aria-expanded={mobileOpen}
              aria-controls="main-navigation"
              onClick={() => {
                setMobileOpen(!mobileOpen);
                setActive(null);
              }}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
