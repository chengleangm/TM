import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const db = () => JSON.parse(readFileSync(".demo-data/repository.json", "utf8"));
const manifest = JSON.parse(
  readFileSync(".next/server/server-reference-manifest.json", "utf8"),
);
const actionId = Object.entries(manifest.node).find(
  ([, v]) => v.exportedName === "simulateAction",
)[0];
const p = db().payments.find((p) => p.status === "pending");
assert.ok(p, "Create a demo pending payment before running this check.");
const registration = db().registrations.find((r) => r.id === p.registrationId);
async function simulate(base, owner) {
  const body = new FormData();
  body.set("_1_paymentId", p.id);
  body.set("_1_outcome", "paid");
  body.set("_1_lang", "en");
  body.set("0", JSON.stringify([{ error: "" }, "$K1"]));
  const res = await fetch(base + "/en/checkout", {
    method: "POST",
    headers: {
      "Next-Action": actionId,
      Origin: base,
      Cookie: `tm-booking=${owner}`,
    },
    body,
  });
  return await res.text();
}
const disabled = await simulate("http://localhost:3101", registration.owner);
assert.ok(
  disabled.includes("Live payment provider is not configured"),
  "Server must reject direct simulation with demo disabled",
);
assert.equal(db().payments.find((x) => x.id === p.id).status, "pending");
console.log("PASS direct simulation action rejected with DEMO_MODE=false");
const other = await simulate("http://localhost:3100", "different-session");
assert.ok(other.includes("Payment not found"));
assert.equal(db().payments.find((x) => x.id === p.id).status, "pending");
console.log("PASS cross-session payment mutation rejected");
const anonymous = await fetch(
  `http://localhost:3100/en/checkout?registration=${registration.id}`,
);
assert.ok(!(await anonymous.text()).includes(registration.email));
console.log(
  "PASS registration personal data is not accessible without its session",
);
const html = await (await fetch("http://localhost:3101/en/register")).text();
assert.ok(!html.includes('name="firstName"'));
console.log("PASS registration UI disabled when demo mode is off");
