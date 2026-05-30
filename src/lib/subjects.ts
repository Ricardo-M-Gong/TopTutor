import type { Subject } from "@/types";

/** 首页热门学科分类（静态展示元数据） */
export const SUBJECT_CATEGORIES: Omit<Subject, "tutorCount">[] = [
  { id: "math", name: "数学", icon: "📐" },
  { id: "english", name: "英语", icon: "🌍" },
  { id: "cs", name: "计算机", icon: "💻" },
  { id: "physics", name: "物理", icon: "⚛️" },
  { id: "chemistry", name: "化学", icon: "🧪" },
  { id: "economics", name: "经济学", icon: "📊" },
  { id: "chinese", name: "语文", icon: "📝" },
  { id: "biology", name: "生物", icon: "🧬" },
];

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  math: ["数学", "高数", "高等数学", "线性代数", "概率论", "微积分", "代数"],
  english: ["英语", "雅思", "托福", "CET", "口语", "写作", "IELTS", "TOEFL"],
  cs: ["计算机", "编程", "C++", "数据结构", "算法", "软件", "Python", "Java", "代码"],
  physics: ["物理", "电磁", "力学", "量子"],
  chemistry: ["化学"],
  economics: ["经济", "会计", "金融", "计量"],
  chinese: ["语文", "中文", "阅读"],
  biology: ["生物"],
};

export function matchSubjectCategory(subjectName: string): string | null {
  const normalized = subjectName.toLowerCase();
  for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => normalized.includes(kw.toLowerCase()) || subjectName.includes(kw))) {
      return categoryId;
    }
  }
  return null;
}

export function buildSubjectCategoriesWithCounts(
  rows: { subjectName: string; tutorProfileId: string }[],
): Subject[] {
  const tutorsByCategory = new Map<string, Set<string>>();

  for (const row of rows) {
    const categoryId = matchSubjectCategory(row.subjectName);
    if (!categoryId) continue;
    if (!tutorsByCategory.has(categoryId)) {
      tutorsByCategory.set(categoryId, new Set());
    }
    tutorsByCategory.get(categoryId)!.add(row.tutorProfileId);
  }

  return SUBJECT_CATEGORIES.map((category) => ({
    ...category,
    tutorCount: tutorsByCategory.get(category.id)?.size ?? 0,
  }));
}
