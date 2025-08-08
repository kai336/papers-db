import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import TagsInput from "@/components/TagsInput";


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
  interface EditForm extends Partial<Paper> {
    pdf?: File | null;
  }
  const [editForm, setEditForm] = useState<EditForm>({});
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

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
    if (editForm.title) fd.append("title", editForm.title);
    if (editForm.year) fd.append("year", String(editForm.year));
    (editForm.authors ?? []).forEach((a) => fd.append("authors", a));
    (editForm.tags ?? []).forEach((t) => fd.append("tags", t));
    if (editForm.summary) fd.append("summary", editForm.summary);
    if (editForm.pdf) fd.append("pdf", editForm.pdf);

    await fetch(`/api/papers?id=${id}`, {
      method: "PUT",
      body: fd,
    });
    setEditingId(null);
    const updated = await fetch("/api/papers").then((r) => r.json());
    setPapers(updated);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // 削除
  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await fetch(`/api/papers?id=${id}`, { method: 'DELETE' });
    setPapers(prev => prev.filter(paper => paper.id !== id));
  }; 

  // 検索
  const displayedPapers = useMemo(() => {
    return papers
      .filter(p =>
        // AND タグフィルタ
        filterTags.length === 0 || filterTags.every(t => p.tags.includes(t))
      )
      .filter(p => {
        if (!searchText) return true;
        const q = searchText.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.authors.join(" ").toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.join(" ").toLowerCase().includes(q)
        );
      });
  }, [papers, filterTags, searchText]);

  // 全論文からユニークなタグ一覧を抽出
  const uniqueTags = useMemo(() => {
    return Array.from(new Set(papers.flatMap(p => p.tags)));
  }, [papers]);

  // フィルター中？
  const isFiltered = filterTags.length > 0;

  // タグ選択ハンドラ（AND 条件）
  const handleTagToggle = (tag: string, checked: boolean) => {
    setFilterTags((prev) =>
      checked ? [...prev, tag] : prev.filter((t) => t !== tag)
    );
  };

  // 表示UI
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">論文一覧</h1>

      {/* 検索バー */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="タイトル/著者/要約/タグで検索..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* --- タグ絞り込み UI --- */}
      <div className="mb-4">
        <span className="font-medium mr-2">タグで絞り込む:</span>
        {uniqueTags.map((tag) => (
          <label key={tag} className="inline-flex items-center mr-3">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4"
              checked={filterTags.includes(tag)}
              onChange={(e) => handleTagToggle(tag, e.target.checked)}
            />
            <span className="ml-1">{tag}</span>
          </label>
        ))}

        {isFiltered && (
          <button
            className="ml-4 text-sm text-blue-500 underline"
            onClick={() => setFilterTags([])}
          >
            （クリア）
          </button>
        )}
      </div>
      <Link href="/add" className="inline-block text-blue-500 underline mb-4">新規追加</Link>

      <table className="table-fixed w-full border border-blue-900 border-collapse text-sm">
        <colgroup>
          <col className="w-1/4" />        {/* authors 列 = 親幅の1/4 */}
          <col className="w-1/4" />    {/* title 列 = 300px 固定 */}
          <col className="w-1/6" />        {/* tags */}
          <col className="w-1/6" />        {/* summary */}
          <col className="w-1/15" />         {/* pdf */}
          <col className="w-1/15" />         {/* 操作ボタン列 */}
        </colgroup>

        <thead>
          <tr>
            <th className="border border-blue-900 p-2">title</th>
            <th className="border border-blue-900 p-2 pr-0">author</th>
            <th className="border border-blue-900 p-2">tag</th>
            <th className="border border-blue-900 p-2">summary</th>
            <th className="border border-blue-900 p-2">pdf</th>
            <th className="border border-blue-900 p-2"></th>
          </tr>
        </thead>

        <tbody>
          {displayedPapers.map((p) =>
            editingId === p.id ? (
              <tr key={p.id}>
                {/* タイトル */}
                <td className="border border-blue-900 p-2 pr-0">
                  <input
                    className="border p-1 w-full"
                    value={editForm.title ?? ""}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </td>
                {/* 著者 */}
                <td className="border border-blue-900 p-2">
                  {/* TagsInput が className を受け付けない場合は wrapper を w-full に */}
                  <TagsInput
                    className="w-full"
                    label=""
                    values={editForm.authors ?? []}
                    setValues={vals => setEditForm({ ...editForm, authors: vals })}
                  />
                </td>
                {/* タグ */}
                <td className="border border-blue-900 p-2">
                  <TagsInput
                    className="w-full"
                    label=""
                    values={editForm.tags ?? []}
                    setValues={vals => setEditForm({ ...editForm, tags: vals })}
                  />
                </td>

                {/* 要約 */}
                <td className="border border-blue-900 p-2">
                  <Link href={`/papers/${p.id}`} className="text-blue-600 underline hover:text-blue-800">
                    ノートを開く
                  </Link>
                </td>

                {/* PDF */}
                <td className="border p-2 text-center">
                  {p.pdfPath && !editForm.pdf && (
                    <a
                      href={`/${p.pdfPath}`}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      現在のPDF
                    </a>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        pdf: e.target.files?.[0] || null,
                      }))
                    }
                    className="mt-1"
                  />
                  {editForm.pdf && (
                    <div className="text-xs text-gray-600 mt-1">
                      {editForm.pdf.name}
                    </div>
                  )}
                </td>

                {/* 操作 */}
                <td className="border border-blue-900 p-2 space-y-1">
                  <button
                    onClick={() => saveEdit(p.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                  >
                    保存
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-blue-500 text-white px-3 py-1 rounded w-full"
                  >
                    キャンセル
                  </button>
                </td>
                
              </tr>
            ) : (
              <tr key={p.id}>
                <td className="border border-blue-900 p-2 pr-0 break-all whitespace-normal">
                  {p.title}
                </td>

                <td className="border border-blue-900 p-2">{p.authors.join(", ")}</td>

                <td className="border border-blue-900 p-2">
                  {p.tags.join(", ")}
                </td>

                <td className="border border-blue-900 p-2">
                  <Link href={`/papers/${p.id}`} className="text-blue-600 underline hover:text-blue-800">
                    ノートを開く
                  </Link>
                </td>

                <td className="border border-blue-900 p-2">
                  {p.pdfPath && (
                    <a
                      href={p.pdfPath.replace(/^\/public/, "")}
                      target="_blank"
                      className="text-blue-500 underline"
                    >PDF</a>
                  )}
                </td>

                <td className="border border-blue-900 p-2 space-y-1">
                  <button onClick={() => startEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded w-full">編集</button>
                  <button onClick={() => handleDelete(p.id)} className="bg-blue-500 text-white px-3 py-1 rounded w-full">削除</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );

}
