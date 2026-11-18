"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050A14] px-4">
      <form action={action} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-xl">
        <h1 className="mb-1 text-center font-display text-2xl font-bold tracking-widest">AIQC</h1>
        <p className="mb-6 text-center text-sm text-zinc-500">管理后台登录 · Admin Login</p>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-zinc-600">邮箱 / Email</span>
          <input name="email" type="email" required className="w-full rounded-md border px-3 py-2 text-sm" placeholder="admin@aiqc.local" />
        </label>
        <label className="mb-4 block">
          <span className="mb-1 block text-sm text-zinc-600">密码 / Password</span>
          <input name="password" type="password" required className="w-full rounded-md border px-3 py-2 text-sm" />
        </label>
        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
        <button disabled={pending} className="w-full rounded-md bg-zinc-900 py-2.5 text-sm text-white disabled:opacity-50">
          {pending ? "…" : "登录 / Sign In"}
        </button>
        <p className="mt-4 text-center text-xs text-zinc-400">初始账号见 README，上线前务必修改密码</p>
      </form>
    </div>
  );
}
