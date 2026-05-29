import { prisma } from "@/lib/prisma";
import AdminToggleRequirement from "@/components/admin/AdminToggleRequirement";

const GRADE_LABEL: Record<string, string> = {
  PRIMARY: "小学", MIDDLE: "初中", HIGH: "高中",
  UNDERGRADUATE: "大学本科", GRADUATE: "研究生", OTHER: "其他",
};

export default async function AdminRequirementsPage() {
  const requirements = await prisma.requirement.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { applications: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">需求管理</h1>
        <span className="text-sm text-gray-500">共 {requirements.length} 条需求</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3">发布者</th>
              <th className="text-left px-6 py-3">学科 / 年级</th>
              <th className="text-left px-6 py-3">预算</th>
              <th className="text-left px-6 py-3">申请数</th>
              <th className="text-left px-6 py-3">状态</th>
              <th className="text-left px-6 py-3">发布时间</th>
              <th className="text-left px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {requirements.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <p className="font-medium text-gray-900">{r.user.name}</p>
                  <p className="text-xs text-gray-400">{r.user.email}</p>
                </td>
                <td className="px-6 py-3">
                  <p className="text-gray-900">{r.subjectName}</p>
                  <p className="text-xs text-gray-400">{GRADE_LABEL[r.gradeLevel] ?? r.gradeLevel}</p>
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {r.budgetMin || r.budgetMax
                    ? r.budgetMin && r.budgetMax
                      ? `¥${r.budgetMin}–${r.budgetMax}`
                      : r.budgetMin ? `¥${r.budgetMin}+` : `≤¥${r.budgetMax}`
                    : "未填写"}
                </td>
                <td className="px-6 py-3 text-gray-700">{r._count.applications}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    r.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {r.isActive ? "招募中" : "已关闭"}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("zh-CN")}
                </td>
                <td className="px-6 py-3">
                  <AdminToggleRequirement requirementId={r.id} isActive={r.isActive} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
