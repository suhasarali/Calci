import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic, prompt } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const systemInstruction = `
      You are a financial expert generating a quiz for a fintech app.
      Topic: "${topic}"
      Additional Context: "${prompt}"
      
      Requirements:
      1. Generate exactly 5 multiple-choice questions.
      2. Difficulty should be moderate to expert.
      3. Return ONLY valid JSON. No markdown formatting.
      4. JSON Schema:
      [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string (must match one option exactly)",
          "explanation": "string (brief explanation)"
        }
      ]
    `;

    const result = await model.generateContent(systemInstruction);
    const response = await result.response;
    let text = response.text();

    // Clean potential markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const quizData = JSON.parse(text);

    return NextResponse.json({ quiz: quizData });

  } catch (error) {
    console.error("Quiz Gen Error:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz." },
      { status: 500 }
    );
  }
}