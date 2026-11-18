"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { AdminDict } from "@/i18n/admin";
import { inputCls } from "./fields";

async function upload(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: form });
  if (!res.ok) throw new Error("upload failed");
  return (await res.json()).url as string;
}

/** 图片上传：本地上传到 public/uploads 或粘贴 URL；支持单图(cover)与多图 */
export function CoverUploader({ value, onChange, dict }: { value: string; onChange: (v: string) => void; dict: AdminDict }) {
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex items-start gap-3">
      {value && <Image src={value} alt="" width={160} height={100} className="h-20 w-32 rounded-lg border object-cover" />}
      <div className="flex-1 space-y-2">
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={dict.imageUrlPlaceholder} />
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50">
          <Upload size={14} /> {busy ? dict.uploading : dict.upload}
          <input
            type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setBusy(true);
              try { onChange(await upload(f)); } finally { setBusy(false); }
            }}
          />
        </label>
      </div>
    </div>
  );
}

export function ImagesUploader({ value, onChange, dict }: { value: string[]; onChange: (v: string[]) => void; dict: AdminDict }) {
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState("");
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((src, i) => (
          <span key={src + i} className="relative">
            <Image src={src} alt="" width={140} height={90} className="h-20 w-32 rounded-lg border object-cover" />
            <button type="button" onClick={() => onChange(value.filter((_, idx) => idx !== i))} className="absolute -end-2 -top-2 rounded-full bg-red-600 p-0.5 text-white">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          className={`${inputCls} max-w-xs`} value={url} placeholder={dict.imageUrlPlaceholder}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && url.trim()) { e.preventDefault(); onChange([...value, url.trim()]); setUrl(""); } }}
        />
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50">
          <Upload size={14} /> {busy ? dict.uploading : dict.upload}
          <input
            type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []);
              if (!files.length) return;
              setBusy(true);
              try { onChange([...value, ...(await Promise.all(files.map(upload)))]); } finally { setBusy(false); }
            }}
          />
        </label>
      </div>
    </div>
  );
}
