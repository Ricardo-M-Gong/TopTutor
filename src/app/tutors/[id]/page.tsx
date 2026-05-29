import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const [profile, reviews] = await Promise.all([
    prisma.tutorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        subjects: { select: { subjectName: true } },
        tags: { select: { tag: true } },
      },
    }),
    prisma.review.findMany({
      where: { tutorProfileId: id },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
  ]);

  if (!profile) notFound();

  const isParent =
    session?.user?.role === "PARENT" || session?.user?.role === "STUDENT";
  const isSelf = session?.user?.id === profile.user.id;

  // Check if parent already has a pending booking for this tutor
  let alreadyBooked = false;
  if (isParent && session?.user?.id) {
    const existing = await prisma.application.findFirst({
      where: {
        type: "PARENT_BOOK",
        senderUserId: session.user.id,
        tutorProfileId: id,
        status: "PENDING",
      },
    });
    alreadyBooked = !!existing;
  }

  const avatarSrc = profile.user.avatarUrl || "";

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/tutors"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5"
        >
          ← 返回教员列表
        </Link>
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          {/* Header */}
          <div className="flex items-start gap-5 mb-6">
            <div className="relative shrink-0">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={profile.user.name}
                  width={72}
                  height={72}
                  className="rounded-full bg-indigo-50"
                />
              ) : (
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile.user.name.charAt(0)}
                </div>
              )}
              {profile.available && (
                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.user.name}</h1>
                  <p className="text-gray-500 mt-0.5">
                    {profile.university} · {profile.major} · {profile.grade}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-indigo-600">
                    ¥{profile.hourlyRate}
                    <span className="text-sm font-normal text-gray-400">/时</span>
                  </p>
                  {profile.rating > 0 && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      ⭐ {profile.rating.toFixed(1)} ({profile.reviewCount} 条评价)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subjects */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-gray-700 mb-2">擅长科目</h2>
            <div className="flex flex-wrap gap-2">
              {profile.subjects.map((s) => (
                <span
                  key={s.subjectName}
                  className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium"
                >
                  {s.subjectName}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {profile.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {profile.tags.map((t) => (
                  <span key={t.tag} className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-xs">
                    #{t.tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          <div className="mb-6">
            <h2 className="text-sm font-medium text-gray-700 mb-2">自我介绍</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{profile.bio}</p>
          </div>

          {/* Book action */}
          <div className="border-t border-gray-100 pt-5">
            {isSelf ? (
              <p className="text-sm text-gray-400">这是你自己的主页</p>
            ) : isParent ? (
              alreadyBooked ? (
                <span className="inline-flex items-center px-5 py-2.5 rounded-xl bg-gray-100 text-gray-500 text-sm font-medium">
                  预约已发送，等待教员回复
                </span>
              ) : (
                <BookButton tutorProfileId={id} tutorName={profile.user.name} />
              )
            ) : !session ? (
              <a
                href="/login"
                className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                登录后预约
              </a>
            ) : null}
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            学生评价
            {reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({reviews.length} 条)</span>
            )}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-sm text-gray-400">暂无评价</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < review.rating ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{review.author.name}</span>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("zh-CN")}</span>
                  </div>
                  {review.content && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.content}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
