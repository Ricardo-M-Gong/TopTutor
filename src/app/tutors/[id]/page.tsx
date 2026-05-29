import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookButton from "@/components/BookButton";
import ReviewForm from "@/components/ReviewForm";

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const profile = await prisma.tutorProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, avatarUrl: true } },
      subjects: { select: { subjectName: true } },
      tags: { select: { tag: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, avatarUrl: true } } },
      },
    },
  });

  if (!profile) notFound();

  const isParent = session?.user?.role === "PARENT" || session?.user?.role === "STUDENT";
  const isSelf = session?.user?.id === profile.user.id;

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

  // Check if current user already reviewed
  const myReview = session?.user?.id
    ? profile.reviews.find((r) => r.authorId === session.user.id)
    : null;

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
                <div className="w-[72px] h-[72px] rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            学生评价
            {profile.reviewCount > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-400">({profile.reviewCount} 条)</span>
            )}
          </h2>

          {profile.reviews.length === 0 ? (
            <p className="text-sm text-gray-400">暂无评价</p>
          ) : (
            <div className="space-y-4 mb-6">
              {profile.reviews.map((r) => (
                <div key={r.id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold shrink-0">
                      {r.author.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{r.author.name}</p>
                      <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("zh-CN")}</p>
                    </div>
                    <div className="flex text-amber-400 text-sm shrink-0">
                      {"★".repeat(r.rating)}
                      <span className="text-gray-200">{"★".repeat(5 - r.rating)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Write review — only for parents/students who are not the tutor */}
          {!isSelf && isParent && (
            <div className="border-t border-gray-100 pt-5">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                {myReview ? "修改你的评价" : "写评价"}
              </h3>
              <ReviewForm
                tutorProfileId={id}
                existingRating={myReview?.rating}
                existingContent={myReview?.content}
              />
            </div>
          )}

          {!session && (
            <div className="border-t border-gray-100 pt-5">
              <p className="text-sm text-gray-400">
                <a href="/login" className="text-indigo-600 hover:underline">登录</a> 后可以写评价
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
