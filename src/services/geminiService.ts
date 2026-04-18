import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateWikiDraft(title: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `당신은 전문 위키 작성자입니다. "${title}"이라는 제목의 위키 문서를 한국어로 작성해주세요. 
마크다운 형식을 사용하고, 개요, 상세 내용, 관련 항목 등을 포함해주세요. 
응답은 문서의 본문 내용만 포함해야 합니다.`,
    });

    return response.text || "내용을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("AI 초안 생성 중 오류가 발생했습니다.");
  }
}
