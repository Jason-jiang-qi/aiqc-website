/**
 * 站点静态配置 —— 【占位】公司英文全称、联系方式、统计数字由公司后续提供（需求 §13 开放问题），
 * 提供后统一改此文件；导航与文案走三语字典 src/messages/*.json，不在此处。
 */
export const siteConfig = {
  name: "AIQC",
  fullName: "", // 公司英文全称待提供，用于 Logo 与版权
  contact: {
    phone: "+966 XX XXX XXXX", // 待提供
    email: "info@aiqc.example", // 待提供
    address: { zh: "沙特阿拉伯（详细地址待提供）", en: "Saudi Arabia (address TBD)", ar: "المملكة العربية السعودية (العنوان لاحقاً)" },
  },
  /** 首页数据统计（占位数字，待公司确认真实数据后修改） */
  stats: { years: 4, clients: 30, devices: 100, cities: 5 },
} as const;
