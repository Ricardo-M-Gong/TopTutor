"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Role } from "@/generated/prisma/client";

interface NavbarUserMenuProps {
  name: string;
  image?: string | null;
  role: Role;
}

export default function NavbarUserMenu({ name, image, role }: NavbarUserMenuProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      {/* Role-based CTA */}
      {role === "ADMIN" ? (
        <Link
          href="/admin"
          className="hidden sm:inline-flex text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
        >
          管理后台
        </Link>
      ) : role === "TUTOR" ? (
        <Link
          href="/dashboard/tutor"
          className="hidden sm:inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          教员后台
        </Link>
      ) : (
        <Link
          href="/dashboard/parent"
          className="hidden sm:inline-flex text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          家长后台
        </Link>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-2">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
            {initial}
          </div>
        )}
        <span className="hidden sm:inline text-sm font-medium text-gray-700">{name}</span>
      </div>

      {/* Settings */}
      <Link
        href="/settings"
        className="hidden sm:inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        设置
      </Link>

      {/* Sign out */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        退出
      </button>
    </div>
  );
}
