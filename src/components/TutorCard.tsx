import Image from "next/image";
import Link from "next/link";
import type { Tutor } from "@/types";

interface TutorCardProps {
  tutor: Tutor;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all p-5 flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <Image
            src={tutor.avatar}
            alt={tutor.name}
            width={56}
            height={56}
            className="rounded-full bg-indigo-50"
          />
          {tutor.available && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{tutor.name}</h3>
            <span className="shrink-0 text-sm font-semibold text-indigo-600">
              ¥{tutor.hourlyRate}<span className="text-xs font-normal text-gray-400">/时</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">{tutor.university} · {tutor.major}</p>
          <p className="text-xs text-gray-400">{tutor.grade}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-3.5 h-3.5 ${i < Math.round(tutor.rating) ? "text-amber-400" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="text-sm font-medium text-gray-700">{tutor.rating.toFixed(1)}</span>
        <span className="text-xs text-gray-400">({tutor.reviewCount} 条评价)</span>
      </div>

      {/* Subjects */}
      <div className="flex flex-wrap gap-1.5">
        {tutor.subjects.map((subject) => (
          <span
            key={subject}
            className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{tutor.bio}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {tutor.tags.map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded bg-gray-50 text-gray-500 text-xs">
            #{tag}
          </span>
        ))}
      </div>

      {/* CTA row */}
      <div className="mt-auto pt-1 flex items-center justify-between text-sm">
        <span className={`text-xs font-medium ${tutor.available ? "text-green-600" : "text-gray-400"}`}>
          {tutor.available ? "● 可预约" : "● 暂不接单"}
        </span>
        <span className="text-indigo-600 font-medium group-hover:underline">查看详情 →</span>
      </div>
    </Link>
  );
}
