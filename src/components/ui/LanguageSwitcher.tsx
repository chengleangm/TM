"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import type { Language } from "@/lib/translations";
export function LanguageSwitcher({
  lang,
  label,
}: {
  lang: Language;
  label: string;
}) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return (
    <div className="language-switch" role="group" aria-label={label}>
      {(["km", "en"] as const).map((value) => (
        <Link
          key={value}
          href={`${pathname.replace(/^\/(en|km)(?=\/|$)/, `/${value}`)}${search ? `?${search}` : ""}`}
          scroll={false}
          lang={value}
          hrefLang={value}
          aria-current={lang === value ? "page" : undefined}
          onClick={() => {
            document.cookie = `tm-language=${value}; Path=/; Max-Age=31536000; SameSite=Lax`;
          }}
        >
          {value === "km" ? "ខ្មែរ" : "EN"}
        </Link>
      ))}
    </div>
  );
}
