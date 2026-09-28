import { renderDetail } from "@/components/public/Pages";
import { repository } from "@/services/repository";
import { isLanguage } from "@/lib/translations";
type Props = { params: Promise<{ lang: string; slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLanguage(lang)) return {};
  const db = await repository();
  const item = db.courses.find((x) => x.slug === slug);
  return {
    title: item ? item.title[lang] + " | TM Cambodia" : "Not found",
    alternates: {
      canonical: `https://kh.tm.org/${lang}/courses/${slug}`,
      languages: {
        en: `https://kh.tm.org/en/courses/${slug}`,
        km: `https://kh.tm.org/km/courses/${slug}`,
      },
    },
  };
}
export default async function Page(props: Props) {
  return renderDetail("courses", props);
}
