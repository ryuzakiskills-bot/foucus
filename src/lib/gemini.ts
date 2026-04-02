import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = new GoogleGenAI({ apiKey });

export async function getFocusInsight(sessions: any[]) {
  try {
    const sessionData = sessions.slice(0, 10).map(s => ({
      type: s.type,
      duration: s.duration,
      time: new Date(s.timestamp).toLocaleTimeString()
    }));

    const prompt = `
      Analyze these focus sessions and provide a short, professional, and motivational insight for a high-performance SaaS dashboard.
      Sessions: ${JSON.stringify(sessionData)}
      
      Requirements:
      1. One sentence of analysis.
      2. One sentence of actionable advice.
      3. One short motivational quote.
      
      Format: JSON
      Schema: { "analysis": string, "advice": string, "quote": string }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error getting AI insight:", error);
    return {
      analysis: "You're building a solid foundation of deep work.",
      advice: "Try to schedule your most complex tasks for your next session.",
      quote: "Focus is the art of knowing what to ignore."
    };
  }
}
