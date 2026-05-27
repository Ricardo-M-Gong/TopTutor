import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import TutorProfileForm from "@/components/TutorProfileForm";
import ApplicationActions from "@/components/ApplicationActions";

const STATUS_LABEL: Record<string, { text: string; cls: string }> = {
  PENDING:  { text: "待处理", cls: "bg-amber-50 text-amber-700" },
  ACCEPTED: { text: "已接受", cls: "bg-green-50 text-green-700" },
  REJECTED: { text: "已拒绝", cls: "bg-gray-100 text-gray-500" },
};

export default async function TutorDashboardPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "TUTOR") {
    redirect("/login");
  }

  const profile = await prisma.tutorProfile.findUnique({
    where: { userId: session.user.id },
    include: { subjects: true },
  });

  const initialData = profile
    ? {
        university: profile.university,
        major: profile.major,
        grade: profile.grade,
        subjects: profile.subjects.map((s) => s.subjectName),
        hourlyRate: profile.hourlyRate,
        bio: profile.bio,
      }
    : null;

  // Fetch all applications where this tutor is the receiver
  const receivedApplications = profile
    ? await prisma.application.findMany({
        where: { receiverUserId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          sender: { select: { name: true } },
          requirement: {
            select: { subjectName: true, gradeLevel: true, description: true },
          },
        },
      })
    : [];

  // Fetch applications this tutor sent (TUTOR_APPLY)
  const sentApplications = profile
    ? await prisma.application.findMany({
        where: {
          senderUserId: session.user.id,
          type: "TUTOR_APPLY",
        },
        orderBy: { createdAt: "desc" },
        include: {
          requirement: {
            select: { subjectName: true, gradeLevel: true, description: true },
          },
          receiver: { select: { name: true } },
        },
      })
    : [];

  const GRADE_LABEL: Record<string, string> = {
    PRIMARY: "小学", MIDDLE: "初中", HIGH: "高中",
    UNDERGRADUATE: "大学本科", GRADUATE: "研究生", OTHER: "其他",
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">教员控制台</h1>
          <p className="mt-1 text-sm text-gray-500">
            欢迎回来，{session.user.name}。
          </p>
        </div>

        {/* Profile form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            {profile ? "编辑个人资料" : "完善个人资料"}
          </h2>
          <TutorProfileForm initialData={initialData} />
        </div>

        {/* Received bookings (PARENT_BOOK) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">收到的预约</h2>
          {receivedApplications.length === 0 ? (
            <p className="text-sm text-gray-400">暂无家长向你发起预约</p>
          ) : (
            <div className="space-y-4">
              {receivedApplications.map((app) => {
                const s = STATUS_LABEL[app.status] ?? STATUS_LABEL.PENDING;
                return (
                  <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-medium text-gray-900">
                            {app.sender.name}
                          </span>
                          {app.type === "TUTOR_APPLY" ? (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                              接单申请
                            </span>
                          ) : (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">
                              家长预约
                            </span>
                          )}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>
                            {s.text}
                          </span>
                        </div>
                        {app.requirement && (
                          <p className="text-xs text-gray-500 mb-1">
                            需求：{app.requirement.subjectName} ·{" "}
                            {GRADE_LABEL[app.requirement.gradeLevel] ?? app.requirement.gradeLevel}
                          </p>
                        )}
                        {app.message && (
                          <p className="text-sm text-gray-600 mt-1">{app.message}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(app.createdAt).toLocaleDateString("zh-CN")}
                        </p>
                      </div>
                      {app.status === "PENDING" && (
                        <ApplicationActions applicationId={app.id} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sent applications (TUTOR_APPLY) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">我的接单申请</h2>
          {sentApplications.length === 0 ? (
            <p className="text-sm text-gray-400">
              你还没有申请过任何需求。前往{" "}
              <a href="/requirements" className="text-indigo-600 hover:underline">
                需求大厅
              </a>{" "}
              查看招募中的需求。
            </p>
          ) : (
            <div className="space-y-3">
              {sentApplications.map((app) => {
                const s = STATUS_LABEL[app.status] ?? STATUS_LABEL.PENDING;
                return (
                  <div key={app.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {app.requirement && (
                        <span className="text-sm font-medium text-gray-900">
                          {app.requirement.subjectName} ·{" "}
                          {GRADE_LABEL[app.requirement.gradeLevel] ?? app.requirement.gradeLevel}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${s.cls}`}>
                        {s.text}
                      </span>
                    </div>
                    {app.message && (
                      <p className="text-sm text-gray-600">{app.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      发给：{app.receiver.name} ·{" "}
                      {new Date(app.createdAt).toLocaleDateString("zh-CN")}
                    </p>
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
