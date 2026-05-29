import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminTutorsPage() {
  const tutors = await prisma.tutorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      subjects: { select: { subjectName: true } },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">教员管理</h1>
        <span className="text-sm text-gray-500">共 {tutors.length} 位教员</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="text-left px-6 py-3">姓名</th>
              <th className="text-left px-6 py-3">学校 / 专业</th>
              <th className="text-left px-6 py-3">科目</th>
              <th className="text-left px-6 py-3">时薪</th>
              <th className="text-left px-6 py-3">评分</th>
              <th className="text-left px-6 py-3">状态</th>
              <th className="text-left px-6 py-3">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tutors.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <p className="font-medium text-gray-900">{t.user.name}</p>
                  <p className="text-xs text-gray-400">{t.user.email}</p>
                </td>
                <td className="px-6 py-3 text-gray-600">
                  {t.university}<br />
                  <span className="text-xs text-gray-400">{t.major} · {t.grade}</span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex flex-wrap gap-1">
                    {t.subjects.slice(0, 3).map((s) => (
                      <span key={s.subjectName} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs">
                        {s.subjectName}
                      </span>
                    ))}
                    {t.subjects.length > 3 && (
                      <span className="text-xs text-gray-400">+{t.subjects.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-gray-700">¥{t.hourlyRate}/时</td>
                <td className="px-6 py-3 text-gray-700">
                  {t.rating > 0 ? `⭐ ${t.rating.toFixed(1)}` : "暂无"}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    t.available ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {t.available ? "可预约" : "不可预约"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <Link
                    href={`/tutors/${t.id}`}
                    target="_blank"
                    className="text-indigo-600 hover:underline text-xs"
                  >
                    查看主页
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
