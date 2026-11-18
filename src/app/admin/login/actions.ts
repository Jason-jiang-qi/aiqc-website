"use server";

import { redirect } from "next/navigation";
import { verifyCredentials, createSession } from "@/lib/auth";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const user = await verifyCredentials(email, password);
  if (!user) return "邮箱或密码不正确 / Invalid email or password";
  await createSession(user.id);
  redirect("/admin");
}
