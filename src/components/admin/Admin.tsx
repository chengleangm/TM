import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  CreditCard,
  Users,
  ArrowUpRight,
  Globe,
  CalendarDays,
  MessageSquare,
  ImageIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { repository, seats } from "@/services/repository";
import { requireAdmin, demoMode } from "@/services/auth";
import {
  saveContent,
  saveCourse,
  courseAction,
  savePerson,
  saveSettings,
  registrationAction,
  markRead,
  saveMedia,
  logoutAction,
} from "@/services/actions";
import { date, label, money } from "@/lib/platform";
import type { Bilingual, Database, Center } from "@/types/platform";
import { Submit } from "@/components/public/Forms";

const groups: { name: string; items: [string, string, typeof Users][] }[] = [
  { name: "WORKSPACE", items: [["Dashboard", "", LayoutDashboard]] },
  {
    name: "WEBSITE",
    items: [
      ["Homepage", "content/home", Globe],
      ["About", "content/about", Globe],
      ["What is TM", "content/what-is-tm", Globe],
      ["Benefits", "content/benefits", Globe],
      ["Learn TM", "content/learn", Globe],
      ["All page content", "content", Globe],
      ["Testimonials", "content/testimonials", Globe],
      ["Videos", "content/videos", Globe],
      ["FAQ", "content/faq", Globe],
      ["Navigation", "navigation", Globe],
      ["Footer", "footer", Globe],
    ],
  },
  {
    name: "COURSES",
    items: [
      ["Courses", "courses", BookOpen],
      ["Schedule", "schedule", CalendarDays],
      ["Registrations", "registrations", Users],
      ["Payments", "payments", CreditCard],
    ],
  },
  {
    name: "PEOPLE",
    items: [
      ["Teachers", "teachers", Users],
      ["Centers", "centers", Globe],
    ],
  },
  {
    name: "COMMUNICATION",
    items: [["Contact messages", "messages", MessageSquare]],
  },
  { name: "MEDIA", items: [["Media library", "media", ImageIcon]] },
  {
    name: "SETTINGS",
    items: [
      ["General", "settings/general", Settings],
      ["Languages", "settings/languages", Globe],
      ["Payment", "settings/payments", CreditCard],
      ["SEO", "settings/seo", Settings],
    ],
  },
];
export function AdminShell({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-logo" href="/admin">
          <span>tm</span>
          <div>
            TM Cambodia<small>WEBSITE MANAGER</small>
          </div>
        </Link>
        <div className="admin-scroll">
          {groups.map((g) => (
            <div className="admin-nav-group" key={g.name}>
              <p>{g.name}</p>
              {g.items.map(([name, route, Icon]) => (
                <Link
                  href={`/admin${route ? `/${route}` : ""}`}
                  key={name}
                  className={path === route ? "active" : ""}
                >
                  <Icon size={16} />
                  {name}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <Link href="/en" className="admin-view-site">
          View website <ArrowUpRight size={16} />
        </Link>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <details className="admin-mobile-nav">
            <summary>☰ Menu</summary>
            <nav>
              {groups
                .flatMap((g) => g.items)
                .map(([name, route]) => (
                  <Link key={route} href={`/admin${route ? `/${route}` : ""}`}>
                    {name}
                  </Link>
                ))}
            </nav>
          </details>
          <span>
            TM Cambodia <span className="admin-divider">/</span>{" "}
            <b>Admin workspace</b>
          </span>
          <div>
            <span className="demo-chip">
              {demoMode() ? "Demo mode" : "Gateway disconnected"}
            </span>
            <form action={logoutAction}>
              <button className="icon-button" aria-label="Sign out">
                <LogOut size={18} />
              </button>
            </form>
            <span className="admin-avatar">TM</span>
          </div>
        </header>
        <main className="admin-content" id="main">
          {children}
        </main>
        <footer className="admin-bottom">
          TM Cambodia · Website & course management{" "}
          <span>Local demo repository</span>
        </footer>
      </div>
    </div>
  );
}
function Heading({
  eyebrow = "YOUR WORKSPACE",
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="admin-empty">
      <BookOpen size={28} />
      <h3>Nothing here yet.</h3>
      <p>{text}</p>
    </div>
  );
}
function Table({
  heads,
  children,
}: {
  heads: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
function Input({
  name,
  label: caption,
  value,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  value: string | number;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="form-field">
      <span>{caption}</span>
      <input
        name={name}
        defaultValue={value}
        type={type}
        required={required}
        min={type === "number" ? 0 : undefined}
        step={type === "number" ? "any" : undefined}
      />
    </label>
  );
}
function BiFields({
  name,
  title,
  value,
  large = false,
}: {
  name: string;
  title: string;
  value: Bilingual;
  large?: boolean;
}) {
  return (
    <div className="form-grid">
      {(["en", "km"] as const).map((lang) => (
        <label className="form-field" key={lang}>
          <span>
            {title} · {lang === "en" ? "English" : "Khmer"}
          </span>
          {large || name === "title" ? (
            <textarea
              name={`${name}${lang === "en" ? "En" : "Km"}`}
              defaultValue={value[lang]}
              rows={name === "content" ? 10 : name === "title" ? 2 : 4}
              required
            />
          ) : (
            <input
              name={`${name}${lang === "en" ? "En" : "Km"}`}
              defaultValue={value[lang]}
              required
            />
          )}
        </label>
      ))}
    </div>
  );
}
function ImageSelect({ db, value }: { db: Database; value: string }) {
  return (
    <label className="form-field">
      <span>Hero image</span>
      <select name="image" defaultValue={value}>
        {db.media.map((m) => (
          <option value={m.path} key={m.id}>
            {m.path}
          </option>
        ))}
      </select>
    </label>
  );
}
function Saved({ saved }: { saved: boolean }) {
  return saved ? (
    <div className="notice success" role="status">
      Changes saved. Published updates are now visible on the website.
    </div>
  ) : null;
}
export async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const path = (await params).path ?? [];
  const q = await searchParams;
  const db = await repository();
  const section = path[0] ?? "dashboard";
  const id = path[1];
  let content: React.ReactNode;
  if (section === "dashboard") {
    const paid = db.payments.filter((p) => p.status === "paid");
    content = (
      <>
        <Heading
          title="A little clarity for your day."
          description="Your courses, community, and website — all in one place."
          action={
            <Link className="button small" href="/admin/courses">
              Manage courses <ArrowUpRight size={16} />
            </Link>
          }
        />
        <div className="admin-stats">
          {[
            [
              "Total registrations",
              db.registrations.length,
              "Across all courses",
              Users,
            ],
            [
              "Demo revenue",
              money(paid.reduce((n, p) => n + p.amount, 0)),
              "Verified demo payments",
              CreditCard,
            ],
            [
              "Active courses",
              db.courses.filter((c) => c.status === "open").length,
              "Open for registration",
              BookOpen,
            ],
            [
              "New messages",
              db.messages.filter((m) => !m.read).length,
              "Waiting in your inbox",
              MessageSquare,
            ],
          ].map(([name, value, note, Icon]) => {
            const I = Icon as typeof Users;
            return (
              <div className="stat-card" key={String(name)}>
                <div>
                  <span>{String(name)}</span>
                  <I size={19} />
                </div>
                <strong>{String(value)}</strong>
                <p>{String(note)}</p>
              </div>
            );
          })}
        </div>
        <div className="admin-dashboard-grid">
          <section className="admin-panel">
            <div className="panel-heading">
              <h2>Upcoming courses</h2>
              <Link href="/admin/courses">View all ↗</Link>
            </div>
            {db.courses
              .filter((c) => c.status !== "archived")
              .slice(0, 4)
              .map((c) => (
                <Link
                  href={`/admin/courses/${c.id}`}
                  className="upcoming-row"
                  key={c.id}
                >
                  <span className="date-square">
                    {new Date(c.start).getUTCDate()}
                    <small>
                      {new Intl.DateTimeFormat("en", {
                        month: "short",
                        timeZone: "UTC",
                      }).format(new Date(c.start))}
                    </small>
                  </span>
                  <div>
                    <strong>{c.title.en}</strong>
                    <p>
                      {db.centers.find((x) => x.id === c.centerId)?.city.en} ·{" "}
                      {seats(db, c.id)} places left
                    </p>
                  </div>
                  <span className={`status ${c.status}`}>{c.status}</span>
                </Link>
              ))}
          </section>
          <section className="admin-welcome">
            <p className="eyebrow">MAKE IT YOURS</p>
            <h2>A website that grows with your community.</h2>
            <p>
              Update English and Khmer content, publish new information, and
              keep your courses current.
            </p>
            <Link className="button button-secondary" href="/admin/content">
              Edit website content <ArrowUpRight size={16} />
            </Link>
          </section>
        </div>
        <section className="admin-panel">
          <div className="panel-heading">
            <h2>Recent registrations</h2>
            <Link href="/admin/registrations">View all ↗</Link>
          </div>
          {db.registrations.length ? (
            <Table heads={["Student", "Course", "Date", "Payment", "Status"]}>
              {db.registrations
                .slice(-5)
                .reverse()
                .map((r) => (
                  <tr key={r.id}>
                    <td>
                      <Link href={`/admin/registrations/${r.id}`}>
                        {r.firstName} {r.lastName}
                      </Link>
                      <small>{r.email}</small>
                    </td>
                    <td>
                      {db.courses.find((c) => c.id === r.courseId)?.title.en}
                    </td>
                    <td>{date(r.createdAt)}</td>
                    <td>
                      <span className={`status ${r.paymentStatus}`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td>{r.registrationStatus}</td>
                  </tr>
                ))}
            </Table>
          ) : (
            <Empty text="Complete a demo booking to see your first registration here." />
          )}
        </section>
      </>
    );
  } else if (section === "content") {
    if (!id)
      content = (
        <>
          <Heading
            title="Every page. One place."
            description="Manage English and Khmer content across the complete website."
          />
          <div className="admin-content-grid">
            {db.pages.map((p) => (
              <Link
                key={p.slug}
                className="admin-panel content-page-card"
                href={`/admin/content/${p.slug}`}
              >
                <span className={`status ${p.published ? "open" : ""}`}>
                  {p.published ? "Published" : "Draft"}
                </span>
                <h3>{label(p.slug, "en")}</h3>
                <p>{p.title.en.replace(/\n/g, " ")}</p>
                <span className="text-link">
                  Edit page <ArrowUpRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </>
      );
    else {
      const p = db.pages.find((p) => p.slug === id);
      if (!p) notFound();
      content = (
        <>
          <Heading
            title={`Edit ${label(p.slug, "en")}`}
            description="Plain text content is rendered safely. Separate paragraphs with a blank line."
            action={
              <Link
                className="button button-secondary small"
                href={`/en/${p.slug === "home" ? "" : p.slug}?preview=1`}
                target="_blank"
              >
                Preview ↗
              </Link>
            }
          />
          <Saved saved={q.saved === "1"} />
          <form action={saveContent} className="admin-panel editor-form">
            <input type="hidden" name="slug" value={p.slug} />
            <BiFields name="title" title="Title" value={p.title} />
            <BiFields
              name="content"
              title={
                p.slug === "faq"
                  ? "Questions & answers (question line, answer lines, blank line between entries)"
                  : "Content"
              }
              value={p.content}
              large
            />
            <ImageSelect db={db} value={p.image} />
            <BiFields name="seo" title="SEO description" value={p.seo} large />
            <label className="check-field">
              <input
                type="checkbox"
                name="published"
                defaultChecked={p.published}
              />
              Published (uncheck to make this page a draft)
            </label>
            <Submit>Save page</Submit>
          </form>
        </>
      );
    }
  } else if (section === "courses" || section === "schedule") {
    const c = id ? db.courses.find((c) => c.id === id) : undefined;
    if (id && !c) notFound();
    if (c)
      content = (
        <>
          <Heading
            title="Edit course"
            description={c.title.en}
            action={
              <Link
                href={`/en/courses/${c.slug}`}
                className="button button-secondary small"
                target="_blank"
              >
                View course ↗
              </Link>
            }
          />
          <Saved saved={q.saved === "1"} />
          <form action={saveCourse} className="admin-panel editor-form">
            <input type="hidden" name="id" value={c.id} />
            <BiFields name="title" title="Course name" value={c.title} />
            <BiFields
              name="description"
              title="Description"
              value={c.description}
              large
            />
            <ImageSelect db={db} value={c.image} />
            <div className="form-grid">
              <Input
                name="price"
                label="Price USD"
                value={c.price}
                type="number"
              />
              <Input
                name="priceKhr"
                label="Price KHR (display amount)"
                value={c.priceKhr}
                type="number"
              />
              <Input
                name="capacity"
                label="Total seat capacity"
                value={c.capacity}
                type="number"
              />
              <label className="form-field">
                <span>Status</span>
                <select name="status" defaultValue={c.status}>
                  {["open", "full", "closed", "archived"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <Input
                name="start"
                label="Start date"
                value={c.start}
                type="date"
              />
              <Input name="end" label="End date" value={c.end} type="date" />
              <label className="form-field">
                <span>Center</span>
                <select name="centerId" defaultValue={c.centerId}>
                  {db.centers.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.name.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Teacher</span>
                <select name="teacherId" defaultValue={c.teacherId}>
                  {db.teachers.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.name.en}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <span>Language</span>
                <select name="language" defaultValue={c.language}>
                  <option value="both">Khmer & English</option>
                  <option value="km">Khmer</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label className="form-field">
                <span>Type</span>
                <select name="type" defaultValue={c.type}>
                  <option value="course">TM course</option>
                  <option value="intro">Intro session</option>
                  <option value="followup">Follow-up</option>
                </select>
              </label>
            </div>
            <BiFields
              name="schedule"
              title="Schedule"
              value={c.schedule}
              large
            />
            <BiFields
              name="included"
              title="Included (one item per line)"
              value={c.included}
              large
            />
            <BiFields
              name="requirements"
              title="Requirements"
              value={c.requirements}
              large
            />
            <Submit>Save course</Submit>
          </form>
        </>
      );
    else
      content = (
        <>
          <Heading
            title={
              section === "schedule"
                ? "Your teaching calendar."
                : "Courses & new beginnings."
            }
            description="Edit schedules and prices, duplicate a course to create a new one, or close registration."
          />
          <div className="admin-panel">
            <Table
              heads={[
                "Course",
                "Location / teacher",
                "Price",
                "Next date",
                "Registrations",
                "Availability",
                "Status",
                "Actions",
              ]}
            >
              {db.courses.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/admin/courses/${c.id}`}>
                      <b>{c.title.en}</b>
                    </Link>
                    <small>{c.type}</small>
                  </td>
                  <td>
                    {db.centers.find((x) => x.id === c.centerId)?.city.en}
                    <small>
                      {db.teachers.find((x) => x.id === c.teacherId)?.name.en}
                    </small>
                  </td>
                  <td>{money(c.price)}</td>
                  <td>{date(c.start)}</td>
                  <td>
                    <Link href={`/admin/registrations?course=${c.id}`}>
                      {
                        db.registrations.filter((r) => r.courseId === c.id)
                          .length
                      }{" "}
                      registrations ↗
                    </Link>
                  </td>
                  <td>
                    {seats(db, c.id)} / {c.capacity}
                  </td>
                  <td>
                    <span className={`status ${c.status}`}>{c.status}</span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link href={`/admin/courses/${c.id}`}>Edit</Link>
                      <Link href={`/en/courses/${c.slug}`}>View</Link>
                      <form action={courseAction}>
                        <input type="hidden" name="id" value={c.id} />
                        <button name="action" value="duplicate">
                          Duplicate
                        </button>
                        <button name="action" value="archive">
                          Archive
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </>
      );
  } else if (section === "registrations") {
    const r = id ? db.registrations.find((r) => r.id === id) : undefined;
    if (id && !r) notFound();
    if (r)
      content = (
        <>
          <Heading title={`${r.firstName} ${r.lastName}`} description={r.id} />
          <div className="admin-panel editor-form">
            <dl className="admin-detail-list">
              {Object.entries(r)
                .filter(([key]) => key !== "owner")
                .map(([key, value]) => (
                  <div key={key}>
                    <dt>{key}</dt>
                    <dd>{String(value) || "—"}</dd>
                  </div>
                ))}
            </dl>
            <form action={registrationAction}>
              <input type="hidden" name="id" value={r.id} />
              <label className="form-field">
                <span>Registration action</span>
                <select name="status">
                  {r.paymentStatus === "paid" ? (
                    <option value="completed">Mark course completed</option>
                  ) : (
                    <option value="cancelled">
                      Cancel unpaid registration
                    </option>
                  )}
                </select>
              </label>
              <Submit>Update registration</Submit>
            </form>
            <p>
              Payment confirmation comes from the server payment provider. Paid
              bookings cannot be manually cancelled here; refunds require a
              provider integration.
            </p>
          </div>
        </>
      );
    else {
      const list = db.registrations.filter(
        (r) =>
          (!q.course || r.courseId === q.course) &&
          (!q.payment || r.paymentStatus === q.payment) &&
          (!q.status || r.registrationStatus === q.status) &&
          (!q.date || r.createdAt.startsWith(String(q.date))),
      );
      content = (
        <>
          <Heading
            title="Your growing community."
            description="Manage course registrations and see payment progress."
          />
          <form className="admin-filters">
            <label className="form-field">
              <span>Course</span>
              <select name="course" defaultValue={String(q.course ?? "")}>
                <option value="">All courses</option>
                {db.courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title.en}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              <span>Payment status</span>
              <select name="payment" defaultValue={String(q.payment ?? "")}>
                <option value="">All payments</option>
                {["pending", "paid", "failed", "cancelled", "refunded"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            </label>
            <label className="form-field">
              <span>Registration status</span>
              <select name="status" defaultValue={String(q.status ?? "")}>
                <option value="">All statuses</option>
                {["pending", "confirmed", "cancelled", "completed"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <Input
              name="date"
              label="Registration date"
              type="date"
              value={String(q.date ?? "")}
              required={false}
            />
            <button className="button small">Filter</button>
            <Link href="/admin/registrations">Reset</Link>
          </form>
          <div className="admin-panel">
            {list.length ? (
              <Table
                heads={[
                  "Registration",
                  "Name",
                  "Email / phone",
                  "Course",
                  "Date",
                  "Amount",
                  "Payment",
                  "Status",
                  "Actions",
                ]}
              >
                {list.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <small>{r.id}</small>
                    </td>
                    <td>
                      {r.firstName} {r.lastName}
                    </td>
                    <td>
                      {r.email}
                      <small>{r.phone}</small>
                    </td>
                    <td>
                      {db.courses.find((c) => c.id === r.courseId)?.title.en}
                    </td>
                    <td>{date(r.createdAt)}</td>
                    <td>{money(r.amount)}</td>
                    <td>
                      <span className={`status ${r.paymentStatus}`}>
                        {r.paymentStatus}
                      </span>
                    </td>
                    <td>{r.registrationStatus}</td>
                    <td>
                      <Link href={`/admin/registrations/${r.id}`}>View ↗</Link>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              <Empty text="No registrations match. Complete a demo booking or reset the filters." />
            )}
          </div>
        </>
      );
    }
  } else if (section === "payments") {
    const p = id ? db.payments.find((p) => p.id === id) : undefined;
    if (id && !p) notFound();
    if (p) {
      const r = db.registrations.find((r) => r.id === p.registrationId)!;
      content = (
        <>
          <Heading
            title="Payment details"
            description={p.providerTransactionId}
          />
          <div className="admin-panel editor-form">
            <span className={`status ${p.status}`}>{p.status}</span>
            <dl className="admin-detail-list">
              {[
                ["Customer", `${r.firstName} ${r.lastName}`],
                ["Email", r.email],
                ["Registration", r.id],
                [
                  "Course",
                  db.courses.find((c) => c.id === p.courseId)?.title.en,
                ],
                ["Amount", money(p.amount)],
                ["Currency", p.currency],
                ["Method", p.method],
                ["Provider", p.provider],
                ["Provider reference", p.providerTransactionId],
                ["Created", date(p.createdAt)],
                ["Paid", p.paidAt ? date(p.paidAt) : "Not paid"],
              ].map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Link className="text-link" href={`/admin/registrations/${r.id}`}>
              View registration ↗
            </Link>
          </div>
        </>
      );
    } else {
      const list = db.payments.filter(
        (p) => !q.status || p.status === q.status,
      );
      content = (
        <>
          <Heading
            title="Payments, at a glance."
            description="Server-verified payment records. No card details are collected or stored."
          />
          <form className="admin-filters">
            <label className="form-field">
              <span>Status</span>
              <select name="status" defaultValue={String(q.status ?? "")}>
                <option value="">All statuses</option>
                {["paid", "pending", "failed", "cancelled", "refunded"].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            </label>
            <button className="button small">Filter</button>
          </form>
          <div className="admin-panel">
            {list.length ? (
              <Table
                heads={[
                  "Transaction",
                  "Registration",
                  "Customer",
                  "Course",
                  "Amount",
                  "Currency",
                  "Method",
                  "Provider",
                  "Date",
                  "Status",
                ]}
              >
                {list.map((p) => {
                  const r = db.registrations.find(
                    (r) => r.id === p.registrationId,
                  )!;
                  return (
                    <tr key={p.id}>
                      <td>
                        <Link href={`/admin/payments/${p.id}`}>
                          {p.providerTransactionId} ↗
                        </Link>
                      </td>
                      <td>
                        <Link href={`/admin/registrations/${r.id}`}>
                          {r.id.slice(0, 12)}…
                        </Link>
                      </td>
                      <td>
                        {r.firstName} {r.lastName}
                      </td>
                      <td>
                        {db.courses.find((c) => c.id === p.courseId)?.title.en}
                      </td>
                      <td>{money(p.amount)}</td>
                      <td>{p.currency}</td>
                      <td>{p.method.toUpperCase()}</td>
                      <td>{p.provider}</td>
                      <td>{date(p.createdAt)}</td>
                      <td>
                        <span className={`status ${p.status}`}>{p.status}</span>
                      </td>
                    </tr>
                  );
                })}
              </Table>
            ) : (
              <Empty text="Payment attempts will appear here after checkout." />
            )}
          </div>
        </>
      );
    }
  } else if (section === "teachers" || section === "centers") {
    const p = id ? db[section].find((p) => p.id === id) : undefined;
    if (id && !p) notFound();
    content = p ? (
      <>
        <Heading
          title={`Edit ${section === "teachers" ? "teacher" : "center"}`}
          description={p.name.en}
        />
        <Saved saved={q.saved === "1"} />
        <form action={savePerson} className="admin-panel editor-form">
          <input type="hidden" name="id" value={p.id} />
          <input type="hidden" name="kind" value={section} />
          <BiFields name="name" title="Name" value={p.name} />
          <BiFields
            name="description"
            title="Profile"
            value={p.description}
            large
          />
          <ImageSelect db={db} value={p.image} />
          {"address" in p && (
            <>
              <BiFields name="city" title="City" value={(p as Center).city} />
              <BiFields
                name="address"
                title="Address"
                value={(p as Center).address}
              />
              <Input
                name="map"
                label="Google Maps URL"
                value={(p as Center).map}
                type="url"
              />
            </>
          )}
          <label className="check-field">
            <input
              name="published"
              type="checkbox"
              defaultChecked={p.published}
            />
            Published
          </label>
          <Submit>Save profile</Submit>
        </form>
      </>
    ) : (
      <>
        <Heading
          title={
            section === "teachers"
              ? "People behind the practice."
              : "Places to begin."
          }
        />
        <div className="admin-content-grid">
          {db[section].map((p) => (
            <Link
              href={`/admin/${section}/${p.id}`}
              className="admin-panel content-page-card"
              key={p.id}
            >
              <h3>{p.name.en}</h3>
              <p>{p.description.en}</p>
              <span className="text-link">Edit profile ↗</span>
            </Link>
          ))}
        </div>
      </>
    );
  } else if (section === "messages")
    content = (
      <>
        <Heading
          title="Keep the conversation going."
          description="Demo enquiries saved from the contact page."
        />
        <div className="admin-panel">
          {db.messages.length ? (
            <Table heads={["Name", "Email", "Message", "Received", "Status"]}>
              {db.messages
                .slice()
                .reverse()
                .map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td className="message-cell">{m.message}</td>
                    <td>{date(m.createdAt)}</td>
                    <td>
                      {m.read ? (
                        "Read"
                      ) : (
                        <form action={markRead}>
                          <input type="hidden" name="id" value={m.id} />
                          <button className="text-link">Mark read</button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
            </Table>
          ) : (
            <Empty text="Contact form messages will appear here. This local demo does not send email." />
          )}
        </div>
      </>
    );
  else if (section === "media")
    content = (
      <>
        <Heading
          title="Your visual library."
          description="Choose these local images in page and course editors. Descriptions help editors identify each asset."
        />
        <div className="admin-content-grid">
          {db.media.map((m) => (
            <form
              action={saveMedia}
              className="admin-panel media-card"
              key={m.id}
            >
              <div>
                <Image
                  src={m.path}
                  alt={m.alt}
                  fill
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <input type="hidden" name="id" value={m.id} />
              <p>
                <code>{m.path}</code>
              </p>
              <Input name="alt" label="Library description" value={m.alt} />
              <Submit>Save description</Submit>
            </form>
          ))}
        </div>
      </>
    );
  else if (
    section === "settings" ||
    section === "navigation" ||
    section === "footer"
  ) {
    const key = section === "settings" ? (id ?? "general") : section;
    const s = db.settings;
    if (
      ![
        "general",
        "payments",
        "languages",
        "seo",
        "navigation",
        "footer",
      ].includes(key)
    )
      notFound();
    content = (
      <>
        <Heading
          title={
            {
              general: "The essentials.",
              payments: "Payment settings.",
              languages: "Two languages. One community.",
              seo: "Help people find you.",
              navigation: "Shape your navigation.",
              footer: "A thoughtful sign-off.",
            }[key]!
          }
          description={
            key === "payments"
              ? "Gateway credentials belong in server environment variables. No secret keys are displayed or stored here."
              : "Changes apply across the website."
          }
        />
        <Saved saved={q.saved === "1"} />
        <form action={saveSettings} className="admin-panel editor-form">
          <input type="hidden" name="section" value={key} />
          {key === "general" && (
            <>
              <Input name="siteName" label="Site name" value={s.siteName} />
              <Input name="phone" label="Contact phone" value={s.phone} />
              <Input
                name="email"
                label="Contact email (optional)"
                type="email"
                required={false}
                value={s.email}
              />
            </>
          )}
          {key === "footer" && (
            <BiFields name="footer" title="Footer headline" value={s.footer} />
          )}{" "}
          {key === "seo" && (
            <>
              <BiFields
                name="seo"
                title="Default SEO description"
                value={s.seo}
                large
              />
              <p>
                Each page also has its own SEO description in the content
                editor. Canonicals and language alternates are generated for
                English and Khmer.
              </p>
            </>
          )}
          {key === "navigation" && (
            <>
              <p>
                Home is always visible. Choose which other groups appear in the
                header.
              </p>
              {[
                "about",
                "learn",
                "courses",
                "teachers",
                "centers",
                "resources",
                "contact",
              ].map((k) => (
                <label className="check-field" key={k}>
                  <input
                    name={k}
                    type="checkbox"
                    defaultChecked={s.nav.includes(k)}
                  />
                  {label(k, "en")}
                </label>
              ))}
            </>
          )}
          {key === "languages" && (
            <>
              <div className="language-setting">
                <strong>English</strong>
                <span>/en · Active</span>
              </div>
              <div className="language-setting">
                <strong>ខ្មែរ</strong>
                <span>/km · Active · Default</span>
              </div>
              <p>
                The language switch preserves the page and booking reference.
                Edit both translations using the page editors.
              </p>
              <Link className="button" href="/admin/content">
                Edit translations ↗
              </Link>
            </>
          )}
          {key === "payments" && (
            <>
              <div className="form-grid">
                <label className="form-field">
                  <span>Preferred provider</span>
                  <select name="provider" defaultValue={s.provider}>
                    {["ABA PayWay", "ACLEDA", "Other"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
                <label className="form-field">
                  <span>Environment</span>
                  <select name="environment" defaultValue={s.environment}>
                    {["Demo", "Sandbox", "Production"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="notice">
                Only Demo has an implemented adapter. Sandbox or Production
                disables checkout until a real server-side gateway is
                integrated. The server DEMO_MODE flag also gates all
                simulations.
              </p>
              {["khqr", "visa", "mastercard"].map((k) => (
                <label className="check-field" key={k}>
                  <input
                    type="checkbox"
                    name={k}
                    defaultChecked={s[k as "khqr" | "visa" | "mastercard"]}
                  />
                  {k.toUpperCase()}
                </label>
              ))}
              <div className="gateway-status">
                <p>
                  <b>Merchant status</b>
                  <span>Not connected</span>
                </p>
                <p>
                  <b>Webhook status</b>
                  <span>Rejects unverified callbacks</span>
                </p>
                <p>
                  <b>Gateway status</b>
                  <span>
                    {s.environment === "Demo" && demoMode()
                      ? "Demo adapter ready"
                      : "Unavailable"}
                  </span>
                </p>
              </div>
            </>
          )}
          {key !== "languages" && <Submit>Save settings</Submit>}
        </form>
      </>
    );
  } else notFound();
  return <AdminShell path={path.join("/")}>{content}</AdminShell>;
}
