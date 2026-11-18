import Link from "next/link";
import type { AdminDict } from "@/i18n/admin";
import { deleteItem, togglePublish } from "@/app/admin/(dashboard)/actions";

type Kind = "products" | "news" | "cases";
type Item = { id: string; title: string; isPublished: boolean; updatedAt: Date };

/** 后台三大模块共用列表：发布状态、上下架、编辑、删除 */
export default function AdminList({ kind, heading, items, dict }: { kind: Kind; heading: string; items: Item[]; dict: AdminDict }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{heading}</h1>
        <Link href={`/admin/${kind}/new`} className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white">+ {dict.create}</Link>
      </div>
      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed bg-white p-10 text-center text-zinc-400">{dict.empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-zinc-50 text-start">
              <tr>
                <th className="px-4 py-3 text-start">{dict.title}</th>
                <th className="px-4 py-3 text-start">{dict.status}</th>
                <th className="px-4 py-3 text-start">{dict.updatedAt}</th>
                <th className="px-4 py-3 text-start">{dict.actions}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${item.isPublished ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      {item.isPublished ? dict.published : dict.draft}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500">{item.updatedAt.toLocaleDateString("zh-CN")}</td>
                  <td className="px-4 py-3">
                    <span className="flex gap-3">
                      <Link href={`/admin/${kind}/${item.id}`} className="text-cyan-700 hover:underline">{dict.edit}</Link>
                      <form action={togglePublish.bind(null, kind, item.id, !item.isPublished)}>
                        <button className="text-zinc-600 hover:underline">{item.isPublished ? dict.unpublish : dict.publish}</button>
                      </form>
                      <form action={deleteItem.bind(null, kind, item.id)}>
                        <button className="text-red-600 hover:underline">{dict.delete}</button>
                      </form>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
