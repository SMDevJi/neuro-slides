import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateContent(prompt: string) {
  
  //const models = await ai.models.list()
  //console.log(Object.keys(models))
  //console.log(models)
  //models.pageInternal.map((pg) => console.log(pg.name))
  
  const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: prompt,
  });
  return response.text?.replace('```json','').replace('```','')
}

export default generateContent