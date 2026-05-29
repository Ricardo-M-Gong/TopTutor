import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "概览", icon: "📊" },
  { href: "/admin/users", label: "用户管理", icon: "👥" },
  { href: "/admin/tutors", label: "教员审核", icon: "🎓" },
  { href: "/admin/requirements", label: "需求管理", icon: "📋" },
  { href: "/admin/applications", label: "预约管理", icon: "📅" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session?.user as any)?.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 text-gray-300 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-800">
          <span className="text-white font-bold text-lg">TopTutor</span>
          <span className="ml-2 text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded font-medium">Admin</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-gray-800 hover:text-white transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-5 py-4 border-t border-gray-800 text-xs text-gray-500">
          {session?.user?.name}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 overflow-auto">
        {children}
      </div>
    </div>
  );
}
