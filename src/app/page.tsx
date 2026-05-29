import Link from "next/link";
import Image from "next/image";
import TutorCard from "@/components/TutorCard";
import HomeSearch from "@/components/HomeSearch";
import { MOCK_TESTIMONIALS, MOCK_SUBJECTS } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import type { Tutor } from "@/types";

export default async function HomePage() {
  const [tutorCount, subjectRows, acceptedCount, topProfiles] = await Promise.all([
    prisma.tutorProfile.count(),
    prisma.tutorSubject.findMany({ distinct: ["subjectName"], select: { subjectName: true } }),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.tutorProfile.findMany({
      orderBy: { rating: "desc" },
      take: 3,
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        subjects: { select: { subjectName: true } },
        tags: { select: { tag: true } },
      },
    }),
  ]);

  const featuredTutors: Tutor[] = topProfiles.map((p) => ({
    id: p.id,
    name: p.user.name,
    avatar: p.user.avatarUrl ?? "",
    university: p.university,
    major: p.major,
    grade: p.grade,
    hourlyRate: p.hourlyRate,
    rating: p.rating,
    reviewCount: p.reviewCount,
    bio: p.bio,
    available: p.available,
    subjects: p.subjects.map((s) => s.subjectName),
    tags: p.tags.map((t) => t.tag),
  }));

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-purple-400/20 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-6">
              🎓 已服务 10,000+ 学生
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              找到最适合你的<br />
              <span className="text-yellow-300">大学生家教</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-10 leading-relaxed">
              汇聚来自顶尖高校的优秀学生，提供数学、英语、编程等多学科辅导，
              按需预约，灵活上课。
            </p>

            {/* Search bar */}
            <HomeSearch />

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-10 text-sm">
              {[
                { label: "认证家教", value: tutorCount > 0 ? `${tutorCount}+` : "0" },
                { label: "覆盖学科", value: subjectRows.length > 0 ? `${subjectRows.length}+` : "0" },
                { label: "成功撮合", value: acceptedCount > 0 ? `${acceptedCount}+` : "0" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-yellow-300">{stat.value}</span>
                  <span className="text-indigo-200">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Subject Categories ── */}
      <section id="subjects" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">热门学科</h2>
            <p className="mt-3 text-gray-500">覆盖大学主要课程，总有一位老师适合你</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {MOCK_SUBJECTS.map((subject) => (
              <Link
                key={subject.id}
                href={`/tutors?subject=${subject.id}`}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-indigo-50 hover:border-indigo-200 border border-transparent transition-all group"
              >
                <span className="text-3xl">{subject.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{subject.name}</span>
                <span className="text-xs text-gray-400">{subject.tutorCount} 位老师</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Tutors ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">精选家教</h2>
              <p className="mt-2 text-gray-500">平台评分最高、口碑最好的老师</p>
            </div>
            <Link
              href="/tutors"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">三步开始学习</h2>
            <p className="mt-3 text-gray-500">简单快捷，几分钟内找到你的专属家教</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "搜索家教",
                desc: "按学科、价格、评分筛选，找到最适合你的老师。",
              },
              {
                step: "02",
                icon: "📅",
                title: "预约试听",
                desc: "免费试听一节课，满意再付款，零风险体验。",
              },
              {
                step: "03",
                icon: "🚀",
                title: "开始学习",
                desc: "线上视频或线下面授，灵活安排，随时随地学习。",
              },
            ].map((item) => (
              <div key={item.step} className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50">
                <span className="absolute top-4 right-4 text-5xl font-black text-gray-100 select-none">
                  {item.step}
                </span>
                <span className="text-4xl mb-4">{item.icon}</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">学生好评</h2>
            <p className="mt-3 text-gray-500">真实学生反馈，见证学习成果</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.studentName} width={36} height={36} className="rounded-full bg-indigo-50" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.studentName}</p>
                    <p className="text-xs text-gray-400">{t.subject}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">准备好提升成绩了吗？</h2>
          <p className="text-indigo-200 mb-8 text-lg">立即注册，免费试听第一节课</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tutors"
              className="px-8 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors"
            >
              浏览家教
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              成为家教
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
