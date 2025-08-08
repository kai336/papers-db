import { useState } from "react";
import { useRouter } from "next/router";
import TagsInput from "../components/TagsInput";
import { TitleFetcher , CrossrefMeta } from "@/components/TitleFetcher";
import Link from "next/link";

export default function AddPaper() {
  const router = useRouter();

  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [form, setForm] = useState<{
    title: string;
    year: string;
    summary: string;
    pdf: File | null;
  }>({
    title: "",
    year: "",
    summary: "",
    pdf: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, pdf: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("year", form.year);
    fd.append("summary", form.summary);
    authors.forEach(a => fd.append("authors[]", a));
    tags.forEach(t => fd.append("tags[]", t));
    if (form.pdf) fd.append("pdf", form.pdf);

    try {
      await fetch("/api/papers", { method: "POST", body: fd });
      router.push("/");
    } catch (e) {
      alert("登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  // TitleFetcher からのコールバック
  const handleCrossref = (meta: CrossrefMeta) => {
    setForm(f => ({
      ...f,
      title:     meta.title,
      year:      meta.year,
      summary:   meta.abstract,
      //doi:       meta.doi,
      //journal:   meta.journal,
      //publisher: meta.publisher,
      //pages:     meta.pages,
      //url:       meta.url,
    }));
    setAuthors(meta.authors);
    setTags([meta.type, meta.publisher])
  };


  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 一覧に戻る
      </Link>
      
      <h1 className="text-2xl font-bold mb-6">論文登録</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {/* ─── タイトルからCrossrefで自動取得 ─── */}
        <TitleFetcher onFetch={handleCrossref} />
        <input
          name="title"
          value={form.title}
          placeholder="タイトル"
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <TagsInput label="著者（Enterで追加）" values={authors} setValues={setAuthors} />
        <input
          name="year"
          value={form.year}
          placeholder="出版年"
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <TagsInput label="タグ（Enterで追加）" values={tags} setValues={setTags} />
        <textarea
          name="summary"
          value={form.summary}
          placeholder="要約"
          onChange={handleChange}
          className="border rounded p-2 w-full"
        />
        <input type="file" onChange={handleFile} className="block" />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
