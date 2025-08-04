import { useEffect, useState } from "react";

type Paper = {
  id: number;
  title: string;
  author: string;
  year: number;
  tags: string;
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">論文一覧</h1>
      <a href="/add" className="text-blue-500 underline">
        新規追加
      </a>
      <ul className="mt-4">
        {papers.map((p) => (
          <li key={p.id} className="border-b py-2">
            <strong>{p.title}</strong> ({p.year}) - {p.author}
            <p className="text-sm">{p.summary}</p>
            {p.pdfPath && (
              <a
                href={p.pdfPath.replace("./", "/")}
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
