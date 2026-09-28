import test from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../src/lib/contact.ts";

const valid = {
  name: "Test Visitor",
  email: "test@example.com",
  phone: "+855 10 980 840",
  city: "Phnom Penh",
  language: "km",
  message: "A test enquiry.",
  consent: "yes",
};
test("accepts a complete Khmer or English enquiry", () => {
  assert.deepEqual(validateContact(valid), {});
  assert.deepEqual(validateContact({ ...valid, language: "en" }), {});
});
test("requires meaningful values and consent", () => {
  assert.equal(Object.keys(validateContact({})).length, 7);
  assert.equal(validateContact({ ...valid, name: "   " }).name, "required");
  assert.equal(
    validateContact({ ...valid, consent: "no" }).consent,
    "required",
  );
});
test("rejects invalid email, phone, and language", () => {
  assert.equal(validateContact({ ...valid, email: "broken" }).email, "email");
  assert.equal(validateContact({ ...valid, phone: "letters" }).phone, "phone");
  assert.equal(validateContact({ ...valid, phone: "-------" }).phone, "phone");
  assert.equal(
    validateContact({ ...valid, language: "fr" }).language,
    "required",
  );
});
test("enforces size limits and handles untrusted value types", () => {
  assert.equal(
    validateContact({ ...valid, message: "x".repeat(3001) }).message,
    "required",
  );
  assert.equal(
    validateContact({ ...valid, city: "x".repeat(101) }).city,
    "required",
  );
  assert.equal(validateContact({ ...valid, email: ["bad"] }).email, "required");
  assert.equal(validateContact({ ...valid, name: null }).name, "required");
});
