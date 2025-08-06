import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import TagsInput from "../TagsInput"; // 使っているなら

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
    <form onSubmit={handleSubmit}>
      <input name="title" value={form.title} onChange={handleChange} />
      {/* ...省略: 年・要約・ファイルなど、追加 */}
      <TagsInput label="著者" values={authors} setValues={setAuthors} />
      <TagsInput label="タグ" values={tags} setValues={setTags} />
      {/* ... */}
      <button type="submit" disabled={isSubmitting}>保存</button>
    </form>
  );
}
