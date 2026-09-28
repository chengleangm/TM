import { DM_Sans, Manrope, Kantumruy_Pro } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans-body",
  display: "swap",
});
const heading = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});
const khmer = Kantumruy_Pro({
  subsets: ["khmer"],
  variable: "--font-khmer",
  display: "swap",
});
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = (await headers()).get("x-tm-language") === "en" ? "en" : "km";
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${heading.variable} ${khmer.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
