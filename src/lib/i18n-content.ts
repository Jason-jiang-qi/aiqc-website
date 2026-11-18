import type { Locale } from "@/i18n/routing";

/** 三语 Json 字段（features/specs/scenarios/metrics）在 DB 中的统一结构 */
export type TriText = { zh: string; en: string; ar: string };
export type SpecRow = { label: TriText; value: TriText };
export type FeatureRow = { icon: string; text: TriText };
export type MetricRow = { label: TriText; value: string };

const emptyTri: TriText = { zh: "", en: "", ar: "" };

function asTri(v: unknown): TriText {
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return { zh: String(o.zh ?? ""), en: String(o.en ?? ""), ar: String(o.ar ?? "") };
  }
  return { ...emptyTri };
}

/** 取三语列字段：pick(product, locale, "Title") -> product.zhTitle / enTitle / arTitle */
export function pick<T extends Record<string, unknown>>(record: T, locale: Locale, field: string): string {
  const v = record[`${locale}${field}`];
  if (typeof v === "string" && v.trim()) return v;
  // 缺失语言回退英文再中文，保证页面不空白
  return String(record[`en${field}`] ?? record[`zh${field}`] ?? "");
}

export const triText = (v: unknown, locale: Locale): string => {
  const t = asTri(v);
  return t[locale] || t.en || t.zh || "";
};

export function parseSpecs(v: unknown): SpecRow[] {
  if (!Array.isArray(v)) return [];
  return v.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { label: asTri(o.label), value: asTri(o.value) };
  });
}
export function parseFeatures(v: unknown): FeatureRow[] {
  if (!Array.isArray(v)) return [];
  return v.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { icon: String(o.icon ?? "Zap"), text: asTri(o.text) };
  });
}
export function parseScenarios(v: unknown): TriText[] {
  if (!Array.isArray(v)) return [];
  return v.map(asTri);
}
export function parseMetrics(v: unknown): MetricRow[] {
  if (!Array.isArray(v)) return [];
  return v.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    return { label: asTri(o.label), value: String(o.value ?? "") };
  });
}
export function parseImages(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
}

export function formatDate(date: Date, locale: Locale) {
  const map: Record<Locale, string> = { zh: "zh-CN", en: "en-US", ar: "ar-SA" };
  return new Intl.DateTimeFormat(map[locale], { year: "numeric", month: "short", day: "numeric" }).format(date);
}
