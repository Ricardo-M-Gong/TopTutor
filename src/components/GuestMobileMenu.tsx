"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/tutors", label: "找家教" },
  { href: "/requirements", label: "需求大厅" },
  { href: "/#subjects", label: "学科分类" },
  { href: "/#how-it-works", label: "如何使用" },
];

export default function GuestMobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(true)}
        aria-label="打开菜单"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative ml-auto w-72 max-w-full bg-white h-full flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="text-lg font-bold text-indigo-600">TopTutor</span>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-4 py-4 border-t border-gray-100 space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                登录
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                免费注册
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
