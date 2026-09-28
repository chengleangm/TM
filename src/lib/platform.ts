import type { Locale, PaymentStatus } from "@/types/platform";
export const tr = (lang: Locale, en: string, km: string) =>
  lang === "km" ? km : en;
export const labels: Record<string, [string, string]> = {
  home: ["Home", "ទំព័រដើម"],
  about: ["About", "អំពីយើង"],
  "what-is-tm": ["What is TM?", "តើ TM ជាអ្វី?"],
  benefits: ["Benefits", "អត្ថប្រយោជន៍"],
  learn: ["Learn TM", "រៀន TM"],
  courses: ["Courses", "វគ្គសិក្សា"],
  teachers: ["Teachers", "គ្រូបង្រៀន"],
  centers: ["Centers", "មជ្ឈមណ្ឌល"],
  resources: ["Resources", "ធនធាន"],
  testimonials: ["Testimonials", "បទពិសោធន៍"],
  videos: ["Videos", "វីដេអូ"],
  faq: ["FAQ", "សំណួរញឹកញាប់"],
  contact: ["Contact", "ទំនាក់ទំនង"],
  register: ["Registration", "ការចុះឈ្មោះ"],
  checkout: ["Checkout", "ការទូទាត់"],
  privacy: ["Privacy", "ឯកជនភាព"],
  terms: ["Terms", "លក្ខខណ្ឌ"],
};
export const label = (key: string, lang: Locale) =>
  labels[key]?.[lang === "en" ? 0 : 1] ?? key;
export const date = (value: string, lang: Locale = "en") =>
  new Intl.DateTimeFormat(lang === "km" ? "km-KH" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Phnom_Penh",
  }).format(new Date(value));
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export const statusLabel = (status: string, lang: Locale) =>
  tr(
    lang,
    status,
    (
      {
        pending: "កំពុងរង់ចាំ",
        paid: "បានបង់",
        failed: "បរាជ័យ",
        cancelled: "បានលុបចោល",
        refunded: "បានសងប្រាក់",
        open: "បើកចុះឈ្មោះ",
        full: "ពេញ",
        closed: "បិទ",
        confirmed: "បានបញ្ជាក់",
        completed: "បានបញ្ចប់",
      } as Record<string, string>
    )[status] ?? status,
  );
export const resultPath = (status: PaymentStatus) =>
  status === "paid" ? "success" : status === "refunded" ? "cancelled" : status;
