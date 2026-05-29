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
        className="hidden sm:inline-flex text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
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
