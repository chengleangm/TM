import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
const routes = [
  "",
  "about",
  "what-is-tm",
  "benefits",
  "learn",
  "courses",
  "courses/tm-course-phnom-penh",
  "courses/intro-session-phnom-penh",
  "courses/tm-course-siem-reap",
  "teachers",
  "teachers/samen",
  "centers",
  "centers/phnom-penh",
  "centers/siem-reap",
  "testimonials",
  "videos",
  "faq",
  "contact",
  "register",
  "checkout",
  "payment/success",
  "payment/pending",
  "payment/failed",
  "payment/cancelled",
  "privacy",
  "terms",
];
let count = 0;
for (const lang of ["en", "km"])
  for (const route of routes) {
    const res = await fetch(`${base}/${lang}/${route}`);
    assert.equal(res.status, 200, `${lang}/${route}`);
    const html = await res.text();
    assert.ok(
      html.includes(`<html lang="${lang}"`),
      `${lang}/${route} document language`,
    );
    assert.ok(
      !html.includes("We couldn’t complete this request"),
      `${lang}/${route}`,
    );
    count++;
  }
console.log(`PASS ${count} public URLs`);
for (const route of [
  "",
  "content/about",
  "courses",
  "registrations",
  "payments",
  "teachers",
  "centers",
  "messages",
  "media",
  "settings/payments",
]) {
  const r = await fetch(`${base}/admin${route ? `/${route}` : ""}`, {
    redirect: "manual",
  });
  assert.equal(r.status, 307);
  assert.ok(r.headers.get("location").includes("/admin/login"));
}
console.log("PASS admin routes require login");
const spoof = await fetch(`${base}/en/payment/success?payment=untrusted`);
assert.ok((await spoof.text()).includes("No verified payment found"));
console.log("PASS forged success URL does not confirm a payment");
const webhook = await fetch(`${base}/api/payments/webhook`, {
  method: "POST",
  body: JSON.stringify({ status: "paid" }),
});
assert.equal(webhook.status, 401);
console.log("PASS unverified webhooks rejected");
const alias = await fetch(`${base}/courses/tm-course-phnom-penh?x=1`, {
  redirect: "manual",
});
assert.equal(alias.status, 307);
assert.ok(
  alias.headers
    .get("location")
    .endsWith("/km/courses/tm-course-phnom-penh?x=1"),
);
console.log("PASS route aliases preserve path and query");
for (const path of [
  "/fr",
  "/en/unknown",
  "/en/courses/missing",
  "/en/teachers/missing",
  "/en/centers/missing",
])
  assert.equal((await fetch(base + path)).status, 404, path);
console.log("PASS unknown routes return 404");
const seen = new Set();
for (const route of routes) {
  const response = await fetch(`${base}/en/${route}`);
  const html = await response.text();
  for (const match of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const url = match[1].replaceAll("&amp;", "&");
    if (
      url.startsWith("/_next") ||
      url.startsWith("/images") ||
      url === "/favicon.ico" ||
      seen.has(url)
    )
      continue;
    seen.add(url);
    const r = await fetch(base + url);
    assert.ok(r.status < 400, `Broken link: ${url} (${r.status})`);
  }
}
console.log(`PASS ${seen.size} discovered local links`);
