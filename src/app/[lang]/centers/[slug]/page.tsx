import { renderDetail } from "@/components/public/Pages";
import { repository } from "@/services/repository";
import { isLanguage } from "@/lib/translations";
type Props = { params: Promise<{ lang: string; slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) return {};
  const db = await repository();
  const item = db.centers.find((x) => x.slug === slug);
  return {
    title: item ? item.name[lang] + " | TM Cambodia" : "Not found",
    alternates: {
      canonical: `https://kh.tm.org/${lang}/centers/${slug}`,
      languages: {
        en: `https://kh.tm.org/en/centers/${slug}`,
        km: `https://kh.tm.org/km/centers/${slug}`,
      },
    },
  };
}
export default async function Page(props: Props) {
  return renderDetail("centers", props);
}
