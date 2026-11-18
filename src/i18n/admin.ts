import { cookies } from "next/headers";
import { ADMIN_LOCALES, type AdminLocale } from "./admin-dict";

export { ADMIN_LOCALES, type AdminLocale };

/** 后台界面三语字典（后台独立于前台 locale 路由，用 cookie 记忆语言偏好；本文件仅服务端导入） */

const dict = {
  zh: {
    dashboard: "仪表盘", products: "产品管理", news: "新闻管理", cases: "案例管理", messages: "留言管理",
    viewSite: "查看官网", logout: "退出登录", login: "管理后台登录", email: "邮箱", password: "密码",
    signIn: "登录", signingIn: "登录中…", loginFailed: "邮箱或密码不正确",
    overview: "数据概览", productCount: "产品数", newsCount: "新闻数", caseCount: "案例数", unhandled: "未处理留言",
    create: "新建", edit: "编辑", delete: "删除", save: "保存", cancel: "取消", title: "标题", status: "状态",
    published: "已发布", draft: "草稿", publish: "发布", unpublish: "下架", updatedAt: "更新时间", actions: "操作",
    empty: "暂无内容，点击右上角新建", slug: "URL 标识 slug", cover: "封面图", images: "多图",
    order: "排序", featured: "首页推荐/精选", isPublished: "发布（前台可见）",
    zh: "中文", en: "English", ar: "العربية", desc: "简介", body: "正文（富文本）", summary: "摘要",
    client: "客户/行业", publishDate: "发布日期", features: "功能特性", specs: "技术参数", scenarios: "应用场景", metrics: "成果数据",
    addRow: "添加一行", icon: "图标名（lucide）", label: "名称", value: "值",
    handled: "已处理", pending: "未处理", markHandled: "标记已处理", markPending: "标记未处理", exportCsv: "导出 CSV",
    name: "姓名", contact: "联系方式", company: "公司", product: "意向产品", content: "留言内容", time: "时间",
    upload: "上传图片", uploading: "上传中…", imageUrlPlaceholder: "或粘贴图片 URL 后回车",
    admin: "管理后台", saveFailed: "保存失败，请检查必填项（三语标题必填）",
  },
  en: {
    dashboard: "Dashboard", products: "Products", news: "News", cases: "Cases", messages: "Messages",
    viewSite: "View Site", logout: "Log Out", login: "Admin Login", email: "Email", password: "Password",
    signIn: "Sign In", signingIn: "Signing in…", loginFailed: "Invalid email or password",
    overview: "Overview", productCount: "Products", newsCount: "News", caseCount: "Cases", unhandled: "Unhandled Messages",
    create: "Create", edit: "Edit", delete: "Delete", save: "Save", cancel: "Cancel", title: "Title", status: "Status",
    published: "Published", draft: "Draft", publish: "Publish", unpublish: "Unpublish", updatedAt: "Updated", actions: "Actions",
    empty: "No content yet — click Create", slug: "Slug", cover: "Cover Image", images: "Images",
    order: "Order", featured: "Featured on Homepage", isPublished: "Published (visible)",
    zh: "中文", en: "English", ar: "العربية", desc: "Description", body: "Body (rich text)", summary: "Summary",
    client: "Client / Industry", publishDate: "Publish Date", features: "Features", specs: "Specifications", scenarios: "Use Cases", metrics: "Result Metrics",
    addRow: "Add Row", icon: "Icon (lucide name)", label: "Label", value: "Value",
    handled: "Handled", pending: "Pending", markHandled: "Mark Handled", markPending: "Mark Pending", exportCsv: "Export CSV",
    name: "Name", contact: "Contact", company: "Company", product: "Product", content: "Message", time: "Time",
    upload: "Upload Image", uploading: "Uploading…", imageUrlPlaceholder: "Or paste image URL + Enter",
    admin: "Admin", saveFailed: "Save failed — check required fields (titles in all languages)",
  },
  ar: {
    dashboard: "لوحة التحكم", products: "إدارة المنتجات", news: "إدارة الأخبار", cases: "إدارة الحالات", messages: "إدارة الرسائل",
    viewSite: "عرض الموقع", logout: "تسجيل الخروج", login: "تسجيل دخول الإدارة", email: "البريد الإلكتروني", password: "كلمة المرور",
    signIn: "دخول", signingIn: "جارٍ الدخول…", loginFailed: "البريد أو كلمة المرور غير صحيحة",
    overview: "نظرة عامة", productCount: "المنتجات", newsCount: "الأخبار", caseCount: "الحالات", unhandled: "رسائل غير معالجة",
    create: "إنشاء", edit: "تعديل", delete: "حذف", save: "حفظ", cancel: "إلغاء", title: "العنوان", status: "الحالة",
    published: "منشور", draft: "مسودة", publish: "نشر", unpublish: "إلغاء النشر", updatedAt: "آخر تحديث", actions: "إجراءات",
    empty: "لا يوجد محتوى — انقر إنشاء", slug: "المعرف slug", cover: "صورة الغلاف", images: "الصور",
    order: "الترتيب", featured: "مميز في الرئيسية", isPublished: "منشور (ظاهر للزوار)",
    zh: "中文", en: "English", ar: "العربية", desc: "الوصف", body: "المحتوى (نص منسق)", summary: "الملخص",
    client: "العميل / القطاع", publishDate: "تاريخ النشر", features: "المميزات", specs: "المواصفات", scenarios: "سيناريوهات الاستخدام", metrics: "بيانات النتائج",
    addRow: "إضافة صف", icon: "الأيقونة (lucide)", label: "الاسم", value: "القيمة",
    handled: "تمت المعالجة", pending: "قيد الانتظار", markHandled: "تعليم كمعالجة", markPending: "تعليم كغير معالجة", exportCsv: "تصدير CSV",
    name: "الاسم", contact: "الاتصال", company: "الشركة", product: "المنتج", content: "الرسالة", time: "الوقت",
    upload: "رفع صورة", uploading: "جارٍ الرفع…", imageUrlPlaceholder: "أو الصق رابط صورة + Enter",
    admin: "الإدارة", saveFailed: "فشل الحفظ — تحقق من الحقول المطلوبة",
  },
} as const;

export type AdminDict = (typeof dict)["zh"];

export async function getAdminLocale(): Promise<AdminLocale> {
  const v = (await cookies()).get("admin_locale")?.value;
  return (ADMIN_LOCALES as readonly string[]).includes(v ?? "") ? (v as AdminLocale) : "zh";
}

export async function getAdminDict(): Promise<{ locale: AdminLocale; t: AdminDict }> {
  const locale = await getAdminLocale();
  return { locale, t: dict[locale] as AdminDict };
}
