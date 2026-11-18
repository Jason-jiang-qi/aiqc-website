"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { AdminDict } from "@/i18n/admin";
import type { ProductInput } from "@/lib/validators";
import { parseFeatures, parseSpecs, parseScenarios, parseImages } from "@/lib/i18n-content";
import { Field, TriField, TriRows, inputCls, emptyTri, type TriText } from "./fields";
import { CoverUploader, ImagesUploader } from "./ImageUploader";
import { saveProduct } from "@/app/admin/(dashboard)/actions";

type Initial = Partial<ProductInput> & { features?: unknown; specs?: unknown; scenarios?: unknown; images?: unknown };

export default function ProductEditor({ dict, initial }: { dict: AdminDict; initial?: Initial }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const tri = (zh?: string, en?: string, ar?: string): TriText => ({ zh: zh ?? "", en: en ?? "", ar: ar ?? "" });

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    cover: initial?.cover ?? "",
    images: parseImages(initial?.images),
    isPublished: initial?.isPublished ?? false,
    featured: initial?.featured ?? false,
    order: initial?.order ?? 0,
    title: tri(initial?.zhTitle, initial?.enTitle, initial?.arTitle),
    desc: tri(initial?.zhDesc, initial?.enDesc, initial?.arDesc),
    body: tri(initial?.zhBody, initial?.enBody, initial?.arBody),
    features: parseFeatures(initial?.features).map((f) => ({ icon: f.icon, value: f.text })),
    specs: parseSpecs(initial?.specs),
    scenarios: parseScenarios(initial?.scenarios).map((s) => ({ value: s })),
  });
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    start(async () => {
      const err = await saveProduct({
        id: initial?.id, slug: form.slug, cover: form.cover, images: form.images,
        isPublished: form.isPublished, featured: form.featured, order: form.order,
        zhTitle: form.title.zh, enTitle: form.title.en, arTitle: form.title.ar,
        zhDesc: form.desc.zh, enDesc: form.desc.en, arDesc: form.desc.ar,
        zhBody: form.body.zh, enBody: form.body.en, arBody: form.body.ar,
        features: form.features.map((f) => ({ icon: f.icon ?? "Zap", text: f.value as TriText })),
        specs: form.specs.map((s) => ({ label: s.label!, value: s.value as TriText })),
        scenarios: form.scenarios.map((s) => s.value as TriText),
      });
      if (err) setError(err);
      else router.push("/admin/products");
    });
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={`${dict.slug} *`}><input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="autonomous-sweeper" /></Field>
        <Field label={dict.order}><input type="number" className={inputCls} value={form.order} onChange={(e) => set("order", Number(e.target.value))} /></Field>
      </div>
      <TriField label={`${dict.title} *`} dict={dict} value={form.title} onChange={(v) => set("title", v)} />
      <TriField label={dict.desc} dict={dict} value={form.desc} onChange={(v) => set("desc", v)} multiline />
      <TriField label={dict.body} dict={dict} value={form.body} onChange={(v) => set("body", v)} rich />
      <Field label={dict.cover}><CoverUploader dict={dict} value={form.cover} onChange={(v) => set("cover", v)} /></Field>
      <Field label={dict.images}><ImagesUploader dict={dict} value={form.images} onChange={(v) => set("images", v)} /></Field>

      <fieldset>
        <legend className="mb-2 font-medium text-zinc-700">{dict.features}</legend>
        <TriRows dict={dict} withIcon rows={form.features} onChange={(r) => set("features", r as typeof form.features)} />
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-medium text-zinc-700">{dict.specs}</legend>
        <TriRows dict={dict} rows={form.specs} onChange={(r) => set("specs", r as typeof form.specs)} />
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-medium text-zinc-700">{dict.scenarios}</legend>
        <TriRows dict={dict} rows={form.scenarios} onChange={(r) => set("scenarios", r as typeof form.scenarios)} />
      </fieldset>

      <div className="flex gap-6 text-sm text-zinc-700">
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} /> {dict.isPublished}</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> {dict.featured}</label>
      </div>
      {error && <p className="text-sm text-red-600">{error || dict.saveFailed}</p>}
      <div className="flex gap-3">
        <button onClick={submit} disabled={pending} className="rounded-md bg-zinc-900 px-6 py-2.5 text-sm text-white disabled:opacity-50">{dict.save}</button>
        <button onClick={() => router.back()} className="rounded-md border px-6 py-2.5 text-sm text-zinc-600">{dict.cancel}</button>
      </div>
      <span className="hidden">{emptyTri().zh}</span>
    </div>
  );
}
