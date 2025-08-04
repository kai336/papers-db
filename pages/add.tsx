import { useState } from "react";
import { useRouter } from "next/router";

export default function AddPaper() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    tags: "",
    summary: "",
    pdf: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, pdf: e.target.files?.[0] || null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("author", form.author);
    fd.append("year", form.year);
    fd.append("tags", form.tags);
    fd.append("summary", form.summary);
    if (form.pdf) fd.append("pdf", form.pdf);

    await fetch("/api/papers", { method: "POST", body: fd });
    router.push("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">論文登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="タイトル" onChange={handleChange} className="border p-2 w-full" />
        <input name="author" placeholder="著者" onChange={handleChange} className="border p-2 w-full" />
        <input name="year" placeholder="出版年" onChange={handleChange} className="border p-2 w-full" />
        <input name="tags" placeholder="タグ（カンマ区切り）" onChange={handleChange} className="border p-2 w-full" />
        <textarea name="summary" placeholder="要約" onChange={handleChange} className="border p-2 w-full" />
        <input type="file" onChange={handleFile} />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          登録
        </button>
      </form>
    </div>
  );
}
