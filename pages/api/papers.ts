import { PrismaClient } from "@prisma/client";
import multer from "multer";
import nextConnect from "next-connect";
import path from "path";

// --- Utility functions ---
function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9-_]/g, "_");
}
function toHalfWidth(str: string): string {
  return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}
function createStorage() {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/uploads"),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const base = sanitizeFileName(path.basename(file.originalname, ext));
      cb(null, `${base}_${timestamp}${ext}`);
    }
  });
}

// --- Initialization ---
const prisma = new PrismaClient();
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/uploads"),
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
      cb(null, `${base}_${timestamp}${ext}`);
    }
  })
});

const parseFieldArray = (field: any) => {
  if (Array.isArray(field)) return field;
  if (typeof field === "string") return [field];
  return [];
};

// --- API Route ---
const apiRoute = nextConnect({
  onError(error, req, res) {
    console.error("API error:", error);
    res.status(501).json({ error: `Error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

apiRoute.use(upload.fields([
  { name: "pdf", maxCount: 1 },
  { name: "authors", maxCount: 20 },
  { name: "tags", maxCount: 20 }
]));

apiRoute.get(async (req, res) => {
  try {
    const papers = await prisma.paper.findMany({ orderBy: { createdAt: "desc" } });
    res.json(papers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "DB取得エラー" });
  }
});

apiRoute.post(async (req, res) => {
  try {
    console.log("req.body: ", req.body);
    //console.log("authors[] in req.body:", req.body["authors[]"]);
    const { title, year, summary } = req.body;
    let authors = req.body["authors"];
    let tags = req.body["tags"];
    
    if (typeof authors === "string") authors = [authors];
    if (!Array.isArray(authors)) authors = [];
    if (typeof tags === "string") tags = [tags];
    if (!Array.isArray(tags)) tags = [];

    const yearNum = Number(toHalfWidth(String(year)));
    if (!yearNum) return res.status(400).json({ error: "yearは必須です" });
    
    const pdfFile = req.files?.pdf?.[0];
    const pdfPath = pdfFile ? `uploads/${pdfFile.filename}` : "";
    const originalName = pdfFile ? pdfFile.originalname : "";


    const paper = await prisma.paper.create({
    data: {
      title,
      authors,
      year: yearNum,
      tags,
      summary,
      pdfPath,
      originalName,
      createdAt: new Date(),   // ← ここで付与
    },
    });
    console.log(paper);
    res.json(paper);
  } catch (error) {
    console.error("登録失敗", error);
    res.status(500).json({ error: "登録失敗" });
  }
});

apiRoute.delete(async (req, res) => {
  const id = String(req.query.id);
  if (!id) return res.status(400).json({ error: "ID is required" });
  try {
    await prisma.paper.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(404).json({ error: "削除失敗" });
  }
});

apiRoute.put(async (req, res) => {
  try {
    const id = String(req.query.id);
    console.log("PUT req.body: ", req.body);
    // FormData同様にパース
    const { title, year, summary } = req.body;
    const authors = parseFieldArray(req.body.authors);
    const tags = parseFieldArray(req.body.tags);
    const yearNum = Number(year);
    const pdfFile = req.files?.pdf?.[0];
    const pdfPath = pdfFile ? `uploads/${pdfFile.filename}` : undefined;

    const updateData: any = {
      title, year: yearNum, summary, authors, tags,
    };
    if (pdfPath) updateData.pdfPath = pdfPath;

    const updated = await prisma.paper.update({
      where: { id },
      data: updateData,
    });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "更新失敗" });
  }
});


export default apiRoute;

export const config = {
  api: { bodyParser: false },
};
