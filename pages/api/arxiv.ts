// /pages/api/arxiv.ts
import type { NextApiRequest, NextApiResponse } from "next";
import xml2js from "xml2js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "arXiv ID is required" });
  }

  const apiUrl = `http://export.arxiv.org/api/query?search_query=id:${encodeURIComponent(id)}&max_results=1`;
  const xml = await fetch(apiUrl).then(r => r.text());
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false });

  try {
    const entry = parsed.feed.entry;
    const metadata = {
      title: entry.title.trim().replace(/\s+/g, " "),
      authors: Array.isArray(entry.author)
        ? entry.author.map((a: any) => a.name)
        : [entry.author.name],
      summary: entry.summary.trim(),
      published: entry.published,
      link: entry.id,
    };
    res.status(200).json(metadata);
  } catch (e) {
    res.status(500).json({ error: "Failed to parse arXiv response" });
  }
}
