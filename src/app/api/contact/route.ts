import { NextRequest, NextResponse } from "next/server";
import { validateContact, type ContactData } from "@/lib/contact";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  // Compare the browser origin to the public Host header; Next may normalize
  // the internal request URL to localhost behind a proxy or in development.
  if (
    !origin ||
    !/^https?:\/\//.test(origin) ||
    URL.parse(origin)?.host !== request.headers.get("host")
  )
    return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 415 },
    );
  try {
    const raw = await request.text();
    if (raw.length > 16000)
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    const data = JSON.parse(raw) as Partial<ContactData>;
    if (!data || typeof data !== "object" || Array.isArray(data))
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    const errors = validateContact(data);
    if (Object.keys(errors).length)
      return NextResponse.json({ errors }, { status: 400 });
    const endpoint = process.env.CONTACT_WEBHOOK_URL;
    const token = process.env.CONTACT_WEBHOOK_TOKEN;
    if (!endpoint || !token || !endpoint.startsWith("https://"))
      return NextResponse.json({ error: "Not configured" }, { status: 503 });
    const payload = Object.fromEntries(
      (
        [
          "name",
          "email",
          "phone",
          "city",
          "language",
          "message",
          "consent",
        ] as const
      ).map((key) => [key, data[key]!.trim()]),
    );
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok)
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 400 },
    );
  }
}
