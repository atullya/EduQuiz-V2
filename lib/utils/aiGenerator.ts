import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

// Initialize Model
const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3-flash-preview",
  temperature: 0.5,
});

// Define the shape of data we want from AI
const outputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe("The question text"),
      options: z.array(z.string()).describe("A list of 4 options"),
      correct_answer: z.string().describe("The correct option string"),
      explanation: z.string().describe("Explanation for the answer"),
    })
  ),
});

const structuredLlm = model.withStructuredOutput(outputSchema);

export async function generateMCQs(text: string, count: number) {
  if (!text || text.length < 50) {
    throw new Error("Input text is too short.");
  }

  const prompt = `
    Generate ${count} multiple-choice questions based on the following text.
    Ensure questions are academic and strictly relevant to the text.
    TEXT: ${text.slice(0, 15000)}
  `;

  const result = await structuredLlm.invoke(prompt);

  // Format specifically for your Mongoose Schema (Key/Value pairs)
  return result.quiz.map((q) => {
    const keys = ["A", "B", "C", "D"];
    return {
      question: q.question,
      options: q.options.map((opt, i) => ({
        key: keys[i] || "Z",
        value: opt,
      })),
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    };
  });
}
