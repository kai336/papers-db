import { PrismaClient } from "@prisma/client";
import multer from "multer";
import nextConnect from "next-connect";
import path from "path";

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    // オリジナル名＋タイムスタンプで保存（重複防止）
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // .pdfなど
    // ファイル名をサニタイズ（日本語などの問題や記号対策）
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    cb(null, `${base}_${timestamp}${ext}`);
  }
});
const upload = multer({ storage });

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
  const papers = await prisma.paper.findMany({ orderBy: { createdAt: "desc" } });
  res.json(papers);
});

apiRoute.post(async (req, res) => {
  const { title, author, year, tags, summary } = req.body;
  const pdfPath = req.file ? `uploads/${req.file.filename}` : "";
  // オリジナルファイル名も保存したい場合
  const originalName = req.file ? req.file.originalname : "";
  const paper = await prisma.paper.create({
    data: { title, author, year: Number(year), tags, summary, pdfPath, originalName },
  });
  res.json(paper);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
