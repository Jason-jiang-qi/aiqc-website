"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminDict } from "@/i18n/admin";
import type { NewsInput } from "@/lib/validators";
import { Field, TriField, inputCls, type TriText } from "./fields";
import { CoverUploader } from "./ImageUploader";
import { saveNews } from "@/app/admin/(dashboard)/actions";

export default function NewsEditor({ dict, initial }: { dict: AdminDict; initial?: Partial<NewsInput> }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const tri = (zh?: string, en?: string, ar?: string): TriText => ({ zh: zh ?? "", en: en ?? "", ar: ar ?? "" });
  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    cover: initial?.cover ?? "",
    isPublished: initial?.isPublished ?? false,
    publishDate: initial?.publishDate ?? new Date().toISOString().slice(0, 10),
    title: tri(initial?.zhTitle, initial?.enTitle, initial?.arTitle),
    summary: tri(initial?.zhSummary, initial?.enSummary, initial?.arSummary),
    body: tri(initial?.zhBody, initial?.enBody, initial?.arBody),
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    start(async () => {
      const err = await saveNews({
        id: initial?.id, slug: form.slug, cover: form.cover, isPublished: form.isPublished, publishDate: form.publishDate,
        zhTitle: form.title.zh, enTitle: form.title.en, arTitle: form.title.ar,
        zhSummary: form.summary.zh, enSummary: form.summary.en, arSummary: form.summary.ar,
        zhBody: form.body.zh, enBody: form.body.en, arBody: form.body.ar,
      });
      if (err) setError(err);
      else router.push("/admin/news");
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${dict.slug} *`}><input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} /></Field>
        <Field label={dict.publishDate}><input type="date" className={inputCls} value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} /></Field>
      </div>
      <TriField label={`${dict.title} *`} dict={dict} value={form.title} onChange={(v) => set("title", v)} />
      <TriField label={dict.summary} dict={dict} value={form.summary} onChange={(v) => set("summary", v)} multiline />
      <TriField label={dict.body} dict={dict} value={form.body} onChange={(v) => set("body", v)} rich />
      <Field label={dict.cover}><CoverUploader dict={dict} value={form.cover} onChange={(v) => set("cover", v)} /></Field>
      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> {dict.isPublished}
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button onClick={submit} disabled={pending} className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm text-white disabled:opacity-50">{dict.save}</button>
        <button onClick={() => router.back()} className="rounded-md border px-6 py-2.5 text-sm text-zinc-600">{dict.cancel}</button>
      </div>
    </div>
  );
}
