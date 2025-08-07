// components/TitleFetcher.tsx
import { useState } from "react";

export interface CrossrefMeta {
  title: string;
  authors: string[];
  abstract: string;
  doi: string;
  year: string;
  journal: string;
  publisher: string;
  pages: string;
  url: string;
  type: string;
  refCount: number;
}

export function TitleFetcher({
  onFetch,
}: {
  onFetch: (meta: CrossrefMeta) => void;
}) {
  const [title, setTitle]   = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMeta = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/crossref?title=${encodeURIComponent(title)}`);
      if (!res.ok) throw new Error();
      const meta: CrossrefMeta = await res.json();
      onFetch(meta);
    } catch {
      alert("メタデータの取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <input
        type="text"
        placeholder="論文タイトルを入力してメタデータ自動取得できます"
        className="border p-2 flex-1"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), fetchMeta())}
      />
      <button
        onClick={fetchMeta}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "取得中…" : "検索"}
      </button>
    </div>
  );
}
