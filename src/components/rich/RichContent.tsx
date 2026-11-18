import DOMPurify from "isomorphic-dompurify";

/** 富文本渲染：后台 Tiptap 产出的 HTML 先消毒再渲染，防 XSS */
export default function RichContent({ html }: { html?: string | null }) {
  if (!html?.trim()) return null;
  const clean = DOMPurify.sanitize(html);
  return <div className="rich-content" dangerouslySetInnerHTML={{ __html: clean }} />;
}
