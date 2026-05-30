import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/reset-password?token=${token}`;

  await resend.emails.send({
    from: "TopTutor <onboarding@resend.dev>",
    to,
    subject: "重置你的 TopTutor 密码",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#4f46e5;margin-bottom:8px;">TopTutor 密码重置</h2>
        <p style="color:#374151;margin-bottom:24px;">
          我们收到了你的密码重置请求。点击下方按钮设置新密码，链接 <strong>1 小时</strong>内有效。
        </p>
        <a href="${resetUrl}"
           style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
          重置密码
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">
          如果你没有发起此请求，请忽略此邮件，你的密码不会被更改。
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">TopTutor · 大学生家教平台</p>
      </div>
    `,
    text: `重置你的 TopTutor 密码\n\n请访问以下链接重置密码（1 小时内有效）：\n${resetUrl}\n\n如果你没有发起此请求，请忽略此邮件。`,
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const verifyUrl = `${process.env.AUTH_URL ?? "http://localhost:3000"}/api/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "TopTutor <onboarding@resend.dev>",
    to,
    subject: "验证你的 TopTutor 邮箱",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f9fafb;border-radius:12px;">
        <h2 style="color:#4f46e5;margin-bottom:8px;">TopTutor 邮箱验证</h2>
        <p style="color:#374151;margin-bottom:24px;">
          感谢注册 TopTutor！点击下方按钮完成邮箱验证，链接 <strong>24 小时</strong>内有效。
        </p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:12px 28px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">
          验证邮箱
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px;">
          如果你没有注册 TopTutor，请忽略此邮件。
        </p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
        <p style="color:#9ca3af;font-size:12px;">TopTutor · 大学生家教平台</p>
      </div>
    `,
    text: `请访问以下链接验证邮箱（24小时内有效）：\n${verifyUrl}`,
  });
}
