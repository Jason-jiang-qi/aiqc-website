/** 后台语言常量（纯模块，客户端/服务端均可导入；字典本体在 admin.ts 仅服务端使用） */
export const ADMIN_LOCALES = ["zh", "en", "ar"] as const;
export type AdminLocale = (typeof ADMIN_LOCALES)[number];
