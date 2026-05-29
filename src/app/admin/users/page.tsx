import { prisma } from "@/lib/prisma";
import AdminUserActions from "@/components/admin/AdminUserActions";

const ROLE_LABEL: Record<string, string> = {
  TUTOR: "教员", PARENT: "家长", STUDENT: "学员", ADMIN: "管理员",
};

const ROLE_COLOR: Record<string, string> = {
  TUTOR: "bg-indigo-50 text-indigo-700",
  PARENT: "bg-green-50 text-green-700",
  STUDENT: "bg-blue-50 text-blue-700",
  ADMIN: "bg-red-50 text-red-700",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { tutorProfile: { select: { id: true } } },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">用户管理</h1>
        <span className="text-sm text-gray-500">共 {users.length} 位用户</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3">姓名</th>
              <th className="text-left px-6 py-3">邮箱</th>
              <th className="text-left px-6 py-3">身份</th>
              <th className="text-left px-6 py-3">注册时间</th>
              <th className="text-left px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-3 text-gray-500">{u.email}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLOR[u.role] ?? "bg-gray-100 text-gray-600"}`}>
                    {ROLE_LABEL[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400">
                  {new Date(u.createdAt).toLocaleDateString("zh-CN")}
                </td>
                <td className="px-6 py-3">
                  <AdminUserActions userId={u.id} currentRole={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
