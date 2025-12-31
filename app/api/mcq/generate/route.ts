import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/middleware/withAuth";
import { asyncHandler } from "@/lib/middleware/asyncHandler";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

export const runtime = "nodejs";

const outputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()).length(4),
      correct_answer: z.string(),
      explanation: z.string(),
    })
  ),
});

// ---------- PDF Parser Helper ----------
async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Method 1
    const pdfParse = (await import("pdf-parse/lib/pdf-parse.js")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  } catch (e1) {
    try {
      // Method 2
      const pdfModule: any = await import("pdf-parse");
      const pdfParse = pdfModule.default ?? pdfModule;

      if (typeof pdfParse === "function") {
        const data = await pdfParse(buffer);
        return data.text || "";
      }

      // Method 3
      if (pdfParse && typeof pdfParse.default === "function") {
        const data = await pdfParse.default(buffer);
        return data.text || "";
      }

      throw new Error("Could not find pdf-parse function");
    } catch (e2) {
      console.error("All PDF parse methods failed:", e1, e2);
      throw new Error("PDF parsing not available");
    }
  }
}

// ---------- MCQ Generator with fallback ----------
async function generateMCQs(text: string, count: number) {
  if (!text || text.trim().length < 50) {
    throw new Error("Input text is too short.");
  }

  // Keep prompt strict to get 4 options and exact answer match
  const prompt = `
Generate exactly ${count} multiple-choice questions based strictly on the text below.

Rules:
- Each question must have exactly 4 options.
- correct_answer must match one of the option strings EXACTLY.
- Explanations must cite information from the text (no outside knowledge).

TEXT:
${text.slice(0, 15000)}
`;

  const modelsToTry = ["gemini-3-flash-preview", "gemini-2.5-flash"];

  for (const modelId of modelsToTry) {
    try {
      const model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        model: modelId,
        temperature: 0.5,
      });

      const structuredLlm = model.withStructuredOutput(outputSchema);
      const result = await structuredLlm.invoke(prompt);

      return result.quiz.map((q) => {
        const keys = ["A", "B", "C", "D"];
        return {
          question: q.question,
          options: q.options.map((opt, i) => ({
            key: keys[i],
            value: opt,
          })),
          correct_answer: q.correct_answer,
          explanation: q.explanation,
        };
      });
    } catch (err: any) {
      console.warn(`Model ${modelId} failed:`, err?.message || err);
      if (modelId === modelsToTry[modelsToTry.length - 1]) throw err;
    }
  }

  return [];
}

// ---------- API Route Handler ----------
const generateHandler = async (req: NextRequest) => {
  let formData: FormData;

  try {
    formData = await req.formData();
  } catch (err) {
    console.error("Failed to parse request body as FormData:", err);
    return NextResponse.json(
      { success: false, error: "Request body must be multipart/form-data" },
      { status: 400 }
    );
  }

  try {
    const pdfFile = formData.get("pdf_file");
    const textInputRaw = formData.get("text_input");
    const countParamRaw = formData.get("number_of_questions");

    const textInput = typeof textInputRaw === "string" ? textInputRaw : "";

    let count = 5;
    if (typeof countParamRaw === "string") {
      const parsed = parseInt(countParamRaw, 10);
      if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 50) count = parsed;
    }

    let fullText = textInput.trim();

    // Process PDF if uploaded
    if (pdfFile && pdfFile instanceof File) {
      try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const extracted = await parsePDF(buffer);
        if (extracted.trim()) {
          fullText = [fullText, extracted.trim()].filter(Boolean).join("\n\n");
        }
      } catch (err) {
        console.error("PDF parsing error:", err);
        // Only fail if user provided no other text
        if (!fullText.trim()) {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid or unreadable PDF file and no text input.",
            },
            { status: 400 }
          );
        }
      }
    }

    if (!fullText.trim()) {
      return NextResponse.json(
        { success: false, error: "No text or PDF content provided" },
        { status: 400 }
      );
    }

    const generatedQuestions = await generateMCQs(fullText, count);
    // console.log("Generated Questions:", generatedQuestions);
    return NextResponse.json({ success: true, data: generatedQuestions });
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(asyncHandler(generateHandler));
