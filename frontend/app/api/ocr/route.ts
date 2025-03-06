import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js";

interface ExtractedData {
  name?: string;
  aadharNumber?: string;
  income?: string;
  [key: string]: string | undefined;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Unsupported file format. Please upload a PDF." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    if (!buffer || buffer.byteLength === 0) {
      return NextResponse.json({ error: "Invalid file buffer" }, { status: 400 });
    }

    console.log("File details:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    const pdfDoc = await PDFDocument.load(buffer);
    const pageCount = pdfDoc.getPageCount();
    let extractedText = "";

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      // Render the page to an image buffer
      const imageBuffer = await page.render({ width, height }).toBuffer();

      // Perform OCR on the image buffer
      const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');
      extractedText += text + "\n";
    }

    const lines = extractedText.split('\n').filter(line => line.trim() !== '');
    const extractedData: ExtractedData = {
      name: extractNameFromLines(lines),
      aadharNumber: extractAadharFromLines(lines),
      income: extractIncomeFromLines(lines),
    };

    return NextResponse.json({
      rawText: extractedText,
      extractedLines: lines,
      extractedData: extractedData,
    });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// Helper functions for data extraction
function extractNameFromLines(lines: string[]): string | undefined {
  const namePatterns = [
    /^([A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?)\b/,
    /NAME:?\s*([A-Z][a-z]+ [A-Z][a-z]+( [A-Z][a-z]+)?)\b/i,
  ];

  for (const line of lines) {
    for (const pattern of namePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }
  return undefined;
}

function extractAadharFromLines(lines: string[]): string | undefined {
  const aadharPatterns = [
    /\b(\d{4}\s?\d{4}\s?\d{4})\b/, // With spaces
    /\b(\d{12})\b/, // Without spaces
    /(?:AADHAR|UID):?\s*(\d{4}\s?\d{4}\s?\d{4})/i, // With label
  ];

  for (const line of lines) {
    for (const pattern of aadharPatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].replace(/\s/g, '');
      }
    }
  }
  return undefined;
}

function extractIncomeFromLines(lines: string[]): string | undefined {
  const incomePatterns = [
    /(?:INCOME|ANNUAL INCOME):?\s*(?:Rs\.?|₹)?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
    /(?:INCOME|SALARY):?\s*(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/i,
  ];

  for (const line of lines) {
    for (const pattern of incomePatterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].replace(/,/g, '');
      }
    }
  }
  return undefined;
}