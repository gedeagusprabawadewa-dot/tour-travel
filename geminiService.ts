
import { GoogleGenAI, Type } from "@google/genai";
import { Booking } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateMemoryBookSummary = async (booking: Booking): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a poetic and evocative 3-sentence travel memory summary for a ${booking.type.toLowerCase()} called "${booking.name}" in Bali. 
      The trip involved ${booking.pois?.map(p => p.name).join(', ') || 'wonderful sights and activities'}. 
      Use a warm, professional, and slightly mystical tone appropriate for Bali's "Island of the Gods" reputation.`,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "A beautiful memory in the making. Bali stays in your heart forever.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The spirit of Bali moved through every moment of this journey, creating memories that will last a lifetime.";
  }
};
