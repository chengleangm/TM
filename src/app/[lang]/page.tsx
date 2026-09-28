import {
  renderPublic,
  pageMetadata,
  type PublicProps,
} from "@/components/public/Pages";
export async function generateMetadata(props: PublicProps) {
  return pageMetadata("home", props);
}
export default async function Page(props: PublicProps) {
  return renderPublic("home", props);
}
