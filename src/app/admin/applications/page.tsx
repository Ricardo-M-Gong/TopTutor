import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  PENDING:  { text: "待处理", cls: "bg-amber-50 text-amber-700" },
  ACCEPTED: { text: "已接受", cls: "bg-green-50 text-green-700" },
  REJECTED: { text: "已拒绝", cls: "bg-gray-100 text-gray-500" },
};

const TYPE_LABEL: Record<string, string> = {
  TUTOR_APPLY: "教员申请需求",
  PARENT_BOOK: "家长预约教员",
};

export default async function AdminApplicationsPage() {
  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { name: true, email: true } },
      receiver: { select: { name: true, email: true } },
      tutorProfile: { select: { university: true, hourlyRate: true } },
      requirement: { select: { subjectName: true } },
    },
  });

  const pending = applications.filter((a) => a.status === "PENDING").length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">预约 / 申请管理</h1>
        <span className="text-sm text-gray-500">共 {applications.length} 条记录</span>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "待处理", value: pending, cls: "bg-amber-50 text-amber-700" },
          { label: "已接受", value: accepted, cls: "bg-green-50 text-green-700" },
          { label: "已拒绝", value: rejected, cls: "bg-gray-100 text-gray-600" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.cls}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3">类型</th>
              <th className="text-left px-6 py-3">发起方</th>
              <th className="text-left px-6 py-3">接收方</th>
              <th className="text-left px-6 py-3">相关信息</th>
              <th className="text-left px-6 py-3">状态</th>
              <th className="text-left px-6 py-3">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {applications.map((a) => {
              const s = STATUS_LABEL[a.status] ?? STATUS_LABEL.PENDING;
              return (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className="text-xs text-gray-500">{TYPE_LABEL[a.type]}</span>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{a.sender.name}</p>
                    <p className="text-xs text-gray-400">{a.sender.email}</p>
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{a.receiver.name}</p>
                    <p className="text-xs text-gray-400">{a.receiver.email}</p>
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs">
                    {a.tutorProfile.university} · ¥{a.tutorProfile.hourlyRate}/时
                    {a.requirement && <><br />{a.requirement.subjectName}</>}
                    {a.message && <p className="text-gray-400 mt-0.5 line-clamp-1">{a.message}</p>}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
                      {s.text}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
