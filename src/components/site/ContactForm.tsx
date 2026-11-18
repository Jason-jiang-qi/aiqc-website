"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";

const inputCls =
  "w-full rounded-xl border border-line bg-panel px-4 py-3 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-cyber";

export default function ContactForm({
  products,
  defaultProduct = "",
}: {
  products: { slug: string; title: string }[];
  defaultProduct?: string;
}) {
  const t = useTranslations("contact");
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    const form = e.currentTarget;
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (res.ok) {
      setState("success");
      form.reset();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? t("failed"));
      setState("error");
    }
  }

  if (state === "success")
    return (
      <p className="flex items-center gap-2 rounded-2xl border border-mint/30 bg-mint/10 p-6 text-mint">
        <CheckCircle2 /> {t("success")}
      </p>
    );

  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label={`${t("name")} *`}><input name="name" required className={inputCls} /></Field>
      <Field label={`${t("contactLabel")} *`}><input name="contact" required className={inputCls} /></Field>
      <Field label={t("company")}><input name="company" className={inputCls} /></Field>
      <Field label={t("product")}>
        <select name="product" defaultValue={defaultProduct} className={inputCls}>
          <option value="">{t("productNone")}</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>{p.title}</option>
          ))}
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label={`${t("content")} *`}><textarea name="content" required rows={5} className={inputCls} /></Field>
      </div>
      {state === "error" && <p className="text-sm text-red-400 sm:col-span-2">{error}</p>}
      <button
        disabled={state === "submitting"}
        className="rounded-full bg-gradient-to-r from-cyber to-royal px-7 py-3 font-medium text-abyss transition hover:opacity-90 disabled:opacity-50 sm:col-span-2 sm:w-fit"
      >
        {state === "submitting" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-zinc-400">{label}</span>
      {children}
    </label>
  );
}
