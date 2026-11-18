import { z } from "zod";

const tri = z.object({ zh: z.string(), en: z.string(), ar: z.string() });

/** 客户留言（需求 §5.6：姓名、电话或邮箱必填，公司选填，意向产品下拉） */
export const messageSchema = z.object({
  name: z.string().trim().min(1).max(50),
  contact: z.string().trim().min(3).max(100),
  company: z.string().trim().max(100).optional().or(z.literal("")),
  product: z.string().trim().max(80).optional().or(z.literal("")),
  content: z.string().trim().min(5).max(2000),
});

const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug 仅允许小写字母、数字和连字符");

export const productInputSchema = z.object({
  id: z.string().optional(),
  slug,
  cover: z.string().max(500).optional().or(z.literal("")),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  zhTitle: z.string().trim().min(1), enTitle: z.string().trim().min(1), arTitle: z.string().trim().min(1),
  zhDesc: z.string().optional().or(z.literal("")), enDesc: z.string().optional().or(z.literal("")), arDesc: z.string().optional().or(z.literal("")),
  zhBody: z.string().optional().or(z.literal("")), enBody: z.string().optional().or(z.literal("")), arBody: z.string().optional().or(z.literal("")),
  features: z.array(z.object({ icon: z.string(), text: tri })).default([]),
  specs: z.array(z.object({ label: tri, value: tri })).default([]),
  scenarios: z.array(tri).default([]),
});
export type ProductInput = z.infer<typeof productInputSchema>;

export const newsInputSchema = z.object({
  id: z.string().optional(),
  slug,
  cover: z.string().max(500).optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  publishDate: z.string().min(1),
  zhTitle: z.string().trim().min(1), enTitle: z.string().trim().min(1), arTitle: z.string().trim().min(1),
  zhSummary: z.string().optional().or(z.literal("")), enSummary: z.string().optional().or(z.literal("")), arSummary: z.string().optional().or(z.literal("")),
  zhBody: z.string().optional().or(z.literal("")), enBody: z.string().optional().or(z.literal("")), arBody: z.string().optional().or(z.literal("")),
});
export type NewsInput = z.infer<typeof newsInputSchema>;

export const caseInputSchema = z.object({
  id: z.string().optional(),
  slug,
  cover: z.string().max(500).optional().or(z.literal("")),
  images: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
  zhTitle: z.string().trim().min(1), enTitle: z.string().trim().min(1), arTitle: z.string().trim().min(1),
  zhClient: z.string().optional().or(z.literal("")), enClient: z.string().optional().or(z.literal("")), arClient: z.string().optional().or(z.literal("")),
  zhDesc: z.string().optional().or(z.literal("")), enDesc: z.string().optional().or(z.literal("")), arDesc: z.string().optional().or(z.literal("")),
  zhBody: z.string().optional().or(z.literal("")), enBody: z.string().optional().or(z.literal("")), arBody: z.string().optional().or(z.literal("")),
  metrics: z.array(z.object({ label: tri, value: z.string() })).default([]),
});
export type CaseInput = z.infer<typeof caseInputSchema>;
