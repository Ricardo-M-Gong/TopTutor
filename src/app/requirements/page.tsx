import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/ApplyButton";

const GRADE_LABEL: Record<string, string> = {
  PRIMARY: "小学",
  MIDDLE: "初中",
  HIGH: "高中",
  UNDERGRADUATE: "大学本科",
  GRADUATE: "研究生",
  OTHER: "其他",
};

export default async function RequirementsPage() {
  const session = await auth();
  const isTutor = session?.user?.role === "TUTOR";

  // Get tutor's own profile id if logged in as tutor
  let myProfileId: string | null = null;
  if (isTutor && session?.user?.id) {
    const profile = await prisma.tutorProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true },
    });
    myProfileId = profile?.id ?? null;
  }

  const requirements = await prisma.requirement.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      // Only include non-private info
      user: { select: { name: true } },
    },
  });

  // If tutor, fetch their existing pending applications to show "已申请" state
  const appliedRequirementIds = new Set<string>();
  if (isTutor && session?.user?.id) {
    const existing = await prisma.application.findMany({
      where: {
        senderUserId: session.user.id,
        type: "TUTOR_APPLY",
        status: "PENDING",
      },
      select: { requirementId: true },
    });
    existing.forEach((a) => {
      if (a.requirementId) appliedRequirementIds.add(a.requirementId);
    });
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">需求大厅</h1>
          <p className="mt-2 text-gray-500">
            共 <span className="font-semibold text-indigo-600">{requirements.length}</span> 条招募中的家教需求
            {isTutor && !myProfileId && (
              <span className="ml-3 text-amber-600 text-sm">
                提示：请先完善你的教员资料，才能申请接单
              </span>
            )}
          </p>
        </div>

        {requirements.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400">暂无需求，请稍后再来</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Tags row */}
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                        {req.subjectName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                        {GRADE_LABEL[req.gradeLevel] ?? req.gradeLevel}
                      </span>
                      {(req.budgetMin || req.budgetMax) && (
                        <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                          {req.budgetMin && req.budgetMax
                            ? `¥${req.budgetMin}–${req.budgetMax}/时`
                            : req.budgetMin
                            ? `¥${req.budgetMin}+/时`
                            : `最高 ¥${req.budgetMax}/时`}
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                      {req.description}
                    </p>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      {req.scheduleNote && <span>上课安排：{req.scheduleNote}</span>}
                      <span>发布于 {new Date(req.createdAt).toLocaleDateString("zh-CN")}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isTutor ? (
                      myProfileId ? (
                        appliedRequirementIds.has(req.id) ? (
                          <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium">
                            已申请
                          </span>
                        ) : (
                          <ApplyButton
                            tutorProfileId={myProfileId}
                            requirementId={req.id}
                          />
                        )
                      ) : (
                        <span className="text-xs text-gray-400">完善资料后可申请</span>
                      )
                    ) : !session ? (
                      <a
                        href="/login"
                        className="inline-flex items-center px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors"
                      >
                        登录后申请
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
