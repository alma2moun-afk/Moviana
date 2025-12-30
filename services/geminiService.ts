
import { GoogleGenAI, Modality } from "@google/genai";
import { VideoConfig } from "../types";

const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVoicePreview = async (greeting: string, prebuiltName: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: greeting }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: prebuiltName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("Audio generation failed");
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
};

export const generateVideo = async (config: VideoConfig, onStatusUpdate: (msg: string) => void) => {
  const ai = getAIClient();
  onStatusUpdate("Initializing Production Engine...");
  
  try {
    const generationParams: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: config.prompt,
      config: {
        numberOfVideos: 1,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio
      }
    };

    if (config.image) {
      generationParams.image = {
        imageBytes: config.image.includes('base64,') ? config.image.split(',')[1] : config.image,
        mimeType: 'image/jpeg'
      };
    }

    let operation = await ai.models.generateVideos(generationParams);
    
    // Polling Logic
    while (!operation.done) {
      if ((operation as any).error) throw new Error((operation as any).error.message);
      onStatusUpdate("AI is rendering frames... This may take a moment.");
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("No video data received from engine.");

    const keyParam = `&key=${process.env.API_KEY}`;
    const response = await fetch(`${downloadLink}${downloadLink.includes('?') ? '' : '?'}${keyParam}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
    
  } catch (error: any) {
    console.error("Generation Error:", error);
    if (error?.message?.includes("Requested entity was not found")) {
      if (window.aistudio) await window.aistudio.openSelectKey();
    }
    throw error;
  }
};
