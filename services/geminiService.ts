
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Helper to extract image from response parts
const extractImageFromResponse = (response: GenerateContentResponse): string | null => {
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
  }
  return null;
};

// 1. Image Generation
export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      }
    });

    const imageUrl = extractImageFromResponse(response);
    if (!imageUrl) {
      throw new Error("No image generated. The model might have returned text instead.");
    }
    return imageUrl;
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

// 2. Image Editing (includes Extending/Zooming via prompt instructions)
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  // Extract base64 data and mime type
  const match = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");
  const mimeType = match[1];
  const data = match[2];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data
            }
          },
          { text: prompt }
        ]
      }
    });

    const imageUrl = extractImageFromResponse(response);
    if (!imageUrl) {
      const text = response.text || "Failed to edit image.";
      throw new Error(text);
    }
    return imageUrl;
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

// 3. Vision Analysis
export const analyzeImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  
  const match = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");
  const mimeType = match[1];
  const data = match[2];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data
            }
          },
          { text: prompt || "Describe this image in detail." }
        ]
      }
    });
    return response.text || "No analysis provided.";
  } catch (error) {
    console.error("Vision Error:", error);
    throw error;
  }
};

// 4. Chat
export const sendChatMessage = async (history: {role: 'user' | 'model', text: string}[], newMessage: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text || "";
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};

// 5. Image Enhancement Wrapper
export const enhanceImageQuality = async (base64Image: string): Promise<string> => {
  const prompt = "Enhance this image to be high resolution 4k, razor sharp focus, improved lighting, detailed texture, and photorealistic quality. Remove noise and blur.";
  return editImage(base64Image, prompt);
};

export interface SmartBrush {
  label: string;
  color: string;
}

// 6. Generate Smart Brushes from Prompt
export const generateSmartBrushes = async (prompt: string): Promise<SmartBrush[]> => {
  const ai = getAiClient();
  if (!prompt || prompt.length < 3) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{
          text: `You are a semantic painting assistant. Analyze the scene description: "${prompt}". 
          Return a JSON array of 5-8 key distinct physical elements (objects, materials, background) that would appear in this scene. 
          For each element, provide a 'label' and a unique 'color' (hex code) that roughly represents the object's real world color.
          Example for "Park": [{"label": "Grass", "color": "#228b22"}, {"label": "Sky", "color": "#87ceeb"}, {"label": "Tree Bark", "color": "#8b4513"}]
          Return ONLY valid JSON. No markdown formatting.`
        }]
      }
    });

    const text = response.text || "[]";
    // Clean up markdown if present
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as SmartBrush[];
  } catch (error) {
    console.error("Smart Brush Gen Error:", error);
    return [];
  }
};

// 7. Sketch to Image with Semantic Understanding
export const generateFromSketch = async (base64Sketch: string, userPrompt: string, brushes: SmartBrush[] = []): Promise<string> => {
  let brushInstructions = "";
  
  if (brushes.length > 0) {
    brushInstructions = "\n\nThe input image is a color-coded semantic segmentation map. Strictly interpret the colors as follows to place objects:\n";
    brushes.forEach(b => {
      brushInstructions += `- Color ${b.color} represents ${b.label}\n`;
    });
    brushInstructions += "\nRender these areas precisely as the specified objects with photorealistic textures, lighting, and depth matching the scene description.";
  }

  const finalPrompt = `Transform this rough sketch into a high-quality, fully detailed image of: ${userPrompt}. ${brushInstructions} Maintain the exact composition and structure of the drawing.`;
  
  return editImage(base64Sketch, finalPrompt);
};
