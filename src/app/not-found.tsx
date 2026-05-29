import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-black text-indigo-100 select-none leading-none">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">页面不存在</h1>
        <p className="text-gray-500 mb-8 text-sm">你访问的页面已被删除或从未存在过</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            返回首页
          </Link>
          <Link
            href="/tutors"
            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            浏览家教
          </Link>
        </div>
      </div>
    </div>
  );
}
