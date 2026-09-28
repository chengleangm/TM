import {
  renderPublic,
  pageMetadata,
  type PublicProps,
} from "@/components/public/Pages";
export async function generateMetadata(props: PublicProps) {
  return pageMetadata("testimonials", props);
}
export default async function Page(props: PublicProps) {
  return renderPublic("testimonials", props);
}
