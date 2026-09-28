import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
for (const lang of ["km", "en"]) {
  const response = await fetch(`${base}/${lang}`);
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.ok(html.includes(`lang="${lang}"`));
  assert.ok(html.includes(`rel="canonical" href="https://kh.tm.org/${lang}"`));
  assert.ok(html.includes("application/ld+json"));
  console.log(
    `PASS ${lang}: server-rendered language, canonical and organization schema`,
  );
}
for (const [path, text] of [
  ["/robots.txt", "Sitemap: https://kh.tm.org/sitemap.xml"],
  ["/sitemap.xml", 'hreflang="km"'],
]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.ok((await response.text()).includes(text));
  console.log(`PASS ${path}`);
}
for (const [cookie, language] of [
  ["", "km"],
  ["tm-language=en", "en"],
]) {
  const response = await fetch(base, {
    redirect: "manual",
    headers: { cookie },
  });
  assert.equal(response.status, 307);
  assert.equal(
    new URL(response.headers.get("location"), base).pathname,
    `/${language}`,
  );
  console.log(`PASS default/preferred language: ${language}`);
}
const valid = {
  name: "Test Visitor",
  email: "test@example.com",
  phone: "010980840",
  city: "Phnom Penh",
  language: "km",
  message: "Local smoke test",
  consent: "yes",
};
// Only run this against the unconfigured local app. No external message is sent.
for (const [label, body, origin, expected] of [
  ["missing fields", "{}", base, 400],
  ["malformed JSON", "{", base, 400],
  ["wrong origin", JSON.stringify(valid), "https://example.com", 403],
  ["unconfigured delivery", JSON.stringify(valid), base, 503],
]) {
  const response = await fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", origin },
    body,
  });
  assert.equal(response.status, expected, label);
  console.log(`PASS contact: ${label}`);
}
assert.equal((await fetch(`${base}/fr`)).status, 404);
console.log("PASS unsupported language returns 404");
