import { notFound } from "next/navigation";
import { Suspense } from "react";
import { isLanguage } from "@/lib/translations";
import { Header } from "@/components/public/Navigation";
import { Footer } from "@/components/public/Shared";
import { repository } from "@/services/repository";
import { demoMode } from "@/services/auth";
import { tr } from "@/lib/platform";
export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const db = await repository();
  return (
    <>
      <Suspense>
        <Header
          lang={lang}
          nav={db.settings.nav}
          siteName={db.settings.siteName}
        />
      </Suspense>
      {demoMode() && (
        <div className="demo-ribbon">
          {tr(
            lang,
            "DEMO PREVIEW · Sample courses & prices. No real payments.",
            "ការមើលសាកល្បង · វគ្គ និងតម្លៃគំរូ។ មិនមានការបង់ប្រាក់ពិតទេ។",
          )}
        </div>
      )}
      <main id="main">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: db.settings.siteName,
              url: "https://kh.tm.org",
              telephone: db.settings.phone,
            }).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </main>
      <Footer lang={lang} db={db} />
    </>
  );
}
