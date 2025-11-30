
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

// Helper for pure text generation
const generateText = async (prompt: string, model = 'gemini-2.5-flash'): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: model,
    contents: { parts: [{ text: prompt }] }
  });
  return response.text || "No response generated.";
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
  
  const match = base64Image.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid image data");
  const mimeType = match[1];
  const data = match[2];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
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
          { inlineData: { mimeType, data } },
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

// 6. Generate Smart Brushes
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
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr) as SmartBrush[];
  } catch (error) {
    console.error("Smart Brush Gen Error:", error);
    return [];
  }
};

// 7. Sketch to Image
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

// --- NEW TOOLS ---

// 8. Background Changer
export const changeBackground = async (base64Image: string, newBackground: string): Promise<string> => {
  const prompt = `Keep the foreground subject exactly as it is (do not alter the person/object), but replace the background completely with: ${newBackground}. High quality composite.`;
  return editImage(base64Image, prompt);
};

// 9. Code Expert
export const generateCode = async (prompt: string): Promise<string> => {
  const finalPrompt = `You are an expert senior software engineer. Provide high-quality, efficient, and commented code for the following request. If it's a bug fix, explain the fix. Request: ${prompt}`;
  return generateText(finalPrompt, 'gemini-3-pro-preview'); // Using stronger model for logic
};

// 10. Universal Translator
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  const prompt = `Translate the following text into ${targetLanguage}. Maintain the original tone and nuance. Provide only the translation.\n\nText: "${text}"`;
  return generateText(prompt);
};

// 11. Content Summarizer
export const summarizeContent = async (text: string): Promise<string> => {
  const prompt = `Summarize the following text into concise bullet points. Capture the main ideas and key details.\n\nText: "${text}"`;
  return generateText(prompt);
};

// 12. Story Writer
export const writeCreative = async (topic: string, type: string): Promise<string> => {
  const prompt = `Write a creative ${type} about "${topic}". Make it engaging, original, and well-structured.`;
  return generateText(prompt, 'gemini-3-pro-preview');
};

// 13. Social Media Assistant
export const generateSocialCaptions = async (base64Image: string, platform: string): Promise<string> => {
  const prompt = `Analyze this image and generate 3 engaging captions for ${platform}. Include relevant hashtags. Tone: Viral, Trendy, and Authentic.`;
  return analyzeImage(base64Image, prompt);
};

// 14. AI Chef
export const generateRecipe = async (base64Image: string): Promise<string> => {
  const prompt = `Identify the ingredients or the dish in this image. Then, provide a detailed, delicious recipe that can be made using these items. Include a shopping list if anything is missing.`;
  return analyzeImage(base64Image, prompt);
};

// 15. Meme Maker (Generates Image)
export const generateMeme = async (topic: string): Promise<string> => {
  const prompt = `Create a funny, viral-style internet meme image about: ${topic}. It should look like a typical meme format with text overlay if applicable.`;
  return generateImage(prompt);
};

// 16. Dream Weaver (Text + Image)
export const interpretDream = async (dreamDescription: string): Promise<{interpretation: string, imageUrl: string}> => {
  const ai = getAiClient();
  
  // Parallel execution for speed
  const interpretationPromise = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: { parts: [{ text: `Act as a Jungian dream analyst. Interpret this dream, explaining symbols and potential meanings: "${dreamDescription}"` }] }
  });

  const imagePromise = ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `A surreal, artistic, and dreamlike visual representation of this dream: "${dreamDescription}". High quality digital art.` }] }
  });

  const [interpRes, imgRes] = await Promise.all([interpretationPromise, imagePromise]);
  
  const imageUrl = extractImageFromResponse(imgRes);
  if (!imageUrl) throw new Error("Failed to visualize dream.");

  return {
    interpretation: interpRes.text || "Could not interpret.",
    imageUrl
  };
};

// 17. Study Buddy
export const solveHomework = async (base64Image: string, question: string): Promise<string> => {
  const prompt = `Act as a tutor. Solve the problem shown in the image or text. Explain the steps clearly so a student can understand. Question: ${question}`;
  return analyzeImage(base64Image, prompt);
};

// --- 15 NEW TOOLS ---

// 18. Icon Generator
export const generateIcon = async (prompt: string): Promise<string> => {
  const p = `Design a professional, high-quality app icon for: ${prompt}. Style: Modern, vector flat design or 3D subtle depth, white background, square aspect ratio.`;
  return generateImage(p);
};

// 19. Logo Creator
export const generateLogo = async (prompt: string): Promise<string> => {
  const p = `Create a minimalist, professional vector logo design for: ${prompt}. Clean lines, geometric shapes, white background, high contrast, scalable vector style.`;
  return generateImage(p);
};

// 20. Tattoo Designer
export const generateTattoo = async (prompt: string): Promise<string> => {
  const p = `Design a tattoo sketch for: ${prompt}. Style: Black and white ink, clean linework, artistic, white background, suitable for a stencil.`;
  return generateImage(p);
};

// 21. Pattern Maker
export const generatePattern = async (prompt: string): Promise<string> => {
  const p = `Generate a seamless, tileable texture pattern based on: ${prompt}. High resolution, artistic, repeating motif.`;
  return generateImage(p);
};

// 22. Sticker Maker
export const generateSticker = async (prompt: string): Promise<string> => {
  const p = `Create a die-cut sticker design of: ${prompt}. White border contour, vibrant colors, vector illustration style, isolated on white background.`;
  return generateImage(p);
};

// 23. Palette Generator
export const generatePalette = async (prompt: string): Promise<any[]> => {
  const p = `Generate a beautiful color palette based on the mood/theme: "${prompt}". Return valid JSON only: array of objects with 'color' (hex) and 'name' (string). 5 colors max.`;
  const text = await generateText(p);
  try {
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch {
    return [];
  }
};

// 24. Prompt Perfect
export const enhancePrompt = async (rawPrompt: string): Promise<string> => {
  const p = `Act as an expert prompt engineer. Improve and expand this prompt to generate a better result for an AI image generator (Midjourney/Gemini style). Include details on lighting, style, composition, and quality. Original: "${rawPrompt}"`;
  return generateText(p);
};

// 25. Interview Coach
export const generateInterviewQuestion = async (role: string): Promise<string> => {
  const p = `You are an interviewer. Ask a challenging but fair interview question for a ${role} position.`;
  return generateText(p);
};

// 26. Nutritionist
export const analyzeNutrition = async (base64Image: string): Promise<string> => {
  const p = `Analyze the food in this image. Estimate calories and macronutrients (protein, carbs, fats). Is it healthy? Provide a brief nutritional breakdown.`;
  return analyzeImage(base64Image, p);
};

// 27. Legal Ease
export const simplifyLegal = async (text: string): Promise<string> => {
  const p = `Explain the following legal text in simple, plain English that a 10-year-old could understand. Highlight any risks.\n\nText: "${text}"`;
  return generateText(p);
};

// 28. Travel Guide
export const planTrip = async (destination: string, days: string, interests: string): Promise<string> => {
  const p = `Create a detailed ${days}-day travel itinerary for ${destination}. Interests: ${interests}. Include hidden gems and practical tips.`;
  return generateText(p, 'gemini-3-pro-preview');
};

// 29. Fitness Planner
export const planWorkout = async (goal: string, level: string, equipment: string): Promise<string> => {
  const p = `Create a weekly workout routine. Goal: ${goal}. Level: ${level}. Equipment available: ${equipment}. Include sets/reps.`;
  return generateText(p);
};

// 30. Interior Design
export const redesignRoom = async (base64Image: string, style: string): Promise<string> => {
  const p = `Redesign this room to have a ${style} interior design style. Keep the structural layout but change furniture, colors, and decor. Photorealistic high quality.`;
  return editImage(base64Image, p);
};

// 31. Fashion Stylist
export const suggestOutfit = async (base64Image: string, event: string): Promise<string> => {
  const p = `Act as a fashion stylist. Analyze the person/clothing in this image and suggest improvements or a complete outfit for this event: ${event}. Explain why.`;
  return analyzeImage(base64Image, p);
};

// 32. Speech Writer
export const writeSpeech = async (occasion: string, audience: string, tone: string): Promise<string> => {
  const p = `Write a speech for a ${occasion}. Audience: ${audience}. Tone: ${tone}. Duration: 2-3 minutes spoken. Make it memorable.`;
  return generateText(p, 'gemini-3-pro-preview');
};
