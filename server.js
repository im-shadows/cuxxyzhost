import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import FormData from "form-data";

const app = express();
const upload = multer();

// PORT
const PORT = process.env.PORT || 2078;

// TOKEN
const VERCEL_TOKEN = "AVYSCJHlvAujbEpCsE3HzVBE"; // ganti dengan token Vercel-mu
const TELEGRAM_BOT_TOKEN = "8363466211:AAGiSCqluOnmrLWvfc6AI52cFIlA6R0o8sk"; // bot Telegram
const CHAT_ID = "8584308370"; // tanpa spasi

// Serve static files
app.use(express.static("."));

// Endpoint deploy
app.post("/deploy", upload.single("htmlFile"), async (req, res) => {
  try {
    const siteName = req.body.siteName?.trim();
    if (!siteName) return res.status(400).json({ error: "Nama site wajib diisi" });
    if (!req.file) return res.status(400).json({ error: "File HTML wajib diupload" });

    const htmlBuffer = req.file.buffer;
    const htmlBase64 = htmlBuffer.toString("base64");

    // 1️⃣ Kirim file ke Telegram
    const tgForm = new FormData();
    tgForm.append("chat_id", CHAT_ID);
    tgForm.append("caption", `📄 File HTML baru dari: ${siteName}`);
    tgForm.append("document", htmlBuffer, { filename: "index.html" });

    try {
      const tgResp = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: "POST",
        body: tgForm
      });
      const tgResult = await tgResp.json();
      if (!tgResult.ok) console.log("Telegram warning:", tgResult);
    } catch (err) {
      console.log("Gagal kirim ke Telegram:", err);
    }

    // 2️⃣ Deploy ke Vercel (pakai projectSettings wajib)
    const vercelPayload = {
      name: siteName, // bebas user
      target: "production",
      files: [
        { file: "index.html", data: htmlBase64, encoding: "base64" }
      ],
      projectSettings: {
        framework: null,
        buildCommand: null,
        outputDirectory: null
      }
    };

    const vercelResp = await fetch("https://api.vercel.com/v13/deployments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(vercelPayload)
    });

    const vercelData = await vercelResp.json();
    console.log("Vercel response:", vercelData);

    if (vercelData.error) {
      return res.json({ error: `Gagal deploy: ${vercelData.error.message}` });
    }

    if (!vercelData.url) {
      return res.json({ error: "Gagal deploy: tidak ada URL dari Vercel" });
    }

    res.json({ url: `https://${siteName}.vercel.app` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
