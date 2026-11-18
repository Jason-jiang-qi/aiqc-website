"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, ImagePlus, Undo, Redo } from "lucide-react";

/** Tiptap 富文本编辑器：标题/列表/引用/图片/链接（需求 §6.3） */
export default function RichTextEditor({
  value, onChange, dir = "ltr",
}: {
  value: string;
  onChange: (html: string) => void;
  dir?: "ltr" | "rtl";
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: value || "",
    editorProps: { attributes: { dir, class: "min-h-40 px-3 py-2 text-sm leading-7 text-zinc-900 outline-none [&_h2]:text-xl [&_h2]:font-bold [&_ul]:list-disc [&_ul]:ps-5 [&_ol]:list-decimal [&_ol]:ps-5 [&_blockquote]:border-s-2 [&_blockquote]:ps-3 [&_blockquote]:text-zinc-500" } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  async function insertImage(file: File) {
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    if (res.ok) {
      const { url } = await res.json();
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  if (!editor) return <div className="min-h-40 rounded-md border border-zinc-300" />;
  const btn = "rounded p-1.5 hover:bg-zinc-100 text-zinc-600";
  return (
    <div className="rounded-md border border-zinc-300 bg-white focus-within:border-cyan-600">
      <div className="flex flex-wrap gap-0.5 border-b border-zinc-200 p-1.5">
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={15} /></button>
        <label className={`${btn} cursor-pointer`}>
          <ImagePlus size={15} />
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && insertImage(e.target.files[0])} />
        </label>
        <button type="button" className={btn} onClick={() => editor.chain().focus().undo().run()}><Undo size={15} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().redo().run()}><Redo size={15} /></button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
