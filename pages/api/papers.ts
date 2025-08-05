import { PrismaClient } from "@prisma/client";
import multer from "multer";
import nextConnect from "next-connect";

const prisma = new PrismaClient();
const upload = multer({ dest: "./uploads" });

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Error: ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  },
});

apiRoute.use(upload.single("pdf"));

apiRoute.get(async (req, res) => {
  const papers = await prisma.paper.findMany({ orderBy: { createdAt: "desc" } });
  console.log(papers);
  res.json(papers);
});

apiRoute.post(async (req, res) => {
  const { title, author, year, tags, summary } = req.body;
  const pdfPath = req.file ? req.file.path : "";
  const paper = await prisma.paper.create({
    data: { title, author, year: Number(year), tags, summary, pdfPath },
  });
  res.json(paper);
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false,
  },
};
