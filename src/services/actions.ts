"use server";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminPassword,
  demoMode,
  issueAdmin,
  owner,
  requireAdmin,
  same,
} from "@/services/auth";
import { mutate, seats } from "@/services/repository";
import {
  paymentProvider,
  simulatePayment,
} from "@/services/payment/payment-provider";
import { resultPath } from "@/lib/platform";
import type { Locale, PaymentStatus } from "@/types/platform";

const val = (f: FormData, name: string, max = 5000) =>
  String(f.get(name) ?? "")
    .trim()
    .slice(0, max);
const locale = (f: FormData): Locale => (val(f, "lang") === "km" ? "km" : "en");
const pair = (f: FormData, name: string) => ({
  en: val(f, `${name}En`),
  km: val(f, `${name}Km`),
});
function safeImage(value: string) {
  return /^\/images\/[a-zA-Z0-9._-]+$/.test(value)
    ? value
    : "/images/practice.jpg";
}
export async function registerAction(_state: { error: string }, f: FormData) {
  const lang = locale(f);
  let id = "";
  try {
    if (!demoMode()) throw new Error("Registration is not enabled yet.");
    const firstName = val(f, "firstName", 100),
      lastName = val(f, "lastName", 100),
      email = val(f, "email", 254),
      phone = val(f, "phone", 40),
      city = val(f, "city", 100),
      nationality = val(f, "nationality", 100);
    if (
      !firstName ||
      !lastName ||
      !city ||
      !nationality ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^[+\d ()-]{7,40}$/.test(phone) ||
      f.get("terms") !== "on"
    )
      throw new Error(
        "Please complete all required fields and accept the terms.",
      );
    const session = await owner(true);
    id = await mutate((db) => {
      const c = db.courses.find((c) => c.id === val(f, "courseId"));
      if (!c || c.status !== "open" || seats(db, c.id) === 0)
        throw new Error("This course is unavailable.");
      if (db.registrations.filter((r) => r.owner === session).length >= 25)
        throw new Error("Demo registration limit reached.");
      const id = `reg-${randomUUID()}`;
      db.registrations.push({
        id,
        owner: session!,
        courseId: c.id,
        firstName,
        lastName,
        email,
        phone,
        city,
        nationality,
        messenger: val(f, "messenger", 100),
        preferredLanguage: val(f, "preferredLanguage") === "km" ? "km" : "en",
        notes: val(f, "notes", 2000),
        paymentStatus: "pending",
        registrationStatus: "pending",
        amount: c.price,
        currency: "USD",
        createdAt: new Date().toISOString(),
      });
      return id;
    });
  } catch (e) {
    return {
      error:
        lang === "km"
          ? "សូមពិនិត្យព័ត៌មាន និងកន្លែងទំនេររបស់វគ្គ រួចព្យាយាមម្តងទៀត។"
          : (e as Error).message,
    };
  }
  revalidatePath("/admin");
  redirect(`/${lang}/checkout?registration=${id}`);
}
export async function beginPayment(_state: { error: string }, f: FormData) {
  let target = "";
  const lang = locale(f);
  try {
    const session = await owner();
    if (!session) throw new Error("Please register first.");
    const method = val(f, "method");
    if (!["khqr", "card"].includes(method))
      throw new Error("Choose a payment method.");
    const p = await paymentProvider.createPayment(
      val(f, "registrationId"),
      session,
      method as "khqr" | "card",
    );
    target =
      p.status === "paid"
        ? `/${lang}/payment/success?payment=${p.id}`
        : `/${lang}/checkout?registration=${p.registrationId}&payment=${p.id}`;
  } catch (e) {
    return {
      error:
        lang === "km"
          ? "មិនអាចចាប់ផ្តើមទូទាត់បានទេ។ សូមពិនិត្យវគ្គ និងព្យាយាមម្តងទៀត។"
          : (e as Error).message,
    };
  }
  redirect(target);
}
export async function simulateAction(_state: { error: string }, f: FormData) {
  let target = "";
  try {
    const session = await owner();
    if (!session) throw new Error("Session expired.");
    const p = await simulatePayment(
      val(f, "paymentId"),
      session,
      val(f, "outcome") as PaymentStatus,
    );
    target = `/${locale(f)}/payment/${resultPath(p.status)}?payment=${p.id}`;
  } catch (e) {
    return {
      error:
        locale(f) === "km"
          ? "មិនអាចបញ្ជាក់ការទូទាត់បានទេ។ សូមព្យាយាមម្តងទៀត។"
          : (e as Error).message,
    };
  }
  revalidatePath("/", "layout");
  redirect(target);
}
export async function checkAction(f: FormData) {
  const p = await paymentProvider.checkPayment(
    val(f, "paymentId"),
    (await owner()) ?? "",
  );
  if (!p) redirect(`/${locale(f)}/register`);
  redirect(
    `/${locale(f)}/payment/${resultPath(p.status)}?payment=${p.id}&checked=1`,
  );
}
export async function messageAction(
  _state: { error: string; success?: boolean },
  f: FormData,
) {
  if (!demoMode())
    return { error: "Please contact the foundation by telephone." };
  const name = val(f, "name", 100),
    email = val(f, "email", 254),
    message = val(f, "message", 2000);
  if (
    !name ||
    !message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    f.get("consent") !== "on"
  )
    return {
      error:
        locale(f) === "km"
          ? "សូមបំពេញព័ត៌មាន និងយល់ព្រម។"
          : "Please complete the fields and give consent.",
    };
  await mutate((db) => {
    if (db.messages.length >= 1000) throw new Error("Demo inbox full.");
    db.messages.push({
      id: randomUUID(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
      read: false,
    });
  });
  revalidatePath("/admin/messages");
  return { error: "", success: true };
}
const attempts = new Map<string, { count: number; at: number }>();
export async function loginAction(_state: { error: string }, f: FormData) {
  const session = (await owner(true)) ?? "anonymous";
  const a = attempts.get(session);
  if (a && a.count >= 5 && Date.now() - a.at < 60000)
    return { error: "Please wait one minute before trying again." };
  const password = adminPassword();
  if (!password || !same(val(f, "password", 200), password)) {
    attempts.set(session, {
      count: a && Date.now() - a.at < 60000 ? a.count + 1 : 1,
      at: Date.now(),
    });
    return { error: "Incorrect password or admin access not configured." };
  }
  await issueAdmin();
  redirect("/admin");
}
export async function logoutAction() {
  (await cookies()).delete("tm-admin");
  redirect("/admin/login");
}
export async function saveContent(f: FormData) {
  await requireAdmin();
  const slug = val(f, "slug");
  await mutate((db) => {
    const p = db.pages.find((p) => p.slug === slug);
    if (!p) throw new Error("Page not found.");
    p.title = pair(f, "title");
    p.content = pair(f, "content");
    p.seo = pair(f, "seo");
    p.image = safeImage(val(f, "image"));
    p.published = f.get("published") === "on";
  });
  revalidatePath("/", "layout");
  redirect(`/admin/content/${slug}?saved=1`);
}
export async function saveCourse(f: FormData) {
  await requireAdmin();
  const id = val(f, "id");
  await mutate((db) => {
    const c = db.courses.find((c) => c.id === id);
    if (!c) throw new Error("Course not found.");
    const price = Number(val(f, "price")),
      capacity = Number(val(f, "capacity")),
      priceKhr = Number(val(f, "priceKhr"));
    if (
      ![price, priceKhr, capacity].every(Number.isFinite) ||
      price < 0 ||
      priceKhr < 0 ||
      capacity < 1 ||
      !Number.isInteger(capacity) ||
      capacity > 10000
    )
      throw new Error("Invalid price or capacity.");
    const start = val(f, "start"),
      end = val(f, "end");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
      end < start
    )
      throw new Error("Invalid date range.");
    const status = val(f, "status"),
      type = val(f, "type"),
      language = val(f, "language");
    if (
      !["open", "full", "closed", "archived"].includes(status) ||
      !["intro", "course", "followup"].includes(type) ||
      !["en", "km", "both"].includes(language)
    )
      throw new Error("Invalid course options.");
    if (
      !db.centers.some((x) => x.id === val(f, "centerId")) ||
      !db.teachers.some((x) => x.id === val(f, "teacherId"))
    )
      throw new Error("Invalid center or teacher.");
    Object.assign(c, {
      title: pair(f, "title"),
      description: pair(f, "description"),
      included: pair(f, "included"),
      requirements: pair(f, "requirements"),
      schedule: pair(f, "schedule"),
      image: safeImage(val(f, "image")),
      start,
      end,
      price,
      priceKhr,
      capacity,
      status,
      type,
      language,
      centerId: val(f, "centerId"),
      teacherId: val(f, "teacherId"),
    });
  });
  revalidatePath("/", "layout");
  redirect(`/admin/courses/${id}?saved=1`);
}
export async function courseAction(f: FormData) {
  await requireAdmin();
  let newId = "";
  await mutate((db) => {
    const c = db.courses.find((c) => c.id === val(f, "id"));
    if (!c) throw new Error("Course not found");
    if (val(f, "action") === "duplicate") {
      newId = `course-${randomUUID().slice(0, 8)}`;
      db.courses.push({
        ...structuredClone(c),
        id: newId,
        slug: `${c.slug}-${newId}`,
        title: {
          en: `${c.title.en} (copy)`,
          km: `${c.title.km} (ច្បាប់ចម្លង)`,
        },
        status: "closed",
      });
    } else if (val(f, "action") === "archive") c.status = "archived";
  });
  revalidatePath("/", "layout");
  redirect(newId ? `/admin/courses/${newId}` : "/admin/courses");
}
export async function savePerson(f: FormData) {
  await requireAdmin();
  const kind = val(f, "kind") === "centers" ? "centers" : "teachers";
  await mutate((db) => {
    const p = db[kind].find((p) => p.id === val(f, "id"));
    if (!p) throw new Error("Record not found");
    Object.assign(p, {
      name: pair(f, "name"),
      description: pair(f, "description"),
      image: safeImage(val(f, "image")),
      published: f.get("published") === "on",
    });
    if (kind === "centers") {
      const map = val(f, "map");
      if (!map.startsWith("https://www.google.com/maps"))
        throw new Error("Use a Google Maps URL");
      Object.assign(p, {
        city: pair(f, "city"),
        address: pair(f, "address"),
        map,
      });
    }
  });
  revalidatePath("/", "layout");
  redirect(`/admin/${kind}/${val(f, "id")}?saved=1`);
}
export async function saveSettings(f: FormData) {
  await requireAdmin();
  const section = val(f, "section");
  await mutate((db) => {
    const s = db.settings;
    if (section === "payments") {
      const provider = val(f, "provider"),
        environment = val(f, "environment");
      if (
        !["ABA PayWay", "ACLEDA", "Other"].includes(provider) ||
        !["Demo", "Sandbox", "Production"].includes(environment)
      )
        throw new Error("Invalid payment settings");
      Object.assign(s, {
        provider,
        environment,
        khqr: f.get("khqr") === "on",
        visa: f.get("visa") === "on",
        mastercard: f.get("mastercard") === "on",
      });
    }
    if (section === "general")
      Object.assign(s, {
        siteName: val(f, "siteName", 100),
        phone: val(f, "phone", 40),
        email: val(f, "email", 254),
      });
    if (section === "footer") s.footer = pair(f, "footer");
    if (section === "navigation")
      s.nav = [
        "about",
        "learn",
        "courses",
        "teachers",
        "centers",
        "resources",
        "contact",
      ].filter((x) => f.get(x) === "on");
    if (section === "seo") s.seo = pair(f, "seo");
  });
  revalidatePath("/", "layout");
  redirect(
    `/admin/${section === "footer" || section === "navigation" ? section : `settings/${section}`}?saved=1`,
  );
}
export async function registrationAction(f: FormData) {
  await requireAdmin();
  await mutate((db) => {
    const r = db.registrations.find((r) => r.id === val(f, "id"));
    if (!r) throw new Error("Not found");
    const status = val(f, "status");
    if (status === "completed" && r.paymentStatus === "paid")
      r.registrationStatus = "completed";
    else if (status === "cancelled" && r.paymentStatus !== "paid")
      r.registrationStatus = "cancelled";
    else
      throw new Error(
        "Paid registrations can be completed; unpaid registrations can be cancelled. Refunds require the payment provider.",
      );
  });
  revalidatePath("/", "layout");
}
export async function markRead(f: FormData) {
  await requireAdmin();
  await mutate((db) => {
    const m = db.messages.find((m) => m.id === val(f, "id"));
    if (m) m.read = true;
  });
  revalidatePath("/admin/messages");
}
export async function saveMedia(f: FormData) {
  await requireAdmin();
  await mutate((db) => {
    const m = db.media.find((m) => m.id === val(f, "id"));
    if (m) m.alt = val(f, "alt", 200);
  });
  revalidatePath("/admin/media");
}
