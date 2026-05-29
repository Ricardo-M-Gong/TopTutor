import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ApplyButton from "@/components/ApplyButton";

const GRADE_LABEL: Record<string, string> = {
  PRIMARY: "小学", MIDDLE: "初中", HIGH: "高中",
  UNDERGRADUATE: "大学本科", GRADUATE: "研究生", OTHER: "其他",
};

export default async function RequirementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const req = await prisma.requirement.findUnique({
    where: { id },
    include: { user: { select: { id: true, name: true } } },
  });

  if (!req) notFound();
  // Non-owners can only see active requirements
  if (!req.isActive && req.user.id !== session?.user?.id) notFound();

  const isOwner = session?.user?.id === req.user.id;
  const isTutor = session?.user?.role === "TUTOR";

  let myProfileId: string | null = null;
  let alreadyApplied = false;

  if (isTutor && session?.user?.id) {
    const [profile, existing] = await Promise.all([
      prisma.tutorProfile.findUnique({
        where: { userId: session.user.id },
        select: { id: true },
      }),
      prisma.application.findFirst({
        where: { type: "TUTOR_APPLY", senderUserId: session.user.id, requirementId: id },
        select: { id: true },
      }),
    ]);
    myProfileId = profile?.id ?? null;
    alreadyApplied = !!existing;
  }

  const budget =
    req.budgetMin && req.budgetMax
      ? `¥${req.budgetMin}–${req.budgetMax}/时`
      : req.budgetMin
      ? `¥${req.budgetMin}+/时`
      : req.budgetMax
      ? `最高 ¥${req.budgetMax}/时`
      : null;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back */}
        <Link
          href="/requirements"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
        >
          ← 返回需求大厅
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
              {req.subjectName}
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
              {GRADE_LABEL[req.gradeLevel] ?? req.gradeLevel}
            </span>
            {budget && (
              <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-medium">
                {budget}
              </span>
            )}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                req.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
              }`}
            >
              {req.isActive ? "招募中" : "已关闭"}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-6">
            {req.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t border-gray-50 pt-4 mb-6">
            {req.scheduleNote && (
              <span>上课安排：{req.scheduleNote}</span>
            )}
            <span>发布者：{req.user.name}</span>
            <span>发布于 {new Date(req.createdAt).toLocaleDateString("zh-CN")}</span>
          </div>

          {/* Action */}
          {isOwner ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/parent"
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                管理需求
              </Link>
            </div>
          ) : isTutor ? (
            myProfileId ? (
              alreadyApplied ? (
                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium">
                  已申请
                </span>
              ) : req.isActive ? (
                <ApplyButton tutorProfileId={myProfileId} requirementId={id} />
              ) : (
                <span className="text-sm text-gray-400">该需求已关闭</span>
              )
            ) : (
              <Link
                href="/dashboard/tutor"
                className="inline-flex items-center px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition-colors"
              >
                完善资料后可申请
              </Link>
            )
          ) : !session ? (
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              登录后申请
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}
