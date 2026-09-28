import {
  renderPublic,
  pageMetadata,
  type PublicProps,
} from "@/components/public/Pages";
export async function generateMetadata(props: PublicProps) {
  return pageMetadata("videos", props);
}
export default async function Page(props: PublicProps) {
  return renderPublic("videos", props);
}
