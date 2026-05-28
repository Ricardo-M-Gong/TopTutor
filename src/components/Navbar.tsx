import Link from "next/link";
import { auth } from "@/auth";
import NavbarUserMenu from "@/components/NavbarUserMenu";
import { Role } from "@/generated/prisma/client";

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-indigo-600">TopTutor</span>
            <span className="hidden sm:inline text-sm text-gray-400 font-medium">大学生家教平台</span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/tutors" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              找家教
            </Link>
            <Link href="/requirements" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              需求大厅
            </Link>
            <Link href="/#subjects" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              学科分类
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              如何使用
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <NavbarUserMenu
                name={user.name ?? "用户"}
                image={user.image}
                role={user.role as Role}
              />
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  免费注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
