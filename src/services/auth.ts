import "server-only";
import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
const runtime = globalThis as typeof globalThis & { tmSessionSecret?: string };
const secret = () =>
  process.env.ADMIN_SESSION_SECRET ||
  (runtime.tmSessionSecret ??= randomBytes(32).toString("hex"));
export const demoMode = () =>
  process.env.DEMO_MODE === "true" ||
  (process.env.NODE_ENV !== "production" && process.env.DEMO_MODE !== "false");
export const adminPassword = () =>
  process.env.ADMIN_PASSWORD ||
  (process.env.NODE_ENV !== "production" ? "tm-demo-admin" : "");
export function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function issueAdmin() {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  const sig = createHmac("sha256", secret()).update(expires).digest("hex");
  (await cookies()).set("tm-admin", `${expires}.${sig}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 28800,
    path: "/",
  });
}
export async function isAdmin() {
  const token = (await cookies()).get("tm-admin")?.value;
  if (!token) return false;
  const [expiry, sig] = token.split(".");
  return (
    Number(expiry) > Date.now() &&
    !!sig &&
    same(sig, createHmac("sha256", secret()).update(expiry).digest("hex"))
  );
}
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
export async function owner(create = false) {
  const jar = await cookies();
  let id = jar.get("tm-booking")?.value;
  if (!id && create) {
    id = randomBytes(32).toString("hex");
    jar.set("tm-booking", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
  }
  return id;
}
