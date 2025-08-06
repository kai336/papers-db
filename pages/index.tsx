import Link from "next/link";
import { useEffect, useState } from "react";
import TagsInput from "./TagsInput"; // ← これ必要！

type Paper = {
  id: string;
  title: string;
  authors: string[];
  year: number;
  tags: string[];
  summary: string;
  pdfPath: string;
};

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Paper>>({});

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then(setPapers);
  }, []);

  // 編集開始
  const startEdit = (paper: Paper) => {
    setEditingId(paper.id);
    setEditForm({ ...paper });
  };

  // 編集確定
  const saveEdit = async (id: string) => {
    const fd = new FormData();
    fd.append("title", editForm.title);
    fd.append("year", editForm.year);
    editForm.authors.forEach((a: string) => fd.append("authors", a));
    editForm.tags.forEach((t: string) => fd.append("tags", t));
    fd.append("summary", editForm.summary);
    if (editForm.pdf) fd.append("pdf", editForm.pdf); // 画像差し替え時のみ

    await fetch(`/api/papers?id=${id}`, {
      method: "PUT",
      body: fd,
      // Content-Typeは書かない
    });
    setEditingId(null);
    // 一覧再取得
    const updated = await fetch("/api/papers").then(r => r.json());
    setPapers(updated);
  };

  // 編集キャンセル
  const cancelEdit = () => setEditingId(null);

  // 表示UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">論文一覧</h1>
      <Link href="/add" className="text-blue-500 underline">新規追加</Link>
      <ul className="mt-4">
        {papers.map((p) => (
          <li key={p.id} className="border-b py-2">
            {editingId === p.id ? (
              <div>
                {/* タイトル */}
                <input
                  value={editForm.title || ""}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className="border px-2"
                />
                {/* 著者 */}
                <TagsInput
                  label="著者"
                  values={editForm.authors || []}
                  setValues={vals => setEditForm({ ...editForm, authors: vals })}
                />
                {/* タグ */}
                <TagsInput
                  label="タグ"
                  values={editForm.tags || []}
                  setValues={vals => setEditForm({ ...editForm, tags: vals })}
                />
                <button onClick={() => saveEdit(p.id)}>保存</button>
                <button onClick={cancelEdit}>キャンセル</button>
              </div>
            ) : (
              <div>
                <span>{p.authors.join(", ")} </span>
                <span>({p.year}) . </span>
                <span>"{p.title}"</span>
                <div><span>{p.tags.join(", ")}</span></div>
                <div>
                  <button onClick={() => startEdit(p)} className="ml-2">編集</button>
                  <button onClick={() => handleDelete(p.id)} className="ml-2 text-red-500">削除</button>
                </div>
                {p.pdfPath && (
                  <a
                    href={p.pdfPath.replace(/^\/public/, "")}
                    target="_blank"
                    className="ml-2 text-blue-500 underline"
                  >PDFを見る</a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
