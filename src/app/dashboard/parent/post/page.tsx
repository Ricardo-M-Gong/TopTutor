import { auth } from "@/auth";
import { redirect } from "next/navigation";
import RequirementForm from "@/components/RequirementForm";

export default async function PostRequirementPage() {
  const session = await auth();

  if (!session?.user?.id || (session.user.role !== "PARENT" && session.user.role !== "STUDENT")) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">发布家教需求</h1>
          <p className="mt-1 text-sm text-gray-500">
            填写你的学习需求，让合适的家教主动联系你。
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <RequirementForm />
        </div>
      </div>
    </main>
  );
}
