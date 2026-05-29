"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/tutors", label: "找家教" },
  { href: "/requirements", label: "需求大厅" },
  { href: "/#subjects", label: "学科分类", exact: false },
  { href: "/#how-it-works", label: "如何使用", exact: false },
];

export default function NavLinks() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <nav className="hidden md:flex items-center gap-8">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-sm font-medium transition-colors ${
            isActive(link.href)
              ? "text-indigo-600"
              : "text-gray-600 hover:text-indigo-600"
          }`}
        >
          {link.label}
          {isActive(link.href) && (
            <span className="block h-0.5 bg-indigo-600 rounded-full mt-0.5" />
          )}
        </Link>
      ))}
    </nav>
  );
}
