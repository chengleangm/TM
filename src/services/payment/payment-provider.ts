import "server-only";
import { randomUUID } from "node:crypto";
import { demoMode } from "@/services/auth";
import { mutate, repository, seats } from "@/services/repository";
import type { Payment, PaymentStatus } from "@/types/platform";

export interface PaymentProvider {
  createPayment(
    registrationId: string,
    owner: string,
    method: Payment["method"],
  ): Promise<Payment>;
  createKhqrPayment(registrationId: string, owner: string): Promise<Payment>;
  createCardCheckout(registrationId: string, owner: string): Promise<Payment>;
  checkPayment(id: string, owner: string): Promise<Payment | undefined>;
  verifyCallback(payload: string, signature: string): Promise<boolean>;
  handleWebhook(payload: string, signature: string): Promise<void>;
}
const assertDemo = () => {
  if (!demoMode()) throw new Error("Live payment provider is not configured.");
};
export const paymentProvider: PaymentProvider = {
  async createPayment(registrationId, owner, method) {
    assertDemo();
    return mutate((db) => {
      if (db.settings.environment !== "Demo")
        throw new Error("This gateway environment is not connected.");
      if (
        method === "khqr"
          ? !db.settings.khqr
          : !db.settings.visa && !db.settings.mastercard
      )
        throw new Error("Payment method unavailable.");
      const r = db.registrations.find(
        (r) => r.id === registrationId && r.owner === owner,
      );
      if (!r || r.registrationStatus === "cancelled")
        throw new Error("Registration unavailable.");
      const existing = db.payments.find(
        (p) =>
          p.registrationId === r.id && ["pending", "paid"].includes(p.status),
      );
      if (existing) return existing;
      const course = db.courses.find((c) => c.id === r.courseId);
      if (!course || course.status !== "open" || seats(db, course.id) === 0)
        throw new Error("This course is no longer available.");
      // Always price from the server, never from submitted totals.
      r.amount = course.price;
      const p: Payment = {
        id: `pay-${randomUUID()}`,
        registrationId: r.id,
        courseId: r.courseId,
        customerId: r.id,
        amount: course.price,
        currency: "USD",
        method,
        provider: "Demo",
        providerTransactionId: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      r.paymentStatus = "pending";
      db.payments.push(p);
      return p;
    });
  },
  createKhqrPayment(id, owner) {
    return this.createPayment(id, owner, "khqr");
  },
  createCardCheckout(id, owner) {
    return this.createPayment(id, owner, "card");
  },
  async checkPayment(id, owner) {
    const db = await repository();
    const p = db.payments.find((p) => p.id === id);
    return p &&
      db.registrations.some(
        (r) => r.id === p.registrationId && r.owner === owner,
      )
      ? p
      : undefined;
  },
  async verifyCallback() {
    return false;
  },
  async handleWebhook() {
    throw new Error(
      "No live gateway configured. Unsigned callbacks are never accepted.",
    );
  },
};
export async function simulatePayment(
  id: string,
  owner: string,
  status: PaymentStatus,
) {
  assertDemo();
  if (!["paid", "pending", "failed", "cancelled"].includes(status))
    throw new Error("Invalid demo outcome.");
  return mutate((db) => {
    if (db.settings.environment !== "Demo")
      throw new Error("Demo environment is disabled.");
    const p = db.payments.find((p) => p.id === id);
    const r = db.registrations.find(
      (r) => r.id === p?.registrationId && r.owner === owner,
    );
    if (!p || !r) throw new Error("Payment not found.");
    // Idempotent: successful payments cannot be downgraded, and failed attempts are terminal.
    if (p.status !== "pending") return p;
    const course = db.courses.find((c) => c.id === r.courseId);
    if (
      status === "paid" &&
      (!course || course.status !== "open" || seats(db, r.courseId) === 0)
    )
      throw new Error("This course has filled. Please choose another course.");
    p.status = status;
    if (status === "paid") p.paidAt = new Date().toISOString();
    r.paymentStatus = status;
    r.registrationStatus = status === "paid" ? "confirmed" : "pending";
    return p;
  });
}
