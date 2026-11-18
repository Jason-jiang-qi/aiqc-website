import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();
const tri = (zh: string, en: string, ar: string) => ({ zh, en, ar });
const body = (zh: string, en: string, ar: string) => ({
  zhBody: `<p>${zh}</p><p>（占位文案，正式内容由公司提供后在后台替换）</p>`,
  enBody: `<p>${en}</p><p>(Placeholder copy — replace with official content in the admin panel.)</p>`,
  arBody: `<p>${ar}</p><p>(نص مؤقت — يُستبدل بالمحتوى الرسمي من لوحة الإدارة)</p>`,
});

const PRODUCTS = [
  { slug: "autonomous-sweeper", cover: "/image/sweeper.jpeg", featured: true, zh: "无人驾驶扫地车", en: "Autonomous Sweeper", ar: "مركبة كنس ذاتية القيادة",
    zhD: "为园区、道路与商场打造的无人清洁专家，7×24 小时自主清扫。", enD: "An autonomous cleaning expert for parks, roads and malls — sweeping 24/7.", arD: "خبير تنظيف ذاتي للمجمعات والطرق والمراكز التجارية — يعمل على مدار الساعة.",
    scen: [tri("园区道路", "Park Roads", "طرق المجمعات"), tri("商业广场", "Commercial Plazas", "الساحات التجارية"), tri("停车场", "Parking Lots", "مواقف السيارات")] },
  { slug: "autonomous-delivery", cover: "/image/robodeliver.jpg", featured: true, zh: "无人驾驶送货车", en: "Autonomous Delivery Vehicle", ar: "مركبة توصيل ذاتية القيادة",
    zhD: "园区与最后一公里无人配送，提升物流效率，降低人力成本。", enD: "Unmanned delivery for parks and last-mile logistics — more efficiency, lower labor cost.", arD: "توصيل بدون سائق للمجمعات والكيلومتر الأخير — كفاءة أعلى وتكلفة أقل.",
    scen: [tri("园区配送", "Park Delivery", "توصيل المجمعات"), tri("仓储物流", "Warehousing", "المستودعات")] },
  { slug: "autonomous-truck", cover: "/image/robotruck.jpeg", featured: true, zh: "无人驾驶卡车", en: "Autonomous Truck", ar: "شاحنة ذاتية القيادة",
    zhD: "面向短途与干线货运的无人驾驶卡车，安全高效地完成货物运输。", enD: "Driverless trucks for short-haul and trunk freight — safe and efficient cargo transport.", arD: "شاحنات بدون سائق للنقل القصير والرئيسي — نقل بضائع آمن وفعال.",
    scen: [tri("干线货运", "Trunk Freight", "الشحن الرئيسي"), tri("港口转运", "Port Transfer", "نقل الموانئ")] },
  { slug: "robot-dog", cover: "/image/robodog.jpeg", featured: false, zh: "机器狗", en: "Robot Dog", ar: "الكلب الروبوتي",
    zhD: "四足巡检机器人，适用于安防巡逻、设备巡检与应急场景。", enD: "A quadruped inspection robot for security patrol, equipment inspection and emergency response.", arD: "روبوت فحص رباعي الأرجل لدوريات الأمن وفحص المعدات والطوارئ.",
    scen: [tri("安防巡检", "Security Patrol", "دوريات الأمن"), tri("应急侦察", "Emergency Recon", "استطلاع الطوارئ")] },
  { slug: "service-robot", cover: "/image/robot1.png", images: ["/image/robot2.png"], featured: false, zh: "服务机器人", en: "Service Robot", ar: "روبوت الخدمة",
    zhD: "接待、引导与服务于一体的通用机器人，提升场所服务体验。", enD: "An all-in-one reception, guidance and service robot that elevates venue experience.", arD: "روبوت استقبال وإرشاد وخدمة متكامل يرفع تجربة الزوار.",
    scen: [tri("展厅接待", "Showroom Reception", "استقبال المعارض"), tri("酒店服务", "Hotel Service", "خدمة الفنادق")] },
  { slug: "mobile-charging", cover: "/image/robocharger.jpeg", featured: false, zh: "无人充电车", en: "Mobile Charging Vehicle", ar: "مركبة شحن متنقلة",
    zhD: "移动充电补能车，哪里需要电就开到哪里，解决充电焦虑。", enD: "A mobile charging vehicle that brings power wherever needed, ending range anxiety.", arD: "مركبة شحن متنقلة تجلب الطاقة أينما احتجتها.",
    scen: [tri("停车场补能", "Parking Charging", "شحن المواقف"), tri("应急救援", "Emergency Rescue", "إنقاذ الطوارئ")] },
];

const CASES = [
  { slug: "smart-park-cleaning", zh: "智慧园区无人清扫项目", en: "Smart Park Autonomous Cleaning", ar: "مشروع تنظيف ذاتي لمجمع ذكي",
    client: tri("大型科技园区", "Large Tech Park", "مجمع تقني كبير"), metric: "45%" },
  { slug: "logistics-delivery", zh: "物流园区无人配送项目", en: "Logistics Park Unmanned Delivery", ar: "مشروع توصيل بدون سائق لمجمع لوجستي",
    client: tri("物流仓储企业", "Logistics & Warehousing", "شركة لوجستيات ومستودعات"), metric: "38%" },
  { slug: "mall-service-robot", zh: "商场服务机器人项目", en: "Mall Service Robot Deployment", ar: "مشروع روبوت خدمة لمركز تجاري",
    client: tri("大型商业综合体", "Large Commercial Complex", "مجمع تجاري كبير"), metric: "30%" },
];

const NEWS = [
  { slug: "aiqc-website-launch", zh: "AIQC 官网正式上线", en: "AIQC Official Website Launched", ar: "إطلاق الموقع الرسمي لشركة AIQC",
    zhS: "AIQC 公司官网今日正式上线，全面展示智能设备产品与运营服务能力。", enS: "The AIQC website is now live, showcasing our smart-device products and operations capabilities.", arS: "تم إطلاق موقع AIQC رسمياً اليوم لعرض منتجات الأجهزة الذكية وقدرات التشغيل." },
  { slug: "new-sweeper-arrival", zh: "新一代无人扫地车抵达沙特", en: "New-Generation Autonomous Sweeper Arrives in Saudi", ar: "وصول الجيل الجديد من مركبات الكنس الذاتية إلى السعودية",
    zhS: "新一代无人驾驶扫地车完成本地化调试，即将投入园区运营。", enS: "The new autonomous sweeper has completed local commissioning and is ready for park operations.", arS: "أكملت مركبة الكنس الجديدة التشغيل المحلي وأصبحت جاهزة للتشغيل في المجمعات." },
  { slug: "operations-service-upgrade", zh: "运营服务体系全面升级", en: "Operations Service System Upgraded", ar: "ترقية شاملة لنظام خدمات التشغيل",
    zhS: "AIQC 升级本地运营服务体系，响应更快、维护更专业。", enS: "AIQC has upgraded its local operations system for faster response and more professional maintenance.", arS: "قامت AIQC بترقية نظام التشغيل المحلي لاستجابة أسرع وصيانة أكثر احترافية." },
];

async function main() {
  await db.admin.upsert({
    where: { email: "admin@aiqc.local" },
    update: {},
    create: { email: "admin@aiqc.local", name: "管理员", password: await bcrypt.hash("admin123456", 10) },
  });

  for (const [i, p] of PRODUCTS.entries()) {
    const data = {
      slug: p.slug, cover: p.cover, images: "images" in p && p.images ? p.images : undefined,
      featured: p.featured, isPublished: true, order: i,
      zhTitle: p.zh, enTitle: p.en, arTitle: p.ar,
      zhDesc: p.zhD, enDesc: p.enD, arDesc: p.arD,
      ...body(p.zhD, p.enD, p.arD),
      features: [
        { icon: "Zap", text: tri("全自主导航与避障", "Fully autonomous navigation & obstacle avoidance", "ملاحة ذاتية وتجنب عوائق") },
        { icon: "BatteryCharging", text: tri("长续航，自动回充", "Long range with auto recharging", "مدى طويل وشحن تلقائي") },
        { icon: "ShieldCheck", text: tri("多重安全保障", "Multi-layer safety protection", "حماية سلامة متعددة الطبقات") },
      ],
      specs: [
        { label: tri("工作时长", "Operating Time", "وقت التشغيل"), value: tri("≥ 8 小时（占位）", "≥ 8 h (placeholder)", "≥ 8 ساعات (مؤقت)") },
        { label: tri("导航方式", "Navigation", "طريقة الملاحة"), value: tri("激光雷达 + 视觉融合（占位）", "LiDAR + vision fusion (placeholder)", "ليدار + رؤية (مؤقت)") },
      ],
      scenarios: p.scen,
    };
    // update 同步封面，便于换图后重跑 seed 生效
    await db.product.upsert({
      where: { slug: p.slug },
      update: { cover: p.cover, images: "images" in p && p.images ? p.images : undefined },
      create: data,
    });
  }

  for (const [i, c] of CASES.entries()) {
    const data = {
      slug: c.slug, featured: true, isPublished: true, order: i,
      zhTitle: c.zh, enTitle: c.en, arTitle: c.ar,
      zhClient: c.client.zh, enClient: c.client.en, arClient: c.client.ar,
      zhDesc: `${c.zh}：引入智能设备后运营效率显著提升，人力成本下降 ${c.metric}。（占位案例）`,
      enDesc: `${c.en}: smart devices significantly boosted efficiency and cut labor cost by ${c.metric}. (Placeholder case)`,
      arDesc: `${c.ar}: رفعت الأجهزة الذكية الكفاءة وخفضت تكلفة العمالة بنسبة ${c.metric}. (حالة مؤقتة)`,
      ...body(
        `项目背景与方案：客户引入 AIQC 智能设备与运营服务。成果：综合成本下降 ${c.metric}。`,
        `Background & solution: the client adopted AIQC devices and operations services. Result: overall cost down ${c.metric}.`,
        `الخلفية والحل: اعتمد العميل أجهزة AIQC وخدمات التشغيل. النتيجة: انخفاض التكلفة الإجمالية بنسبة ${c.metric}.`,
      ),
      metrics: [
        { label: tri("成本下降", "Cost Reduction", "خفض التكلفة"), value: c.metric },
        { label: tri("效率提升", "Efficiency Gain", "رفع الكفاءة"), value: "50%" },
      ],
    };
    await db.case.upsert({ where: { slug: c.slug }, update: {}, create: data });
  }

  for (const [i, n] of NEWS.entries()) {
    const data = {
      slug: n.slug, isPublished: true,
      publishDate: new Date(Date.now() - i * 7 * 24 * 3600 * 1000),
      zhTitle: n.zh, enTitle: n.en, arTitle: n.ar,
      zhSummary: n.zhS, enSummary: n.enS, arSummary: n.arS,
      ...body(n.zhS, n.enS, n.arS),
    };
    await db.news.upsert({ where: { slug: n.slug }, update: {}, create: data });
  }

  console.log("种子完成：6 产品 / 3 案例 / 3 新闻 / 管理员 admin@aiqc.local（密码见 README，上线前修改）");
}

main().finally(() => db.$disconnect());
