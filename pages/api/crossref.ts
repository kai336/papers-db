// pages/api/crossref.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.query;
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ error: "title パラメータを指定してください" });
  }

  const apiUrl = `https://api.crossref.org/works?query.title=${encodeURIComponent(title)}&rows=1`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const item = data.message.items?.[0];
    if (!item) {
      return res.status(404).json({ error: "該当する論文が見つかりませんでした" });
    }

    // 日付から年を抜き出し
    const pubParts = item["published-print"]?.["date-parts"]?.[0]
      ?? item.issued?.["date-parts"]?.[0];
    const year = Array.isArray(pubParts) ? String(pubParts[0]) : "";

    const metadata = {
      title:     item.title?.[0]           ?? "",
      authors:   item.author?.map((a: any) => `${a.family} ${a.given}`) ?? [],
      abstract:  item.abstract             ?? "",
      doi:       item.DOI                  ?? "",
      year,                                    // 上で取った年
      journal:   item["container-title"]?.[0] ?? "",
      publisher: item.publisher             ?? "",
      pages:     item.page                  ?? "",
      url:       item.URL                   ?? "",
      type:      item.type                  ?? "",
      refCount:  item["reference-count"]    ?? 0,
    };

    // デバッグログ
    console.log("crossref metadata:", metadata);

    res.status(200).json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Crossref API の呼び出しに失敗しました" });
  }
}
