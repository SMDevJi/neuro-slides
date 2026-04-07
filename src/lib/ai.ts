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
  return response.text?.replace('```json', '').replace('```', '')
}



export async function generateContentStream(prompt: string) {

  const response = await ai.models.generateContentStream({
    model: "gemma-3-27b-it",
    contents: prompt,
  });

  // for await (const chunk of response) {
  //   console.log(chunk.text);
  // }

  return response
  //return response.text?.replace('```json','').replace('```','')
}



//gemini-3.1-flash-lite-preview
//gemma-3-27b-it
export default generateContent