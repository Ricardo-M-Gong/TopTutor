import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-bold text-white">TopTutor</span>
            <p className="mt-3 text-sm leading-6">
              连接优秀大学生家教与求学者，让学习更高效、更有趣。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">平台</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/tutors" className="hover:text-white transition-colors">找家教</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">成为家教</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">学科分类</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">支持</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">帮助中心</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">联系我们</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">常见问题</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">关于</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">隐私政策</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">服务条款</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-sm text-center">
          © 2025 TopTutor. 保留所有权利。
        </div>
      </div>
    </footer>
  );
}
