// pages/papers/[id].tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

type Paper = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  tags: string[];
  summary: string;
  pdfPath: string;
};

type Props = { paper: Paper };

export default function PaperDetail({ paper }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(paper.summary);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", paper.title);
      fd.append("year", String(paper.year));
      paper.authors.forEach(a => fd.append("authors", a));
      paper.tags.forEach(t => fd.append("tags", t));
      fd.append("summary", editedSummary);

      const res = await fetch(`/api/papers?id=${paper.id}`, {
        method: "PUT",
        body: fd,
      });
      if (!res.ok) throw new Error();
      setIsEditing(false);
      router.replace(router.asPath);
    } catch {
      alert("更新エラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prose lg:prose-xl mx-auto p-6">
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 一覧に戻る
      </Link>

      <h1>{paper.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {paper.authors.join(", ")} ({paper.year})
      </p>
      <div className="mb-4">
        {paper.tags.map(t => (
          <span
            key={t}
            className="inline-block bg-blue-200 px-2 py-1 rounded mr-1 text-xs"
          >
            {t}  
          </span>
        ))}
      </div>

      {paper.pdfPath && (
        <div className="mt-4">
          <a
            href={`/${paper.pdfPath}`}
            target="_blank"
            className="text-blue-500 underline"
          >
            PDFを開く
          </a>
        </div>
      )}

      <h2>Summary</h2>
        <button
            onClick={() => setIsEditing(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
            編集
        </button>
      <div className="mt-6">
        {isEditing ? (
          <>
            {/* ライブプレビュー */}
            <div className="flex gap-4 h-[80vh]">
              {/* エディタ側 */}
              <textarea
                value={editedSummary}
                onChange={e => setEditedSummary(e.target.value)}
                className="flex-1 h-full p-4 border rounded resize-none"
              />

              {/* プレビュ―側 */}
              <div className="flex-1 h-full overflow-auto p-4 border rounded prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {editedSummary}
                </ReactMarkdown>
              </div>
            </div>

            {/* 保存 / キャンセル */}
            <div className="mt-4 space-x-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {loading ? "保存中…" : "保存"}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedSummary(paper.summary);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                キャンセル
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 読み取りモード */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {paper.summary}
            </ReactMarkdown>
          </>
        )}
      </div>
    </div>
  );
}

// SSR 部分は既存の getServerSideProps をそのまま使ってください



// SSR でデータをフェッチ
export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params!;
  const res = await fetch(`http://localhost:3000/api/papers?id=${id}`);
  
  if (!res.ok) {
    return { notFound: true };
  }
  
  const data: Paper = await res.json();
  const paper = Array.isArray(data) ? data[0] : data;
  
  if(!paper) {
    return { notFound: true };
  }

  return { props: { paper } };
};
