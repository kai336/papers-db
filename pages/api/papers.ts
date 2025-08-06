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
const upload = multer({ storage: createStorage() });

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

apiRoute.use(upload.single("pdf"));

apiRoute.get(async (req, res) => {
  try {
    const papers = await prisma.paper.findMany({ orderBy: { createdAt: "desc" } });
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: "DB取得エラー" });
  }
});

apiRoute.post(async (req, res) => {
  try {
    const { title, author, year, tags, summary } = req.body;
    const yearNum = Number(toHalfWidth(String(year)));
    if (!yearNum) return res.status(400).json({ error: "yearは必須です" });
    const pdfPath = req.file ? `uploads/${req.file.filename}` : "";
    const originalName = req.file ? req.file.originalname : "";
    const paper = await prisma.paper.create({
      data: { title, author, year: yearNum, tags, summary, pdfPath, originalName },
    });
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: "登録失敗" });
  }
});

apiRoute.delete(async (req, res) => {
  const id = Number(req.query.id);
  if (!id) return res.status(400).json({ error: "ID is required" });
  try {
    await prisma.paper.delete({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(404).json({ error: "削除失敗" });
  }
});

export default apiRoute;

export const config = {
  api: { bodyParser: false },
};
