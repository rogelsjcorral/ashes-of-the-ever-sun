/**
 * Secure Gemini API Route
 * Path: src/app/api/chat/route.ts
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AURELUNE_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { action, rollResult, stats, location } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", 
      systemInstruction: AURELUNE_SYSTEM_PROMPT,
    });

    const userPrompt = `
      Location: ${location}
      Player Action: "${action}"
      Dice Result: ${rollResult}
      Current Health: ${stats.health}/20
      Current Light: ${stats.light}

      Narrate the outcome based on the dice result and provide exactly 2 new choices with DCs.
    `;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const text = response.text();

    // Clean the JSON response from Gemini (it sometimes adds markdown blocks)
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Failed to generate narrative" }, { status: 500 });
  }
}
