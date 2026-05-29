import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPage() {
  const [userCount, tutorCount, requirementCount, applicationCount, pendingBookings, pendingApply, acceptedCount, reviewCount, reviewAgg] =
    await Promise.all([
      prisma.user.count(),
      prisma.tutorProfile.count(),
      prisma.requirement.count(),
      prisma.application.count(),
      prisma.application.count({ where: { type: "PARENT_BOOK", status: "PENDING" } }),
      prisma.application.count({ where: { type: "TUTOR_APPLY", status: "PENDING" } }),
      prisma.application.count({ where: { status: "ACCEPTED" } }),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const stats = [
    { label: "总用户数", value: userCount, icon: "👥", href: "/admin/users" },
    { label: "教员资料", value: tutorCount, icon: "🎓", href: "/admin/tutors" },
    { label: "发布需求", value: requirementCount, icon: "📋", href: "/admin/requirements" },
    { label: "总申请数", value: applicationCount, icon: "📅", href: "/admin/applications" },
    { label: "成功撮合", value: acceptedCount, icon: "🤝", href: "/admin/applications" },
    { label: "累计评价", value: reviewCount, icon: "⭐", href: "/admin/applications" },
    {
      label: "平均评分",
      value: reviewAgg._avg.rating ? reviewAgg._avg.rating.toFixed(1) : "–",
      icon: "📊",
      href: "/admin/applications",
    },
  ];

  const ROLE_LABEL: Record<string, string> = {
    TUTOR: "教员", PARENT: "家长", STUDENT: "学员", ADMIN: "管理员",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">管理概览</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Pending alerts */}
      {(pendingBookings > 0 || pendingApply > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex flex-wrap gap-4">
          <span className="text-sm font-medium text-amber-800">待处理：</span>
          {pendingBookings > 0 && (
            <Link href="/admin/applications" className="text-sm text-amber-700 hover:underline">
              {pendingBookings} 条待回复预约
            </Link>
          )}
          {pendingApply > 0 && (
            <Link href="/admin/applications" className="text-sm text-amber-700 hover:underline">
              {pendingApply} 条待回复申请
            </Link>
          )}
        </div>
      )}

      {/* Recent users */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">最新注册用户</h2>
          <Link href="/admin/users" className="text-sm text-indigo-600 hover:underline">查看全部</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3">姓名</th>
              <th className="text-left px-6 py-3">邮箱</th>
              <th className="text-left px-6 py-3">身份</th>
              <th className="text-left px-6 py-3">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentUsers.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-3 text-gray-500">{u.email}</td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
