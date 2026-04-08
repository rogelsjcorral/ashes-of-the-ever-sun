import { GoogleGenerativeAI } from "@google/generative-ai";
import { AURELUNE_SYSTEM_PROMPT } from "./prompts";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export const getNextNarrative = async (
  playerAction: string, 
  rollResult: string, 
  currentState: any
) => {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash", // Or Gemini 3 Flash when available in SDK
    systemInstruction: AURELUNE_SYSTEM_PROMPT 
  });

  const prompt = `
    Context: The player is at ${currentState.location}. 
    Current Light: ${currentState.player.light}.
    Action Taken: "${playerAction}"
    Dice Result: ${rollResult}
    
    Based on the dice result, narrate the outcome and provide 2-3 new choices.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
};
