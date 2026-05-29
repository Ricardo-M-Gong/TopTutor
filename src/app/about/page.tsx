export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">关于 TopTutor</h1>
          <p className="text-gray-500 mb-10">连接优秀大学生家教与求学者</p>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">我们的使命</h2>
            <p className="text-gray-600 leading-relaxed">
              TopTutor 致力于打破优质教育资源的壁垒，让每一位有学习需求的学生都能找到适合自己的辅导老师。
              我们汇聚来自全国顶尖高校的优秀大学生，为中小学生及大学生提供专业、高效、灵活的一对一辅导服务。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">我们的故事</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              TopTutor 由一群热爱教育的大学生创立。我们深知找到一位真正合适的家教有多难——
              信息不透明、价格不统一、质量参差不齐。
            </p>
            <p className="text-gray-600 leading-relaxed">
              因此，我们搭建了这个平台：让家教信息公开透明，让预约流程简单高效，
              让每一次辅导都能真正帮助到学生。
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">平台数据</h2>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: "500+", label: "认证家教" },
                { value: "30+", label: "覆盖学科" },
                { value: "98%", label: "好评率" },
              ].map((stat) => (
                <div key={stat.label} className="bg-indigo-50 rounded-xl p-5">
                  <p className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">我们的承诺</h2>
            <ul className="space-y-3">
              {[
                "所有家教均经过实名认证，学历背景真实可查",
                "透明定价，无隐藏费用",
                "支持免费试听，满意再付款",
                "7×24 小时客服支持，保障每一位用户的权益",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 text-xs font-bold">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
