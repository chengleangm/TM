import { en } from "@/locales/en";
import { km } from "@/locales/km";
export type Language = "km" | "en";
export const isLanguage = (value: string): value is Language =>
  value === "km" || value === "en";
export const dictionaries = { en, km };
export const officialContact =
  "https://kh.tm.org/transcendental-meditation-contact";
