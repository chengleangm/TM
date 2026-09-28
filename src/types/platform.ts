export type Locale = "en" | "km";
export type Bilingual = Record<Locale, string>;
export type PaymentStatus =
  "pending" | "paid" | "failed" | "cancelled" | "refunded";
export interface ContentPage {
  slug: string;
  title: Bilingual;
  content: Bilingual;
  image: string;
  seo: Bilingual;
  published: boolean;
}
export interface Course {
  id: string;
  slug: string;
  title: Bilingual;
  description: Bilingual;
  image: string;
  type: "intro" | "course" | "followup";
  centerId: string;
  teacherId: string;
  start: string;
  end: string;
  schedule: Bilingual;
  language: "en" | "km" | "both";
  price: number;
  priceKhr: number;
  capacity: number;
  status: "open" | "full" | "closed" | "archived";
  included: Bilingual;
  requirements: Bilingual;
}
export interface Person {
  id: string;
  slug: string;
  name: Bilingual;
  description: Bilingual;
  image: string;
  published: boolean;
}
export interface Center extends Person {
  city: Bilingual;
  address: Bilingual;
  map: string;
}
export interface Registration {
  id: string;
  owner: string;
  courseId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  messenger: string;
  city: string;
  nationality: string;
  preferredLanguage: Locale;
  notes: string;
  paymentStatus: PaymentStatus;
  registrationStatus: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: string;
  amount: number;
  currency: "USD";
}
export interface Payment {
  id: string;
  registrationId: string;
  courseId: string;
  customerId: string;
  amount: number;
  currency: "USD";
  method: "khqr" | "card";
  provider: string;
  providerTransactionId: string;
  status: PaymentStatus;
  createdAt: string;
  paidAt?: string;
}
export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}
export interface Settings {
  siteName: string;
  phone: string;
  email: string;
  footer: Bilingual;
  nav: string[];
  provider: "ABA PayWay" | "ACLEDA" | "Other";
  environment: "Demo" | "Sandbox" | "Production";
  khqr: boolean;
  visa: boolean;
  mastercard: boolean;
  seo: Bilingual;
}
export interface Database {
  pages: ContentPage[];
  courses: Course[];
  teachers: Person[];
  centers: Center[];
  registrations: Registration[];
  payments: Payment[];
  messages: Message[];
  settings: Settings;
  media: { id: string; path: string; alt: string }[];
}
