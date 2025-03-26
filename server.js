const express = require("express");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

app.post("/fill-pdf", async (req, res) => {
  const { name, date } = req.body;

  const pdfBytes = fs.readFileSync(path.join(__dirname, "5-1.pdf"));
  const fontBytes = fs.readFileSync(path.join(__dirname, "Manrope-Medium.ttf"));

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(fontBytes);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText(name, {
    x: 100,
    y: 500,
    size: 18,
    font,
    color: rgb(0.2, 0.2, 0.7),
  });

  firstPage.drawText(date, {
    x: 100,
    y: 470,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  const finalPdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.send(Buffer.from(finalPdfBytes));
});

app.listen(3000, () => {
  console.log("PDF filler running on port 3000");
});
