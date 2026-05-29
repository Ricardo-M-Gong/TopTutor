export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">隐私政策</h1>
          <p className="text-sm text-gray-400 mb-10">最后更新：2026 年 1 月 1 日</p>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. 信息收集</h2>
              <p className="mb-3">我们收集以下类型的信息：</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>账号信息：</strong>注册时提供的姓名、邮箱地址和密码（加密存储）</li>
                <li><strong>个人资料：</strong>家教填写的学校、专业、年级、擅长科目等信息</li>
                <li><strong>使用数据：</strong>你在平台上的操作记录，用于改善服务体验</li>
                <li><strong>通信内容：</strong>你通过平台发送的预约申请和消息</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. 信息使用</h2>
              <p className="mb-3">我们使用收集的信息用于：</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>提供、维护和改善平台服务</li>
                <li>处理预约请求，促成家教与学生的匹配</li>
                <li>发送服务通知和重要更新</li>
                <li>防止欺诈和保障平台安全</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. 信息共享</h2>
              <p className="mb-3">我们不会出售你的个人信息。以下情况下我们可能共享信息：</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>平台内部：</strong>家教的公开资料（姓名、学校、科目等）对所有用户可见</li>
                <li><strong>法律要求：</strong>在法律法规要求的情况下配合相关部门</li>
                <li><strong>服务提供商：</strong>与帮助我们运营平台的第三方服务商共享必要信息</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. 数据安全</h2>
              <p>
                我们采用行业标准的安全措施保护你的个人信息，包括数据加密传输（HTTPS）、
                密码哈希存储等。但请注意，没有任何互联网传输方式是 100% 安全的。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. 你的权利</h2>
              <p className="mb-3">你有权：</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>访问和更正你的个人信息</li>
                <li>删除你的账号和相关数据</li>
                <li>撤回对数据处理的同意</li>
              </ul>
              <p className="mt-3">如需行使上述权利，请联系我们：<a href="mailto:gongyuhang72@gmail.com" className="text-indigo-600 hover:underline">gongyuhang72@gmail.com</a></p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Cookie</h2>
              <p>
                我们使用 Cookie 和类似技术来维持你的登录状态和改善用户体验。
                你可以通过浏览器设置管理 Cookie，但禁用 Cookie 可能影响部分功能的正常使用。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. 政策更新</h2>
              <p>
                我们可能不定期更新本隐私政策。重大变更时，我们会通过邮件或平台通知告知你。
                继续使用平台即表示你接受更新后的政策。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. 联系我们</h2>
              <p>
                如有任何隐私相关问题，请发送邮件至：
                <a href="mailto:gongyuhang72@gmail.com" className="text-indigo-600 hover:underline ml-1">gongyuhang72@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
