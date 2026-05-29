export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">服务条款</h1>
          <p className="text-sm text-gray-400 mb-10">最后更新：2026 年 1 月 1 日</p>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. 接受条款</h2>
              <p>
                欢迎使用 TopTutor 平台。访问或使用本平台即表示你同意受本服务条款的约束。
                如果你不同意这些条款，请勿使用本平台。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. 账号注册</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>注册时须提供真实、准确的个人信息</li>
                <li>你有责任保管好账号密码，不得将账号转让或共享给他人</li>
                <li>发现账号被盗用须立即通知我们</li>
                <li>每人只能注册一个账号</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. 家教用户规范</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>填写的学历、学校、专业等信息须真实有效</li>
                <li>不得发布虚假或夸大的教学能力描述</li>
                <li>接受预约后须按时履约，如需取消须提前告知</li>
                <li>不得在平台外私下收取额外费用或绕过平台交易</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. 学生/家长用户规范</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>发布的需求信息须真实，不得发布虚假需求</li>
                <li>预约后如需取消须提前通知家教</li>
                <li>不得骚扰、威胁或不当对待家教用户</li>
                <li>评价须基于真实体验，不得发布虚假评价</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. 禁止行为</h2>
              <p className="mb-3">使用本平台时，你不得：</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>发布违法、有害、骚扰性或侵权内容</li>
                <li>尝试未经授权访问平台系统或其他用户账号</li>
                <li>使用自动化工具批量抓取平台数据</li>
                <li>从事任何可能损害平台或其他用户利益的行为</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. 平台责任限制</h2>
              <p className="mb-3">
                TopTutor 作为信息撮合平台，不直接参与家教与学生之间的教学活动。
                对于以下情况，平台不承担责任：
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>家教与学生之间因教学质量产生的纠纷</li>
                <li>用户提供虚假信息导致的损失</li>
                <li>不可抗力因素导致的服务中断</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. 知识产权</h2>
              <p>
                平台上的所有内容（包括但不限于文字、图片、设计、代码）均受知识产权法保护，
                未经授权不得复制、传播或用于商业目的。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. 账号终止</h2>
              <p>
                我们保留在用户违反本条款时暂停或终止其账号的权利，
                且无需提前通知。用户也可随时申请注销账号。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">9. 条款变更</h2>
              <p>
                我们可能不定期修改本服务条款。继续使用平台即表示你接受修改后的条款。
                重大变更时我们会通过平台通知告知。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">10. 联系我们</h2>
              <p>
                如对本服务条款有任何疑问，请联系：
                <a href="mailto:gongyuhang72@gmail.com" className="text-indigo-600 hover:underline ml-1">gongyuhang72@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
