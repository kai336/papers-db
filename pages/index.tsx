import Link from "next/link";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetch("/api/papers")
      .then((res) => res.json())
      .then(setPapers);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    await fetch(`/api/papers?id=${id}`, { method: 'DELETE' });
    setPapers(prev => prev.filter(paper => paper.id !== id));
  };



  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">論文一覧</h1>
      <Link href="/add" className="text-blue-500 underline">
        新規追加
      </Link>
      <ul className="mt-4">
        {papers.map((p) => (
          <li key={p.id} className="border-b py-2">
            {Array.isArray(p.authors) ? p.authors.join(", ") : p.authors} ({p.year}). "{p.title}". 
            <div>{Array.isArray(p.tags) ? p.tags.join(", ") : p.tags}</div>
            <p className="text-sm">{p.summary}</p>
            <button
              onClick={async () => handleDelete(p.id)}
              className="text-red-500"
            >
              削除
            </button>

            {p.pdfPath && (
              <a
                href={p.pdfPath.replace(/^\/public/, "")}
                target="_blank"
                className="text-blue-500 underline"
              >
                PDFを見る
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
