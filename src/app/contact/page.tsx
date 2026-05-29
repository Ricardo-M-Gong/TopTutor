export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">联系我们</h1>
          <p className="text-gray-500 mb-10">有任何问题或建议，欢迎随时联系我们</p>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-indigo-50">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">邮件联系</h3>
                <p className="text-sm text-gray-500 mb-2">我们通常在 1–2 个工作日内回复</p>
                <a
                  href="mailto:gongyuhang72@gmail.com"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  gongyuhang72@gmail.com
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="flex items-start gap-4 p-5 rounded-xl bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">响应时间</h3>
                <p className="text-sm text-gray-500">工作日 9:00 – 18:00，通常 24 小时内回复</p>
              </div>
            </div>
          </div>

          {/* FAQ shortcut */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">常见问题</h2>
            <div className="space-y-4">
              {[
                {
                  q: "如何成为平台认证家教？",
                  a: "注册教员账号后，在控制台完善个人资料（学校、专业、擅长科目等），提交后即可在平台展示。",
                },
                {
                  q: "预约流程是怎样的？",
                  a: "家长在教员详情页点击「预约」，填写需求后提交。教员收到通知后可接受或拒绝，双方确认后自行约定上课时间。",
                },
                {
                  q: "如何发布家教需求？",
                  a: "登录家长账号后，进入「控制台」点击「发布新需求」，填写学科、年级、预算等信息即可。",
                },
                {
                  q: "平台收费吗？",
                  a: "平台目前对家长和家教均免费开放，家教与学生之间的费用由双方自行协商。",
                },
              ].map((item) => (
                <div key={item.q} className="border border-gray-100 rounded-xl p-4">
                  <p className="font-medium text-gray-900 mb-1">{item.q}</p>
                  <p className="text-sm text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
