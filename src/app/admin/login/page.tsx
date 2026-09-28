import { redirect } from "next/navigation";
import { isAdmin } from "@/services/auth";
import { LoginForm } from "@/components/public/Forms";
export const metadata = {
  title: "Admin sign in | TM Cambodia",
  robots: { index: false, follow: false },
};
export default async function Login() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="login-page">
      <LoginForm
        localDemo={
          process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD
        }
      />
    </main>
  );
}
