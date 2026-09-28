import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export function ActionLink({
  href,
  children,
  secondary = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  );
}
