import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  if (!openai) {
    throw new Error("OpenAI API key not configured");
  }
  return openai;
}

export interface AIProcessingResult {
  language: string;
  sentiment: string;
  intent: string;
  translatedContent?: string;
  suggestedResponse?: string;
}

export async function processMessage(
  content: string,
  targetLanguage?: string
): Promise<AIProcessingResult> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return {
        language: "en",
        sentiment: "neutral",
        intent: "Message received",
        translatedContent: undefined,
        suggestedResponse: "Thank you for your message. We'll get back to you soon.",
      };
    }
    
    const client = getOpenAI();
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant that analyzes messages and provides structured information. 
Analyze the message and provide:
1. language: detected language code (en, hi, kn, ne)
2. sentiment: positive, neutral, negative, or urgent
3. intent: brief description of the message intent
4. translatedContent: translation to ${targetLanguage || "en"} if different from original language
5. suggestedResponse: a brief appropriate response in the original language

Respond with JSON in this format: { "language": "en", "sentiment": "neutral", "intent": "...", "translatedContent": "...", "suggestedResponse": "..." }`
        },
        {
          role: "user",
          content: content
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      language: result.language || "en",
      sentiment: result.sentiment || "neutral",
      intent: result.intent || "",
      translatedContent: result.translatedContent,
      suggestedResponse: result.suggestedResponse,
    };
  } catch (error) {
    console.error("AI processing error:", error);
    return {
      language: "en",
      sentiment: "neutral",
      intent: "unknown",
    };
  }
}

export async function generateResponse(
  messageHistory: string[],
  language: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return "Thank you for your message. Our AI assistant is currently unavailable. A team member will respond shortly.";
    }
    
    const client = getOpenAI();
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant for GharPey, a platform connecting employers with domestic help (maids). 
Generate professional, helpful responses in ${language}. Be warm, clear, and concise.`
        },
        ...messageHistory.map((msg, i) => ({
          role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
          content: msg
        }))
      ],
      max_completion_tokens: 300,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Response generation error:", error);
    return "I apologize, but I'm having trouble generating a response right now.";
  }
}

export async function translateMessage(
  content: string,
  targetLanguage: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return content;
    }
    
    const client = getOpenAI();
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Translate the following text to ${targetLanguage}. Maintain the tone and meaning.`
        },
        {
          role: "user",
          content: content
        }
      ],
      max_completion_tokens: 500,
    });

    return response.choices[0].message.content || content;
  } catch (error) {
    console.error("Translation error:", error);
    return content;
  }
}
