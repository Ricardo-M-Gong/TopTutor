import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApplicationActions from "@/components/ApplicationActions";
import ToggleRequirementButton from "@/components/ToggleRequirementButton";
import ReviewForm from "@/components/ReviewForm";

const GRADE_LABEL: Record<string, string> = {
  PRIMARY: "小学", MIDDLE: "初中", HIGH: "高中",
  UNDERGRADUATE: "大学本科", GRADUATE: "研究生", OTHER: "其他",
};

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  PENDING:  { text: "待处理", cls: "bg-amber-50 text-amber-700" },
  ACCEPTED: { text: "已接受", cls: "bg-green-50 text-green-700" },
  REJECTED: { text: "已拒绝", cls: "bg-gray-100 text-gray-500" },
};

export default async function ParentDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "PARENT" && session.user.role !== "STUDENT")) {
    redirect("/login");
  }

  const requirements = await prisma.requirement.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // TUTOR_APPLY: parent is receiver
  const receivedApplications = await prisma.application.findMany({
    where: { receiverUserId: session.user.id, type: "TUTOR_APPLY" },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { name: true, phone: true } },
      tutorProfile: { select: { id: true, university: true, major: true, hourlyRate: true } },
      requirement: { select: { subjectName: true, gradeLevel: true } },
      review: { select: { id: true } },
    },
  });

  // PARENT_BOOK: parent is sender
  const sentBookings = await prisma.application.findMany({
    where: { senderUserId: session.user.id, type: "PARENT_BOOK" },
    orderBy: { createdAt: "desc" },
    include: {
      receiver: { select: { name: true, phone: true } },
      tutorProfile: { select: { id: true, university: true, major: true, hourlyRate: true } },
      review: { select: { id: true } },
    },
  });

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">家长控制台</h1>
            <p className="mt-1 text-sm text-gray-500">欢迎回来，{session.user.name}。</p>
          </div>
          <Link
            href="/dashboard/parent/post"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            <span>+</span> 发布新需求
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "活跃需求", value: requirements.filter((r) => r.isActive).length, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "待处理申请", value: receivedApplications.filter((a) => a.status === "PENDING").length, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "已接受", value: receivedApplications.filter((a) => a.status === "ACCEPTED").length + sentBookings.filter((a) => a.status === "ACCEPTED").length, color: "text-green-600", bg: "bg-green-50" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* My requirements */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">我发布的需求</h2>
          {requirements.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm mb-4">你还没有发布任何家教需求</p>
              <Link href="/dashboard/parent/post" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                立即发布需求
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map((req) => (
                <div key={req.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium">{req.subjectName}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">{GRADE_LABEL[req.gradeLevel] ?? req.gradeLevel}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${req.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {req.isActive ? "招募中" : "已关闭"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">{req.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                        {(req.budgetMin || req.budgetMax) && (
                          <span>预算：{req.budgetMin && req.budgetMax ? `¥${req.budgetMin}–${req.budgetMax}/时` : req.budgetMin ? `¥${req.budgetMin}+/时` : `最高 ¥${req.budgetMax}/时`}</span>
                        )}
                        {req.scheduleNote && <span>{req.scheduleNote}</span>}
                        <span>{new Date(req.createdAt).toLocaleDateString("zh-CN")}</span>
                      </div>
                    </div>
                    <ToggleRequirementButton requirementId={req.id} isActive={req.isActive} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Received tutor applications (TUTOR_APPLY) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">教员接单申请</h2>
          <p className="text-xs text-gray-400 mb-4">教员主动申请你发布的需求</p>
          {receivedApplications.length === 0 ? (
            <p className="text-sm text-gray-400">暂无教员申请，发布需求后等待教员联系你</p>
          ) : (
            <div className="space-y-4">
              {receivedApplications.map((app) => {
                const s = STATUS_LABEL[app.status] ?? STATUS_LABEL.PENDING;
                return (
                  <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-sm font-medium text-gray-900">{app.sender.name}</span>
                          <span className="text-xs text-gray-500">{app.tutorProfile.university} · ¥{app.tutorProfile.hourlyRate}/时</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span>
                        </div>
                        {app.requirement && (
                          <p className="text-xs text-gray-500 mb-1">
                            申请需求：{app.requirement.subjectName} · {GRADE_LABEL[app.requirement.gradeLevel] ?? app.requirement.gradeLevel}
                          </p>
                        )}
                        {app.message && <p className="text-sm text-gray-600 mt-1">{app.message}</p>}
                        {/* Contact info after acceptance */}
                        {app.status === "ACCEPTED" && (
                          <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100 text-xs">
                            <p className="font-medium text-green-800 mb-1">🎉 已接受！请与教员联系</p>
                            {app.sender.phone ? (
                              <p className="text-green-700">手机号：<span className="font-mono font-semibold">{app.sender.phone}</span></p>
                            ) : (
                              <p className="text-gray-500">对方暂未填写联系方式，请通过平台消息联系</p>
                            )}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{new Date(app.createdAt).toLocaleDateString("zh-CN")}</p>
                        {/* Review form for accepted apps */}
                        {app.status === "ACCEPTED" && !app.review && (
                          <ReviewForm
                            applicationId={app.id}
                            tutorProfileId={app.tutorProfile.id}
                            tutorName={app.sender.name}
                          />
                        )}
                        {app.status === "ACCEPTED" && app.review && (
                          <p className="mt-2 text-xs text-gray-400">✓ 已评价</p>
                        )}
                      </div>
                      {app.status === "PENDING" && <ApplicationActions applicationId={app.id} />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sent bookings (PARENT_BOOK) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">我发起的预约</h2>
          <p className="text-xs text-gray-400 mb-4">你主动向教员发起的预约请求</p>
          {sentBookings.length === 0 ? (
            <p className="text-sm text-gray-400">
              你还没有预约过任何教员。前往{" "}
              <Link href="/tutors" className="text-indigo-600 hover:underline">找家教</Link>{" "}
              浏览教员。
            </p>
          ) : (
            <div className="space-y-3">
              {sentBookings.map((app) => {
                const s = STATUS_LABEL[app.status] ?? STATUS_LABEL.PENDING;
                return (
                  <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-medium text-gray-900">{app.receiver.name}</span>
                      <span className="text-xs text-gray-500">{app.tutorProfile.university} · ¥{app.tutorProfile.hourlyRate}/时</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>{s.text}</span>
                    </div>
                    {app.message && <p className="text-sm text-gray-600">{app.message}</p>}
                    {/* Contact info after acceptance */}
                    {app.status === "ACCEPTED" && (
                      <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100 text-xs">
                        <p className="font-medium text-green-800 mb-1">🎉 已接受！请与教员联系</p>
                        {app.receiver.phone ? (
                          <p className="text-green-700">手机号：<span className="font-mono font-semibold">{app.receiver.phone}</span></p>
                        ) : (
                          <p className="text-gray-500">对方暂未填写联系方式，请通过平台消息联系</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{new Date(app.createdAt).toLocaleDateString("zh-CN")}</p>
                    {/* Review form */}
                    {app.status === "ACCEPTED" && !app.review && (
                      <ReviewForm
                        applicationId={app.id}
                        tutorProfileId={app.tutorProfile.id}
                        tutorName={app.receiver.name}
                      />
                    )}
                    {app.status === "ACCEPTED" && app.review && (
                      <p className="mt-2 text-xs text-gray-400">✓ 已评价</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
