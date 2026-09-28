import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const cli = process.env.AGENT_BROWSER_BIN;
if (!cli) throw Error("Set AGENT_BROWSER_BIN to the agent-browser executable.");
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
function run(args, input) {
  const r = spawnSync(cli, ["--session", "tm-qa", ...args], {
    encoding: "utf8",
    input,
    timeout: 30000,
    windowsHide: true,
  });
  if (r.status !== 0) throw Error(r.stderr || r.stdout);
  return r.stdout.trim();
}
const pages = [
  "", "about", "what-is-tm", "benefits", "learn", "courses",
  "courses/tm-course-phnom-penh", "courses/intro-session-phnom-penh",
  "courses/tm-course-siem-reap", "teachers", "teachers/samen",
  "centers", "centers/phnom-penh", "centers/siem-reap",
  "testimonials", "videos", "faq", "contact", "register", "checkout",
  "payment/success", "payment/pending", "payment/failed", "payment/cancelled",
  "privacy", "terms",
];
const routes = process.env.QA_ROUTES?.split(",") || [
  ...["en", "km"].flatMap((lang) => pages.map((page) => `/${lang}/${page}`)),
  "/admin/login",
];
const widths = (process.env.QA_WIDTHS || "320,375,390,430,768,1024,1280,1440,1920")
  .split(",").map(Number);
const report = [];
for (const route of routes) {
  run(["open", base + route]);
  for (const width of widths) {
    run(["set", "viewport", String(width), "900"]);
    const result = JSON.parse(
      run(
        ["eval", "--stdin"],
        '({width:innerWidth,scroll:document.documentElement.scrollWidth,heading:document.querySelector("h1")?.innerText,overlays:document.querySelectorAll("[data-nextjs-dialog]").length})',
      ),
    );
    report.push({ route, ...result });
    assert.ok(
      result.scroll <= width,
      `${route} overflows at ${width}: ${result.scroll}`,
    );
    assert.equal(result.overlays, 0);
    assert.ok(result.heading);
  }
  console.log(`PASS responsive ${route}: all ${widths.length} widths`);
}
writeFileSync(".next/responsive-qa.json", JSON.stringify(report, null, 2));
console.log(`PASS ${report.length} viewport checks`);
