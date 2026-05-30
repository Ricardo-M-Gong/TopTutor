"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const emailParam = searchParams.get("email") ?? "";

  const [resendEmail, setResendEmail] = useState(emailParam);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState("");
  const [resendError, setResendError] = useState("");

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendError("");
    setResendSuccess("");
    setResendLoading(true);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResendError(data.error ?? "发送失败，请稍后重试");
      } else {
        setResendSuccess(data.message);
      }
    } catch {
      setResendError("网络错误，请稍后重试");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-bold text-indigo-600 mb-2">
            TopTutor
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">邮箱验证</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {!error && (
            <div className="mb-6 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <p className="font-semibold mb-1">请查收验证邮件</p>
              <p>我们已向你的邮箱发送了一封验证邮件，请点击邮件中的链接完成验证后再登录。</p>
            </div>
          )}

          {error === "invalid" && (
            <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="font-semibold mb-1">链接无效</p>
              <p>该验证链接无效，请重新发送验证邮件。</p>
            </div>
          )}

          {error === "expired" && (
            <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <p className="font-semibold mb-1">链接已过期</p>
              <p>该验证链接已过期（有效期24小时），请重新发送验证邮件。</p>
            </div>
          )}

          <p className="text-sm text-gray-600 mb-4">没有收到邮件？请输入注册邮箱重新发送。</p>

          {resendSuccess ? (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              {resendSuccess}
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-3">
              <input
                type="email"
                required
                value={resendEmail}
                onChange={(e) => setResendEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {resendError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                  {resendError}
                </div>
              )}
              <button
                type="submit"
                disabled={resendLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {resendLoading ? "发送中..." : "重新发送验证邮件"}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              返回登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
