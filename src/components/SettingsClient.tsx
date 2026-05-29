"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ToastProvider";

interface ProfileFormProps {
  name: string;
  phone: string;
  email: string;
  role: string;
}

function ProfileForm({ name, phone, email, role }: ProfileFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [nameVal, setNameVal] = useState(name);
  const [phoneVal, setPhoneVal] = useState(phone);
  const [loading, setLoading] = useState(false);

  const ROLE_LABEL: Record<string, string> = {
    TUTOR: "大学生教员", PARENT: "家长 / 学员", STUDENT: "学员", ADMIN: "管理员",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameVal.trim()) return toast("姓名不能为空", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameVal, phone: phoneVal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "保存失败", "error");
      } else {
        toast("基本信息已更新");
        router.refresh();
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            邮箱 <span className="text-xs text-gray-400 font-normal">（不可修改）</span>
          </label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            身份 <span className="text-xs text-gray-400 font-normal">（不可修改）</span>
          </label>
          <input
            type="text"
            value={ROLE_LABEL[role] ?? role}
            disabled
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nameVal}
          onChange={(e) => setNameVal(e.target.value)}
          required
          placeholder="请输入姓名"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          手机号
          <span className="ml-2 text-xs text-gray-400 font-normal">对方接受申请后可见，用于双方联系</span>
        </label>
        <input
          type="tel"
          value={phoneVal}
          onChange={(e) => setPhoneVal(e.target.value)}
          placeholder="如：13812345678"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {loading ? "保存中…" : "保存信息"}
      </button>
    </form>
  );
}

function PasswordForm() {
  const { toast } = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (next.length < 6) return toast("新密码至少需要 6 位", "error");
    setLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast(data.error ?? "修改失败", "error");
      } else {
        toast("密码已修改成功");
        setCurrent("");
        setNext("");
      }
    } catch {
      toast("网络错误，请重试", "error");
    } finally {
      setLoading(false);
    }
  }

  function PasswordInput({ value, onChange, show, onToggle, placeholder }: {
    value: string; onChange: (v: string) => void; show: boolean;
    onToggle: () => void; placeholder: string;
  }) {
    return (
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          placeholder={placeholder}
          className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button type="button" onClick={onToggle} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
        <PasswordInput value={current} onChange={setCurrent} show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)} placeholder="请输入当前密码" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">新密码 <span className="text-xs text-gray-400 font-normal">至少 6 位</span></label>
        <PasswordInput value={next} onChange={setNext} show={showNext}
          onToggle={() => setShowNext((v) => !v)} placeholder="请输入新密码" />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
      >
        {loading ? "修改中…" : "修改密码"}
      </button>
    </form>
  );
}

interface Props {
  name: string;
  phone: string;
  email: string;
  role: string;
}

export default function SettingsClient({ name, phone, email, role }: Props) {
  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">账户设置</h1>
          <p className="mt-1 text-sm text-gray-500">管理你的个人信息和账户安全</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">基本信息</h2>
          <ProfileForm name={name} phone={phone} email={email} role={role} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">修改密码</h2>
          <p className="text-xs text-gray-400 mb-6">修改密码后需重新登录</p>
          <PasswordForm />
        </div>
      </div>
    </main>
  );
}
