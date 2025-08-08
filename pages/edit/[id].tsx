import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TagsInput from "@/components/TagsInput"; // 使っているなら

export default function EditPaper() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: "",
    year: "",
    summary: "",
    pdf: null as File | null,
  });
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 既存データ取得
  useEffect(() => {
    if (id) {
      fetch(`/api/papers?id=${id}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            title: data.title,
            year: data.year,
            summary: data.summary,
            pdf: null, // 既存PDFは上書き時のみ
          });
          setAuthors(data.authors || []);
          setTags(data.tags || []);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, pdf: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("year", form.year);
    fd.append("summary", form.summary);
    authors.forEach(a => fd.append("authors[]", a));
    tags.forEach(t => fd.append("tags[]", t));
    if (form.pdf) fd.append("pdf", form.pdf);

    await fetch(`/api/papers?id=${id}`, {
      method: "PUT",
      body: fd,
    });
    router.push("/");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-blue-500 underline mb-4 block">
        ← 一覧に戻る
      </Link>
      <h1 className="text-2xl font-bold mb-6">論文編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="タイトル"
          className="border rounded p-2 w-full"
        />
        <TagsInput label="著者" values={authors} setValues={setAuthors} />
        <input
          name="year"
          value={form.year}
          onChange={handleChange}
          placeholder="出版年"
          className="border rounded p-2 w-full"
        />
        <TagsInput label="タグ" values={tags} setValues={setTags} />
        <textarea
          name="summary"
          value={form.summary}
          onChange={handleChange}
          placeholder="要約"
          className="border rounded p-2 w-full"
        />
        <input type="file" onChange={handleFile} className="block" />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
