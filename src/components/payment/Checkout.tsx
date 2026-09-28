import Image from "next/image";
import Link from "next/link";
import QRCode from "qrcode";
import { Check, Clock3, X, ShieldCheck } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import { repository } from "@/services/repository";
import { demoMode, owner, isAdmin } from "@/services/auth";
import { checkAction } from "@/services/actions";
import { isLanguage } from "@/lib/translations";
import { date, money, resultPath, statusLabel, tr } from "@/lib/platform";
import { Button, PageHero, Breadcrumb } from "@/components/public/Shared";
import { DemoControls, PaymentMethodSelector } from "@/components/public/Forms";
import type { PublicProps } from "@/components/public/Pages";
import type {
  Course,
  Database,
  Locale,
  Payment,
  Registration,
} from "@/types/platform";

export function CheckoutSummary({
  r,
  course,
  lang,
  db,
  payment,
}: {
  r: Registration;
  course: Course;
  lang: Locale;
  db: Database;
  payment?: Payment;
}) {
  return (
    <div className="checkout-summary">
      <p className="eyebrow">{tr(lang, "YOUR COURSE", "វគ្គរបស់អ្នក")}</p>
      <h2>{course.title[lang]}</h2>
      <dl>
        <div>
          <dt>{tr(lang, "Student", "សិស្ស")}</dt>
          <dd>
            {r.firstName} {r.lastName}
          </dd>
        </div>
        <div>
          <dt>{tr(lang, "Date", "កាលបរិច្ឆេទ")}</dt>
          <dd>{date(course.start, lang)}</dd>
        </div>
        <div>
          <dt>{tr(lang, "Location", "ទីតាំង")}</dt>
          <dd>
            {db.centers.find((c) => c.id === course.centerId)?.name[lang]}
          </dd>
        </div>
        <div>
          <dt>{tr(lang, "Teacher", "គ្រូ")}</dt>
          <dd>
            {db.teachers.find((t) => t.id === course.teacherId)?.name[lang]}
          </dd>
        </div>
        <div>
          <dt>{tr(lang, "Currency", "រូបិយប័ណ្ណ")}</dt>
          <dd>USD</dd>
        </div>
        <div>
          <dt>{tr(lang, "Course price", "តម្លៃវគ្គ")}</dt>
          <dd>{money(payment?.amount ?? course.price)}</dd>
        </div>
        <div className="summary-total">
          <dt>{tr(lang, "Total", "សរុប")}</dt>
          <dd>{money(payment?.amount ?? course.price)}</dd>
        </div>
      </dl>
    </div>
  );
}
export async function CheckoutPage({ params, searchParams }: PublicProps) {
  const { lang } = await params;
  if (!isLanguage(lang)) redirect("/en/checkout");
  const q = await searchParams;
  const session = await owner();
  const db = await repository();
  const content = db.pages.find((page) => page.slug === "checkout");
  if (
    !content ||
    (!content.published && !(q.preview === "1" && (await isAdmin())))
  )
    notFound();
  const r = session
    ? db.registrations.find(
        (r) => r.id === q.registration && r.owner === session,
      )
    : undefined;
  if (!r)
    return (
      <section className="container platform-section empty-state">
        <ShieldCheck size={40} />
        <h1>
          {tr(
            lang,
            "Let’s start with your registration.",
            "សូមចាប់ផ្តើមពីការចុះឈ្មោះ។",
          )}
        </h1>
        <p>
          {tr(
            lang,
            "Choose a course and add your details before checking out.",
            "ជ្រើសរើសវគ្គ និងបំពេញព័ត៌មានមុនទូទាត់។",
          )}
        </p>
        <Button href={`/${lang}/courses`}>
          {tr(lang, "Find a course", "ស្វែងរកវគ្គ")}
        </Button>
      </section>
    );
  const course = db.courses.find((c) => c.id === r.courseId)!;
  const p = db.payments.find(
    (p) => p.id === q.payment && p.registrationId === r.id,
  );
  if (p && p.status !== "pending")
    redirect(`/${lang}/payment/${resultPath(p.status)}?payment=${p.id}`);
  return (
    <>
      <div className="container">
        <Breadcrumb
          lang={lang}
          items={[
            {
              label: tr(lang, "Registration", "ការចុះឈ្មោះ"),
              href: `/${lang}/register?course=${course.id}`,
            },
            { label: tr(lang, "Checkout", "ការទូទាត់") },
          ]}
        />
      </div>
      <PageHero
        lang={lang}
        title={content.title[lang]}
        description={content.content[lang]}
      />
      <section className="container platform-section checkout-layout">
        <div className="form-panel">
          <div className="form-heading">
            <span className="step-number">02</span>
            <h2>
              {p
                ? tr(
                    lang,
                    "Complete your demo payment",
                    "បញ្ចប់ការទូទាត់សាកល្បង",
                  )
                : tr(lang, "Your registration", "ការចុះឈ្មោះរបស់អ្នក")}
            </h2>
          </div>
          {p ? (
            <>
              {p.method === "khqr" ? (
                <KhqrPayment lang={lang} payment={p} course={course} />
              ) : (
                <div className="mock-card-checkout">
                  <ShieldCheck size={42} />
                  <p className="eyebrow">
                    {tr(
                      lang,
                      "HOSTED CHECKOUT · DEMO",
                      "ការទូទាត់តាមអ្នកផ្តល់សេវា · សាកល្បង",
                    )}
                  </p>
                  <h3>
                    {tr(lang, "Visa & Mastercard", "Visa និង Mastercard")}
                  </h3>
                  <p>
                    {tr(
                      lang,
                      "In live mode, your bank’s payment provider would securely collect your card details. This preview does not ask for a card number, CVV or PIN.",
                      "ក្នុងរបៀបពិត អ្នកផ្តល់សេវាទូទាត់នឹងប្រមូលព័ត៌មានកាតដោយសុវត្ថិភាព។ ការសាកល្បងនេះមិនស្នើលេខកាត CVV ឬ PIN ទេ។",
                    )}
                  </p>
                  <strong>{money(p.amount)} USD</strong>
                </div>
              )}
              <form action={checkAction}>
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="paymentId" value={p.id} />
                <button className="button button-secondary">
                  {tr(lang, "Check payment status", "ពិនិត្យស្ថានភាពទូទាត់")}
                </button>
              </form>
              {demoMode() && db.settings.environment === "Demo" && (
                <DemoControls lang={lang} payment={p} />
              )}
            </>
          ) : (
            <>
              <div className="student-summary">
                <h3>
                  {r.firstName} {r.lastName}
                </h3>
                <p>{r.email}</p>
                <p>
                  {r.phone} · {r.city}
                </p>
                <p>
                  {tr(lang, "Preferred language", "ភាសាដែលចង់រៀន")}:{" "}
                  {r.preferredLanguage === "km" ? "ខ្មែរ" : "English"}
                </p>
              </div>
              {demoMode() && db.settings.environment === "Demo" ? (
                <PaymentMethodSelector
                  lang={lang}
                  registrationId={r.id}
                  khqr={db.settings.khqr}
                  card={db.settings.visa || db.settings.mastercard}
                />
              ) : (
                <p className="notice">
                  {tr(
                    lang,
                    "The payment gateway is not connected. Please contact the team.",
                    "ប្រព័ន្ធទូទាត់មិនទាន់ភ្ជាប់ទេ។ សូមទាក់ទងក្រុមការងារ។",
                  )}
                </p>
              )}
            </>
          )}
        </div>
        <aside className="booking-card">
          <CheckoutSummary
            r={r}
            course={course}
            lang={lang}
            db={db}
            payment={p}
          />
          <p className="secure-note">
            <ShieldCheck size={16} />
            {tr(
              lang,
              "Demo transaction · No real payment",
              "ប្រតិបត្តិការសាកល្បង · មិនបង់ប្រាក់ពិត",
            )}
          </p>
          <Link className="text-link" href={`/${lang}/contact`}>
            {tr(lang, "Need a hand? Contact us", "ត្រូវការជំនួយ? ទាក់ទងយើង")}
          </Link>
        </aside>
      </section>
    </>
  );
}
async function KhqrPayment({
  lang,
  payment,
  course,
}: {
  lang: Locale;
  payment: Payment;
  course: Course;
}) {
  const qr = await QRCode.toDataURL(
    `TM CAMBODIA DEMO ONLY - NOT A PAYMENT CODE - ${payment.providerTransactionId}`,
    { width: 256, margin: 2, color: { dark: "#173f50", light: "#ffffff" } },
  );
  return (
    <div className="khqr-payment">
      <div className="khqr-header">
        KHQR{" "}
        <span>{tr(lang, "DEMO · NOT PAYABLE", "សាកល្បង · មិនអាចបង់បាន")}</span>
      </div>
      <div className="khqr-body">
        <p>TM Cambodia</p>
        <strong>
          {money(payment.amount)} <small>USD</small>
        </strong>
        <Image
          src={qr}
          alt={tr(
            lang,
            "Demo QR code, not valid for payment",
            "កូដ QR សាកល្បង មិនអាចបង់ប្រាក់បាន",
          )}
          width={240}
          height={240}
          unoptimized
        />
        <p>{course.title[lang]}</p>
        <code>{payment.providerTransactionId}</code>
      </div>
      <p>
        {tr(
          lang,
          "For live KHQR payments: scan the provider-issued QR code using your Cambodian banking app. This demo QR contains sample text only.",
          "សម្រាប់ការបង់ប្រាក់ KHQR ពិត៖ ស្កេនកូដ QR របស់អ្នកផ្តល់សេវាដោយកម្មវិធីធនាគារកម្ពុជា។ កូដគំរូនេះមានតែអត្ថបទសាកល្បង។",
        )}
      </p>
    </div>
  );
}
export async function PaymentResult({
  params,
  searchParams,
}: PublicProps & { params: Promise<{ lang: string; status?: string }> }) {
  const { lang, status } = await params;
  if (!isLanguage(lang)) redirect("/en");
  const q = await searchParams;
  const session = await owner();
  const db = await repository();
  const p = db.payments.find(
    (p) =>
      p.id === q.payment &&
      db.registrations.some(
        (r) => r.id === p.registrationId && r.owner === session,
      ),
  );
  if (!p)
    return (
      <section className="container platform-section empty-state">
        <ShieldCheck size={40} />
        <h1>
          {tr(
            lang,
            "No verified payment found.",
            "រកមិនឃើញការទូទាត់ដែលបានបញ្ជាក់ទេ។",
          )}
        </h1>
        <p>
          {tr(
            lang,
            "Opening this page does not confirm a payment. Return to your course to begin a registration.",
            "ការបើកទំព័រនេះមិនបញ្ជាក់ការទូទាត់ទេ។ សូមត្រឡប់ទៅវគ្គដើម្បីចុះឈ្មោះ។",
          )}
        </p>
        <Button href={`/${lang}/courses`}>
          {tr(lang, "View courses", "មើលវគ្គ")}
        </Button>
      </section>
    );
  if (status !== resultPath(p.status))
    redirect(`/${lang}/payment/${resultPath(p.status)}?payment=${p.id}`);
  const r = db.registrations.find((r) => r.id === p.registrationId)!;
  const c = db.courses.find((c) => c.id === r.courseId)!;
  const success = p.status === "paid",
    pending = p.status === "pending";
  const title = success
    ? tr(lang, "Payment successful.", "ការទូទាត់ជោគជ័យ។")
    : pending
      ? tr(lang, "Payment pending.", "ការទូទាត់កំពុងរង់ចាំ។")
      : p.status === "cancelled"
        ? tr(lang, "Payment cancelled.", "ការទូទាត់បានលុបចោល។")
        : tr(lang, "Payment unsuccessful.", "ការទូទាត់មិនជោគជ័យ។");
  return (
    <section className="container platform-section">
      <div className="payment-result">
        <span
          className={`result-icon ${success ? "success" : pending ? "pending" : "failed"}`}
        >
          {success ? <Check /> : pending ? <Clock3 /> : <X />}
        </span>
        <p className="eyebrow">
          {tr(lang, "DEMO PAYMENT", "ការទូទាត់សាកល្បង")}
        </p>
        <h1>{title}</h1>
        <p>
          {success
            ? tr(
                lang,
                `Thank you, ${r.firstName}. Your demo registration has been confirmed.`,
                `សូមអរគុណ ${r.firstName}។ ការចុះឈ្មោះសាកល្បងរបស់អ្នកបានបញ្ជាក់។`,
              )
            : pending
              ? tr(
                  lang,
                  "Payment verification may still be processing. Your place is not confirmed until payment is verified.",
                  "ការផ្ទៀងផ្ទាត់អាចកំពុងដំណើរការ។ កន្លែងរបស់អ្នកមិនទាន់បានបញ្ជាក់ទេ រហូតដល់ការបង់ប្រាក់បានបញ្ជាក់។",
                )
              : tr(
                  lang,
                  "Your registration details are saved. A declined, cancelled or timed-out payment can be tried again.",
                  "ព័ត៌មានចុះឈ្មោះរបស់អ្នកបានរក្សាទុក។ អ្នកអាចព្យាយាមការទូទាត់ម្តងទៀត។",
                )}
        </p>
        {q.checked && (
          <p role="status" className="notice">
            {tr(lang, "Latest server status", "ស្ថានភាពចុងក្រោយពីម៉ាស៊ីនមេ")}:{" "}
            {statusLabel(p.status, lang)}
          </p>
        )}
        <CheckoutSummary r={r} course={c} lang={lang} db={db} payment={p} />
        <dl className="transaction-details">
          <dt>{tr(lang, "Payment method", "វិធីទូទាត់")}</dt>
          <dd>{p.method === "khqr" ? "KHQR" : "Visa / Mastercard"} · Demo</dd>
          <dt>{tr(lang, "Transaction ID", "លេខប្រតិបត្តិការ")}</dt>
          <dd>{p.providerTransactionId}</dd>
          <dt>{tr(lang, "Registration ID", "លេខចុះឈ្មោះ")}</dt>
          <dd>{r.id}</dd>
        </dl>
        <div className="button-row">
          {pending ? (
            <form action={checkAction}>
              <input type="hidden" name="lang" value={lang} />
              <input type="hidden" name="paymentId" value={p.id} />
              <button className="button">
                {tr(lang, "Check status", "ពិនិត្យស្ថានភាព")}
              </button>
            </form>
          ) : !success ? (
            <Button href={`/${lang}/checkout?registration=${r.id}`}>
              {tr(
                lang,
                "Try again / another method",
                "ព្យាយាមម្តងទៀត / វិធីផ្សេង",
              )}
            </Button>
          ) : (
            <Button href={`/${lang}/courses/${c.slug}`}>
              {tr(lang, "View course", "មើលវគ្គ")}
            </Button>
          )}
          <Button href={`/${lang}`} secondary>
            {tr(lang, "Return home", "ត្រឡប់ទំព័រដើម")}
          </Button>
          <Link className="text-link" href={`/${lang}/contact`}>
            {tr(lang, "Contact support", "ទាក់ទងជំនួយ")}
          </Link>
        </div>
        {pending && demoMode() && db.settings.environment === "Demo" && (
          <DemoControls lang={lang} payment={p} />
        )}
      </div>
    </section>
  );
}
