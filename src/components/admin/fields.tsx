"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { AdminDict, AdminLocale } from "@/i18n/admin";
import type { TriText } from "@/lib/i18n-content";

export type { TriText };
export const emptyTri = (): TriText => ({ zh: "", en: "", ar: "" });

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false, loading: () => <p className="p-3 text-sm text-zinc-400">…</p> });
export { RichTextEditor };

export const inputCls = "w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-cyan-600";
export const labelCls = "mb-1 block text-sm font-medium text-zinc-600";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

const LANGS: { key: AdminLocale; label: string }[] = [
  { key: "zh", label: "中文" },
  { key: "en", label: "English" },
  { key: "ar", label: "العربية" },
];

/** 三语分栏输入：页签切换中/英/阿三个输入区 */
export function TriField({
  label, value, onChange, multiline, rich, dict,
}: {
  label: string;
  value: TriText;
  onChange: (v: TriText) => void;
  multiline?: boolean;
  rich?: boolean;
  dict: AdminDict;
}) {
  const [lang, setLang] = useState<AdminLocale>("zh");
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className={labelCls}>{label}</span>
        <div className="flex gap-1">
          {LANGS.map((l) => (
            <button
              type="button" key={l.key} onClick={() => setLang(l.key)}
              className={`rounded px-2 py-0.5 text-xs ${lang === l.key ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {rich ? (
        <RichTextEditor
          key={lang}
          value={value[lang]}
          onChange={(html) => onChange({ ...value, [lang]: html })}
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
      ) : multiline ? (
        <textarea
          dir={lang === "ar" ? "rtl" : "ltr"}
          rows={3} className={inputCls} value={value[lang]}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
        />
      ) : (
        <input
          dir={lang === "ar" ? "rtl" : "ltr"}
          className={inputCls} value={value[lang]}
          onChange={(e) => onChange({ ...value, [lang]: e.target.value })}
        />
      )}
      <span className="sr-only">{dict[lang]}</span>
    </div>
  );
}

/** 三语键值表编辑器（参数/特性文本/成果共用行结构） */
export function TriRows({
  rows, onChange, dict, withIcon = false, valueAsPlain = false,
}: {
  rows: { icon?: string; label?: TriText; value: TriText | string }[];
  onChange: (rows: { icon?: string; label?: TriText; value: TriText | string }[]) => void;
  dict: AdminDict;
  withIcon?: boolean;
  valueAsPlain?: boolean;
}) {
  const update = (i: number, patch: Partial<{ icon: string; label: TriText; value: TriText | string }>) =>
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            {withIcon && (
              <Field label={dict.icon}>
                <input className={inputCls} value={row.icon ?? ""} onChange={(e) => update(i, { icon: e.target.value })} placeholder="Zap / Camera / BatteryCharging…" />
              </Field>
            )}
            {row.label && (
              <TriField label={dict.label} dict={dict} value={row.label} onChange={(v) => update(i, { label: v })} />
            )}
            {valueAsPlain ? (
              <Field label={dict.value}>
                <input className={inputCls} value={String(row.value)} onChange={(e) => update(i, { value: e.target.value })} placeholder="30%" />
              </Field>
            ) : (
              <TriField label={row.label ? dict.value : dict.content} dict={dict} value={row.value as TriText} onChange={(v) => update(i, { value: v })} />
            )}
          </div>
          <button type="button" className="mt-2 text-xs text-red-600 hover:underline" onClick={() => onChange(rows.filter((_, idx) => idx !== i))}>
            {dict.delete}
          </button>
        </div>
      ))}
      <button
        type="button"
        className="rounded-md border border-dashed px-3 py-1.5 text-sm text-zinc-600 hover:border-zinc-400"
        onClick={() =>
          onChange([
            ...rows,
            withIcon
              ? { icon: "Zap", value: emptyTri() }
              : valueAsPlain
                ? { label: emptyTri(), value: "" }
                : { label: emptyTri(), value: emptyTri() },
          ])
        }
      >
        + {dict.addRow}
      </button>
    </div>
  );
}
