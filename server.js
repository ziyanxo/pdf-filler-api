// server.js
const express = require("express");
const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fs = require("fs");
const app = express();
app.use(express.json());

app.post("/fill-pdf", async (req, res) => {
  const { name, date } = req.body;

  const existingPdfBytes = fs.readFileSync("5-1.pdf");
  const customFont = fs.readFileSync("fonts/manrope-medium.ttf");

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const font = await pdfDoc.embedFont(customFont);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  firstPage.drawText(name, {
    x: 100,
    y: 500,
    size: 18,
    font: font,
    color: rgb(0.1, 0.2, 0.6),
  });

  firstPage.drawText(date, {
    x: 100,
    y: 470,
    size: 14,
    font: font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  res.setHeader("Content-Type", "application/pdf");
  res.send(Buffer.from(pdfBytes));
});

app.listen(3000, () => console.log("PDF filler running on port 3000"));
