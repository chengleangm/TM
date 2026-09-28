import { NextRequest, NextResponse } from "next/server";
export function proxy(request: NextRequest) {
  const publicPaths = [
    "about",
    "what-is-tm",
    "benefits",
    "learn",
    "courses",
    "teachers",
    "centers",
    "testimonials",
    "videos",
    "faq",
    "contact",
    "register",
    "checkout",
    "payment",
    "privacy",
    "terms",
  ];
  if (
    request.nextUrl.pathname === "/" ||
    publicPaths.includes(request.nextUrl.pathname.split("/")[1])
  ) {
    const lang =
      request.cookies.get("tm-language")?.value === "en" ? "en" : "km";
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}${request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }
  const headers = new Headers(request.headers);
  headers.set(
    "x-tm-language",
    request.nextUrl.pathname.startsWith("/km") ? "km" : "en",
  );
  return NextResponse.next({ request: { headers } });
}
export const config = { matcher: ["/((?!api|_next|images|.*\\..*).*)"] };
