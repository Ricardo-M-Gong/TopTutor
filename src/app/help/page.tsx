export default function HelpPage() {
  const sections = [
    {
      title: "新手入门",
      items: [
        {
          q: "如何注册账号？",
          a: "点击右上角「免费注册」，选择身份（家长/学员 或 大学生教员），填写姓名、邮箱和密码即可完成注册。",
        },
        {
          q: "家长和教员有什么区别？",
          a: "家长/学员账号可以搜索家教、发布需求、预约教员；教员账号可以完善个人资料、接受预约、申请需求。",
        },
        {
          q: "注册后需要做什么？",
          a: "教员注册后请前往「控制台」完善个人资料，包括学校、专业、擅长科目等，完善后才能被家长搜索到。家长注册后可直接搜索家教或发布需求。",
        },
      ],
    },
    {
      title: "找家教",
      items: [
        {
          q: "如何搜索合适的家教？",
          a: "在「找家教」页面，可以按学科、价格区间、评分、是否可预约等条件筛选，也可以直接搜索姓名或学科关键词。",
        },
        {
          q: "如何预约家教？",
          a: "进入教员详情页，点击「预约教员」按钮，填写你的需求和留言，提交后等待教员回复。",
        },
        {
          q: "预约后多久会收到回复？",
          a: "这取决于教员的响应速度，通常在 24 小时内。你可以在「控制台」查看预约状态。",
        },
      ],
    },
    {
      title: "发布需求",
      items: [
        {
          q: "如何发布家教需求？",
          a: "登录家长账号，进入「控制台」，点击「发布新需求」，填写学科、年级、预算、时间安排等信息后提交。",
        },
        {
          q: "需求发布后在哪里显示？",
          a: "需求会显示在「需求大厅」，所有教员都可以看到并申请。",
        },
        {
          q: "如何关闭已发布的需求？",
          a: "在「控制台」的需求列表中，点击对应需求右侧的「关闭需求」按钮即可。关闭后可随时重新开放。",
        },
      ],
    },
    {
      title: "教员相关",
      items: [
        {
          q: "如何完善教员资料？",
          a: "登录教员账号，进入「控制台」，填写学校、专业、年级、擅长科目、时薪、自我介绍等信息并保存。",
        },
        {
          q: "如何申请需求大厅的需求？",
          a: "在「需求大厅」浏览家长发布的需求，点击「申请接单」，填写申请留言后提交，等待家长回复。",
        },
        {
          q: "如何接受或拒绝预约？",
          a: "在「控制台」的「收到的预约」中，可以对每条预约点击「接受」或「拒绝」。",
        },
      ],
    },
    {
      title: "账号与安全",
      items: [
        {
          q: "忘记密码怎么办？",
          a: "目前请联系我们的客服邮箱 gongyuhang72@gmail.com，说明你的注册邮箱，我们会协助你重置密码。",
        },
        {
          q: "如何修改个人信息？",
          a: "教员可在控制台修改个人资料。账号基本信息（邮箱、密码）的修改功能即将上线。",
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">帮助中心</h1>
          <p className="text-gray-500 mb-10">常见问题解答，帮你快速上手 TopTutor</p>

          <div className="space-y-10">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.items.map((item) => (
                    <div key={item.q} className="rounded-xl bg-gray-50 p-4">
                      <p className="font-medium text-gray-900 mb-1.5">{item.q}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm mb-3">没有找到你的问题？</p>
            <a
              href="mailto:gongyuhang72@gmail.com"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              联系客服
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
