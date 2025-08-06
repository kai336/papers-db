import { useState } from "react";
import { useRouter } from "next/router";
import TagsInput from "./TagsInput";

export default function AddPaper() {
  const router = useRouter();

  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    year: "",
    summary: "",
    pdf: null as File | null,
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
    console.log("authors:", authors);
    authors.forEach(a => fd.append("authors[]", a));
    tags.forEach(t => fd.append("tags[]", t));
    if (form.pdf) fd.append("pdf", form.pdf);

    console.log("fd.getAll(\"authors[]\"): ", fd.getAll("authors[]"));

    try {
      await fetch("/api/papers", { method: "POST", body: fd });
      router.push("/");
    } catch (e) {
      alert("登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">論文登録</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="タイトル" onChange={handleChange} className="border p-2 w-full" />
        <TagsInput label="著者（Enterで追加）" values={authors} setValues={setAuthors} />
        <input name="year" placeholder="出版年" onChange={handleChange} className="border p-2 w-full" />
        <TagsInput label="タグ（Enterで追加）" values={tags} setValues={setTags} />
        <textarea name="summary" placeholder="要約" onChange={handleChange} className="border p-2 w-full" />
        <input type="file" onChange={handleFile} />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`... ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "登録中..." : "登録"}
        </button>
      </form>
    </div>
  );
}
