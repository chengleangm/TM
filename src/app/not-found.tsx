import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container platform-section empty-state">
      <p className="eyebrow">404 · TM CAMBODIA</p>
      <h1>This page is taking a quiet moment.</h1>
      <p>ទំព័រនេះមិនមានទេ។</p>
      <Link className="button" href="/en">
        Return home · ទំព័រដើម
      </Link>
    </main>
  );
}
