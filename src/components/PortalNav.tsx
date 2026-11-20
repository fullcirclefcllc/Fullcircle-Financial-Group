"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/brand";

const TABS = [
  { href: "/portal", label: "Home", I: Icon.Home },
  { href: "/portal/documents", label: "Documents", I: Icon.Doc },
  { href: "/portal/guide", label: "Guide", I: Icon.Guide },
  { href: "/portal/profile", label: "Profile", I: Icon.User },
];

export function PortalNav() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="grid grid-cols-4 border-t border-cream-line bg-white px-2 pb-6 pt-2">
      {TABS.map(({ href, label, I }) => {
        const active = href === "/portal" ? path === "/portal" : path.startsWith(href);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] ${active ? "font-semibold text-navy" : "text-muted"}`}>
            <I size={22} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
