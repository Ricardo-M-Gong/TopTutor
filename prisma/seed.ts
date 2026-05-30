import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

// ── 10 名校教员 ──────────────────────────────────────────────────────────────
const TUTORS = [
  {
    email: "liming@seed.toptutor.dev",
    name: "李明远",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LiMingyuan",
    university: "北京大学",
    major: "数学系",
    grade: "研究生二年级",
    hourlyRate: 120,
    rating: 4.9,
    reviewCount: 87,
    bio: "北大数学系研究生，擅长将复杂概念用简单方式讲解，已帮助 80+ 学生通过期末考试。",
    available: true,
    subjects: ["高等数学", "线性代数", "概率论"],
    tags: ["耐心细致", "逻辑清晰", "备考专家"],
    regions: ["西湖区", "上城区"],
  },
  {
    email: "zhangyuqing@seed.toptutor.dev",
    name: "张雨晴",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZhangYuqing",
    university: "复旦大学",
    major: "英语语言文学",
    grade: "大四",
    hourlyRate: 100,
    rating: 4.8,
    reviewCount: 63,
    bio: "雅思 8.0，CET-6 满分，专注英语口语和写作提升，课程生动有趣。",
    available: true,
    subjects: ["大学英语", "英语写作", "雅思备考"],
    tags: ["口语流利", "写作专家", "雅思托福"],
    regions: ["滨江区", "余杭区"],
  },
  {
    email: "wanghaoran@seed.toptutor.dev",
    name: "王浩然",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=WangHaoran",
    university: "清华大学",
    major: "计算机科学",
    grade: "大三",
    hourlyRate: 150,
    rating: 5.0,
    reviewCount: 42,
    bio: "ACM 竞赛金牌，LeetCode 2600+，专注算法与数据结构，帮你轻松应对笔试面试。",
    available: false,
    subjects: ["C++", "数据结构", "算法"],
    tags: ["ACM金牌", "算法大神", "面试辅导"],
    regions: ["西湖区", "滨江区", "余杭区"],
  },
  {
    email: "chensiqi@seed.toptutor.dev",
    name: "陈思琪",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ChenSiqi",
    university: "中国科学技术大学",
    major: "物理学",
    grade: "研究生一年级",
    hourlyRate: 130,
    rating: 4.7,
    reviewCount: 55,
    bio: "物理竞赛全国一等奖，善于用实验和生活案例解释抽象物理概念。",
    available: true,
    subjects: ["大学物理", "电磁学", "量子力学"],
    tags: ["物理竞赛", "实验教学", "概念清晰"],
    regions: ["拱墅区", "临平区"],
  },
  {
    email: "liuzixuan@seed.toptutor.dev",
    name: "刘子轩",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LiuZixuan",
    university: "上海交通大学",
    major: "经济学",
    grade: "大四",
    hourlyRate: 110,
    rating: 4.6,
    reviewCount: 38,
    bio: "经济学院优秀毕业生，擅长用图表和案例讲解经济学原理，期末高分保障。",
    available: true,
    subjects: ["微观经济学", "宏观经济学", "计量经济学"],
    tags: ["图表教学", "案例分析", "期末冲刺"],
    regions: ["上城区", "萧山区"],
  },
  {
    email: "zhaoxinyi@seed.toptutor.dev",
    name: "赵欣怡",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZhaoXinyi",
    university: "南京大学",
    major: "化学系",
    grade: "研究生二年级",
    hourlyRate: 125,
    rating: 4.8,
    reviewCount: 71,
    bio: "化学竞赛省级一等奖，实验操作经验丰富，帮助学生建立系统化学知识体系。",
    available: true,
    subjects: ["有机化学", "无机化学", "分析化学"],
    tags: ["竞赛经验", "实验指导", "系统教学"],
    regions: ["西湖区", "钱塘区"],
  },
  {
    email: "sunjiacheng@seed.toptutor.dev",
    name: "孙嘉诚",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=SunJiacheng",
    university: "浙江大学",
    major: "电气工程",
    grade: "研究生一年级",
    hourlyRate: 140,
    rating: 4.9,
    reviewCount: 50,
    bio: "浙大电气工程研究生，曾获全国大学生电子设计竞赛一等奖，擅长电路分析与嵌入式开发。",
    available: true,
    subjects: ["电路分析", "模拟电子技术", "信号与系统"],
    tags: ["竞赛一等奖", "项目驱动", "理论扎实"],
    regions: ["余杭区", "临平区"],
  },
  {
    email: "linxiaoyu@seed.toptutor.dev",
    name: "林晓宇",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=LinXiaoyu",
    university: "武汉大学",
    major: "法学",
    grade: "大四",
    hourlyRate: 95,
    rating: 4.7,
    reviewCount: 33,
    bio: "武大法学院优秀生，司法考试高分通过，擅长民法、刑法等核心科目的体系梳理。",
    available: true,
    subjects: ["民法", "刑法", "宪法"],
    tags: ["司考高分", "体系梳理", "逻辑清晰"],
    regions: ["滨江区", "上城区"],
  },
  {
    email: "huangmingzhi@seed.toptutor.dev",
    name: "黄明志",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=HuangMingzhi",
    university: "同济大学",
    major: "建筑学",
    grade: "研究生二年级",
    hourlyRate: 135,
    rating: 4.8,
    reviewCount: 29,
    bio: "同济建筑学研究生，曾获多项设计竞赛奖项，擅长建筑设计方案辅导和制图技巧提升。",
    available: false,
    subjects: ["建筑设计", "建筑历史", "城市规划"],
    tags: ["设计竞赛", "方案辅导", "手绘高手"],
    regions: ["拱墅区", "西湖区"],
  },
  {
    email: "wuyanting@seed.toptutor.dev",
    name: "吴燕婷",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=WuYanting",
    university: "中央音乐学院",
    major: "钢琴演奏",
    grade: "大三",
    hourlyRate: 160,
    rating: 5.0,
    reviewCount: 45,
    bio: "中央音乐学院钢琴专业，十级认证，从零基础到考级均可辅导，注重音乐情感表达。",
    available: true,
    subjects: ["钢琴基础", "乐理", "考级备考"],
    tags: ["专业演奏", "零基础友好", "考级专家"],
    regions: ["萧山区", "钱塘区"],
  },
];

// ── 5 个家教需求 ────────────────────────────────────────────────────────────
const REQUIREMENTS = [
  {
    email: "parent1@seed.toptutor.dev",
    name: "王先生",
    subjectName: "高等数学",
    gradeLevel: "UNDERGRADUATE" as const,
    budgetMin: 80,
    budgetMax: 130,
    scheduleNote: "周末上午，每次 2 小时",
    description: "孩子大一，高数期中考试不及格，需要从极限、导数开始补课，要求老师有耐心。",
    regions: ["西湖区", "拱墅区"],
  },
  {
    email: "parent2@seed.toptutor.dev",
    name: "李女士",
    subjectName: "雅思备考",
    gradeLevel: "UNDERGRADUATE" as const,
    budgetMin: 100,
    budgetMax: 150,
    scheduleNote: "工作日晚上 7-9 点",
    description: "备考雅思，目标 7.0 分，目前 6.0，主要需要提升口语和写作，最好老师有高分经历。",
    regions: ["滨江区"],
  },
  {
    email: "parent3@seed.toptutor.dev",
    name: "张同学",
    subjectName: "数据结构",
    gradeLevel: "UNDERGRADUATE" as const,
    budgetMin: 120,
    budgetMax: 180,
    scheduleNote: "灵活安排，每周 2-3 次",
    description: "准备秋招，需要系统复习数据结构和算法，希望老师有大厂面试经验，可以模拟面试。",
    regions: ["余杭区", "临平区"],
  },
  {
    email: "parent4@seed.toptutor.dev",
    name: "陈女士",
    subjectName: "钢琴基础",
    gradeLevel: "OTHER" as const,
    budgetMin: 150,
    budgetMax: 200,
    scheduleNote: "周六下午",
    description: "6 岁孩子，零基础学钢琴，希望老师有耐心，教学方式活泼，不要太枯燥。",
    regions: ["上城区", "萧山区"],
  },
  {
    email: "parent5@seed.toptutor.dev",
    name: "刘先生",
    subjectName: "微观经济学",
    gradeLevel: "UNDERGRADUATE" as const,
    budgetMin: 90,
    budgetMax: 120,
    scheduleNote: "期末考试前两周，每天都可以",
    description: "期末冲刺，微观经济学和宏观经济学都需要复习，主要是理解各类模型，做题能力较弱。",
    regions: ["钱塘区", "西湖区"],
  },
];

async function main() {
  // 清空旧数据（保持幂等）
  await prisma.requirement.deleteMany();
  await prisma.tutorProfile.deleteMany();
  await prisma.user.deleteMany();

  // 插入教员
  for (const t of TUTORS) {
    const user = await prisma.user.create({
      data: {
        email: t.email,
        passwordHash: "seed-placeholder",
        name: t.name,
        avatarUrl: t.avatarUrl,
        role: "TUTOR",
        emailVerified: new Date(),
        tutorProfile: {
          create: {
            university: t.university,
            major: t.major,
            grade: t.grade,
            hourlyRate: t.hourlyRate,
            rating: t.rating,
            reviewCount: t.reviewCount,
            bio: t.bio,
            available: t.available,
            subjects: { create: t.subjects.map((s) => ({ subjectName: s })) },
            tags: { create: t.tags.map((tag) => ({ tag })) },
            regions: { create: t.regions.map((r) => ({ regionName: r })) },
          },
        },
      },
    });
    console.log(`  ✓ tutor: ${user.name} (${t.university})`);
  }

  // 插入家教需求（用独立 PARENT 用户）
  for (const r of REQUIREMENTS) {
    const user = await prisma.user.create({
      data: {
        email: r.email,
        passwordHash: "seed-placeholder",
        name: r.name,
        role: "PARENT",
        emailVerified: new Date(),
      },
    });
    await prisma.requirement.create({
      data: {
        userId: user.id,
        subjectName: r.subjectName,
        gradeLevel: r.gradeLevel,
        budgetMin: r.budgetMin,
        budgetMax: r.budgetMax,
        scheduleNote: r.scheduleNote,
        description: r.description,
        regions: { create: r.regions.map((region) => ({ regionName: region })) },
      },
    });
    console.log(`  ✓ requirement: ${r.name} — ${r.subjectName}`);
  }

  console.log(`\nSeeded ${TUTORS.length} tutors + ${REQUIREMENTS.length} requirements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
