import { db } from "@/lib/db";
import { getAdminDict } from "@/i18n/admin";
import { setMessageHandled, deleteMessage } from "../actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const { t } = await getAdminDict();
  const messages = await db.message.findMany({ orderBy: { createdAt: "desc" } });
  const products = Object.fromEntries(
    (await db.product.findMany({ select: { slug: true, zhTitle: true } })).map((p) => [p.slug, p.zhTitle]),
  );
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t.messages}（{messages.length}）</h1>
        {/* CSV 文件下载接口，非页面导航，必须用原生 a 标签 */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/admin/messages/export" className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">{t.exportCsv}</a>
      </div>
      {messages.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-white p-10 text-center text-zinc-400">{t.empty}</p>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <article key={m.id} className="rounded-xl border bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  {m.name} <span className="text-sm font-normal text-zinc-500">{m.contact}{m.company ? ` · ${m.company}` : ""}</span>
                  {m.product && <span className="ms-2 rounded bg-cyan-50 px-2 py-0.5 text-xs text-cyan-700">{products[m.product] ?? m.product}</span>}
                </p>
                <time className="text-xs text-zinc-400">{m.createdAt.toLocaleString("zh-CN")}</time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-700">{m.content}</p>
              <div className="mt-3 flex items-center gap-2 text-xs">
                <span className={`rounded px-2 py-1 ${m.isHandled ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {m.isHandled ? t.handled : t.pending}
                </span>
                <form action={setMessageHandled.bind(null, m.id, !m.isHandled)}>
                  <button className="rounded bg-zinc-100 px-2 py-1 hover:bg-zinc-200">{m.isHandled ? t.markPending : t.markHandled}</button>
                </form>
                <form action={deleteMessage.bind(null, m.id)}>
                  <button className="rounded bg-red-50 px-2 py-1 text-red-600 hover:bg-red-100">{t.delete}</button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
