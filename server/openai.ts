// Integration reference: blueprint:javascript_openai 
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ExtractedStrainData {
  name?: string;
  type?: 'Indica' | 'Sativa' | 'Hybrid';
  thcContent?: number;
  description?: string;
  confidence: number;
}

export async function analyzeStrainPackaging(base64Image: string): Promise<ExtractedStrainData> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are an expert at analyzing cannabis strain packaging. Extract the following information from the image and respond with JSON only:
          - name: The strain name (string)
          - type: "Indica", "Sativa", or "Hybrid" (string) 
          - thcContent: THC percentage as a number (no % symbol)
          - description: Brief description if visible (string)
          - confidence: How confident you are in the extraction (0-1)
          
          If any field cannot be determined, omit it from the response. Format: { "name": "...", "type": "...", "thcContent": 18, "description": "...", "confidence": 0.9 }`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract strain information from this cannabis packaging image. Focus on strain name, type (Indica/Sativa/Hybrid), THC content percentage, and any description text."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate and clean the response
    const extractedData: ExtractedStrainData = {
      confidence: Math.max(0, Math.min(1, result.confidence || 0))
    };

    if (result.name && typeof result.name === 'string') {
      extractedData.name = result.name.trim();
    }

    if (result.type && ['Indica', 'Sativa', 'Hybrid'].includes(result.type)) {
      extractedData.type = result.type;
    }

    if (result.thcContent && typeof result.thcContent === 'number' && result.thcContent >= 0 && result.thcContent <= 50) {
      extractedData.thcContent = Math.round(result.thcContent * 10) / 10; // Round to 1 decimal
    }

    if (result.description && typeof result.description === 'string') {
      extractedData.description = result.description.trim();
    }

    return extractedData;

  } catch (error: any) {
    console.error('Error analyzing strain packaging:', error);
    
    // Handle specific OpenAI errors
    if (error?.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please try again later or check your API usage.');
    }
    
    if (error?.status === 401) {
      throw new Error('OpenAI API key invalid. Please check your API configuration.');
    }
    
    if (error?.message?.includes('insufficient_quota')) {
      throw new Error('OpenAI API quota insufficient. Please check your OpenAI account billing.');
    }
    
    throw new Error('Failed to analyze strain packaging image. Please try manual entry instead.');
  }
}

export function convertFileToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}