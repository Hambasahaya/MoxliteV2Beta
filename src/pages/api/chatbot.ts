import type { NextApiRequest, NextApiResponse } from "next";

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }>;
  }>;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface ChatRequest {
  message: string;
  budget?: number;
  type?: string;
  imageData?: string;
  imageType?: string;
  isImageAnalysis?: boolean;
}

interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";

const GENERAL_CHAT_CONTEXT = `You are a helpful Moxlite Lighting Assistant. 

Your role:
- Answer questions about professional stage lighting equipment
- Provide friendly, professional guidance
- Respond in Indonesian (Bahasa Indonesia)
- Be concise and clear
- Use emojis appropriately to make responses engaging

Moxlite Product Categories:
- LASER Series: HADES VI, HADES X, HADES XX, HADES XXX, HADES IP
- Moving Light Series: AMOS, AMOS PLUS, AMOS PRO, ARES, ARES PLUS, SCARLET, SCARLET PLUS, SCARLET HYBRID, IP SCARLET HYBRID
- Moving Wash Series: HERA LITE, MEDUSA LITE, IP MEDUSA LITE, MEDUSA, MEDUSA PLUS, IP MEDUSA PLUS, IP MEDUSA PRO
- SFX Series: SPARKY, FLAME, BUBBLE FOG MACHINE, CO2 BARREL, CO2 SHOT, CO2 GUN, CONFETTI GUN, CONFETTI BLASTER

Important:
- Do NOT generate pricing
- Do NOT invent specifications
- Keep responses natural and conversational
- No JSON, no markdown, no code blocks
- Just plain helpful text
`;

const LIGHTING_PLANNER_CONTEXT = `You are an AI Lighting Production Planner specialized in professional stage and event lighting.

Your task: Analyze stage layouts/images and provide lighting equipment recommendations from Moxlite's catalog.

CRITICAL RULES:
✓ Do NOT invent product brands (only Moxlite products allowed)
✓ Do NOT generate pricing
✓ Do NOT assume specifications unless visible
✓ Keep all text CONCISE and SHORT (max 1-2 sentences per field)
✓ List only REALISTIC assumptions (2-3 max)
✓ Respond in valid JSON ONLY - no markdown, no extra text

REQUIRED OUTPUT FORMAT (valid JSON):
{
  "stage_analysis": {
    "estimated_size": "e.g., Large 30m x 20m",
    "event_type": "Concert / Theater / Festival",
    "complexity_level": "Low / Medium / High",
    "assumptions": ["Assumption 1 (short)", "Assumption 2 (short)"]
  },
  "lighting_recommendation": [
    {
      "category": "SCARLET HYBRID / Moving Light Series",
      "estimated_quantity": 48,
      "purpose": "Aerial beam effects",
      "reasoning": "Large venue needs high-power scanning"
    }
  ],
  "budget_strategy": {
    "priority_focus": "Structural definition",
    "optimization_strategy": "Allocate 60% to moving lights, 30% to wash, 10% to SFX",
    "tradeoffs": "Reduce SFX before reducing primary fixtures"
  },
  "confidence_level": "High / Medium / Low"
}

MOXLITE PRODUCTS (Reference Only - Do NOT invent pricing):
- LASER: HADES VI, HADES X, HADES XX, HADES XXX, HADES IP
- Moving Light: AMOS, AMOS PLUS, AMOS PRO, ARES, ARES PLUS, SCARLET, SCARLET PLUS, SCARLET HYBRID, IP SCARLET HYBRID
- Moving Wash: HERA LITE, MEDUSA LITE, IP MEDUSA LITE, MEDUSA, MEDUSA PLUS, IP MEDUSA PLUS, IP MEDUSA PRO
- SFX: SPARKY, FLAME, BUBBLE FOG MACHINE, CO2 BARREL, CO2 SHOT, CO2 GUN, CONFETTI GUN, CONFETTI BLASTER

KEEP JSON CONCISE. No lengthy explanations.
Temperature: 0.2 (deterministic only)
`;

// Format stage analysis JSON into professional, clean response with CTA
function formatStageAnalysis(jsonResponse: string): string {
  try {
    const analysis = JSON.parse(jsonResponse);
    
    let formatted = "\n";
    formatted += "╔═══════════════════════════════════════════════════════╗\n";
    formatted += "║  🎭 ANALISIS DESAIN STAGE & REKOMENDASI LAMPU MOXLITE  ║\n";
    formatted += "╚═══════════════════════════════════════════════════════╝\n\n";
    
    // Stage Analysis Section
    if (analysis.stage_analysis) {
      const stage = analysis.stage_analysis;
      formatted += "📐 ANALISIS STAGE\n";
      formatted += "┌─────────────────────────────────────────────────────┐\n";
      formatted += `│ Ukuran:      ${stage.estimated_size.padEnd(42)}│\n`;
      formatted += `│ Tipe Event:  ${stage.event_type.substring(0, 42).padEnd(42)}│\n`;
      formatted += `│ Kompleksitas: ${stage.complexity_level.padEnd(41)}│\n`;
      formatted += "└─────────────────────────────────────────────────────┘\n\n";
      
      if (stage.assumptions && stage.assumptions.length > 0) {
        formatted += "💡 Catatan Penting:\n";
        stage.assumptions.forEach((assumption: string) => {
          // Trim long assumptions to fit nicely
          const trimmed = assumption.substring(0, 80);
          formatted += `  • ${trimmed}${assumption.length > 80 ? '...' : ''}\n`;
        });
        formatted += "\n";
      }
    }
    
    // Lighting Recommendations Section  
    if (analysis.lighting_recommendation && Array.isArray(analysis.lighting_recommendation)) {
      formatted += "💡 REKOMENDASI PERALATAN MOXLITE\n";
      formatted += "┌─────────────────────────────────────────────────────┐\n\n";
      
      let totalUnits = 0;
      analysis.lighting_recommendation.forEach((rec: any, idx: number) => {
        totalUnits += rec.estimated_quantity;
        formatted += `${idx + 1}. ${rec.category}\n`;
        formatted += `   📊 Unit: ${rec.estimated_quantity} pcs\n`;
        formatted += `   🎯 Fungsi: ${rec.purpose}\n`;
        formatted += `   ✓ Opsi Terbaik: ${rec.reasoning.substring(0, 70)}${rec.reasoning.length > 70 ? '...' : ''}\n\n`;
      });
      
      formatted += `Total Peralatan: ~${totalUnits} unit\n`;
      formatted += "└─────────────────────────────────────────────────────┘\n\n";
    }
    
    // Budget Strategy Section  
    if (analysis.budget_strategy) {
      const budget = analysis.budget_strategy;
      formatted += "💰 STRATEGI ALOKASI BUDGET\n";
      formatted += "┌─────────────────────────────────────────────────────┐\n";
      formatted += `│ Fokus Utama:\n│   ${budget.priority_focus.substring(0, 50)}\n`;
      formatted += `│\n│ Rekomendasi:\n│   ${budget.optimization_strategy.substring(0, 50)}...\n`;
      formatted += "└─────────────────────────────────────────────────────┘\n\n";
    }
    
    // Confidence Level
    if (analysis.confidence_level) {
      formatted += `✅ Tingkat Kepercayaan: ${analysis.confidence_level}\n\n`;
    }
    
    // CTA / Soft Selling Section
    formatted += "╔═══════════════════════════════════════════════════════╗\n";
    formatted += "║  📞 LANGKAH SELANJUTNYA                               ║\n";
    formatted += "╚═══════════════════════════════════════════════════════╝\n";
    formatted += "✨ Analisis Anda sudah siap! Sekarang waktunya untuk:\n\n";
    formatted += "🎁 DAPATKAN:\n";
    formatted += "  ✓ Quotation Detail GRATIS\n";
    formatted += "  ✓ Konsultasi Teknis dengan Expert Moxlite\n";
    formatted += "  ✓ Demo Unit & Test Drive Area\n";
    formatted += "  ✓ Flexible Rental/Project Solutions\n\n";
    formatted += "📧 Hubungi Tim Kami:\n";
    formatted += "  WhatsApp: +62-XXX-XXXX-XXXX\n";
    formatted += "  Email: sales@moxlite.com\n";
    formatted += "  Phone: (021) XXXX-XXXX\n\n";
    formatted += "💬 Atau lanjutkan chat untuk pertanyaan lebih lanjut!\n";
    
    return formatted.trim();
  } catch (e) {
    console.error("Error formatting stage analysis:", e);
    return jsonResponse;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  console.log("Chatbot API called with method:", req.method);
  
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { message, budget, type, imageData, imageType, isImageAnalysis } = req.body as ChatRequest;
    
    console.log("Request body:", { message, budget, type, hasImage: !!imageData, isImageAnalysis });

    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    if (!GEMINI_API_KEY) {
      console.error("Gemini API key is not configured!");
      return res.status(500).json({
        success: false,
        error: "API configuration error - Missing GEMINI_API_KEY",
      });
    }

    // For image analysis, always use Lighting Planner context
    const isLightingPlanningRequest = 
      isImageAnalysis ||
      message.toLowerCase().includes("layout") ||
      message.toLowerCase().includes("stage") ||
      message.toLowerCase().includes("ukuran") ||
      message.toLowerCase().includes("design") ||
      message.toLowerCase().includes("setup") ||
      message.toLowerCase().includes("analisis") ||
      message.toLowerCase().includes("analysis") ||
      message.toLowerCase().includes("gambar") ||
      message.toLowerCase().includes("image") ||
      message.toLowerCase().includes("foto") ||
      message.toLowerCase().includes("photo") ||
      (budget && budget > 0) ||
      message.toLowerCase().includes("rekomendasi produk") ||
      message.toLowerCase().includes("product recommendation");

    const contextMessage = isLightingPlanningRequest 
      ? LIGHTING_PLANNER_CONTEXT 
      : GENERAL_CHAT_CONTEXT;

    let fullContext = contextMessage;

    if (budget) {
      fullContext += `\n\nUser Budget Context: Rp${budget.toLocaleString("id-ID")} (approximately ${Math.round(budget / 1000000)}M IDR)`;
    }

    if (type) {
      fullContext += `\nDeployment Type: ${type === "cust rental" ? "Rental/Sewa" : "Project/Pembelian"}`;
    }

    // Build request body - support both text and image
    const requestBodyContent: Array<{
      text?: string;
      inlineData?: {
        mimeType: string;
        data: string;
      };
    }> = [];

    // Add image if provided
    if (imageData && imageType) {
      // Extract base64 data (remove data:image/...;base64, prefix)
      const base64Data = imageData.includes(',') 
        ? imageData.split(',')[1] 
        : imageData;
      
      requestBodyContent.push({
        inlineData: {
          mimeType: imageType,
          data: base64Data,
        },
      });
    }

    // Add text content
    requestBodyContent.push({
      text: `${fullContext}\n\nUser Request: ${message}`,
    });

    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: requestBodyContent,
        },
      ],
    };

    console.log("Request mode:", isLightingPlanningRequest ? "Lighting Planner (JSON)" : "General Chat (Natural)");
    console.log("Has image:", !!imageData);
    console.log("Calling Gemini 3 Flash Preview with request...");

    const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Gemini API Response Status:", geminiResponse.status);

    const responseText = await geminiResponse.text();

    if (!geminiResponse.ok) {
      console.error("Gemini API Error Status:", geminiResponse.status);
      console.error("Gemini API Error Response:", responseText.substring(0, 500));
      return res.status(500).json({
        success: false,
        error: `Gemini API error: ${geminiResponse.status}`,
      });
    }

    try {
      const data: GeminiResponse = JSON.parse(responseText);

      if (data.candidates && data.candidates.length > 0) {
        let botResponse = data.candidates[0].content.parts[0].text;
        
        // Format response based on request type
        if (isLightingPlanningRequest) {
          // For lighting planner, extract JSON and format it nicely
          try {
            const jsonStart = botResponse.indexOf('{');
            const jsonEnd = botResponse.lastIndexOf('}') + 1;
            if (jsonStart !== -1 && jsonEnd > jsonStart) {
              const jsonStr = botResponse.substring(jsonStart, jsonEnd);
              botResponse = formatStageAnalysis(jsonStr);
            }
          } catch (e) {
            console.error("Error formatting lighting analysis:", e);
          }
        } else {
          // For general chat, remove markdown codes and clean up
          botResponse = botResponse
            .replace(/```[a-z]*\n?/g, '') // Remove markdown code blocks
            .replace(/\*\*/g, '') // Remove bold markdown
            .replace(/\*/g, '') // Remove italic markdown
            .replace(/`/g, '') // Remove inline code
            .replace(/\n\n\n+/g, '\n\n') // Clean up excessive newlines
            .trim();
        }
        
        console.log("Bot response generated successfully");
        return res.status(200).json({
          success: true,
          response: botResponse,
        });
      }

      console.log("No candidates in response");
      return res.status(200).json({
        success: true,
        response: "Maaf, saya tidak bisa memahami pertanyaan Anda. Coba tanyakan hal lain!",
      });
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      return res.status(500).json({
        success: false,
        error: "Failed to parse API response",
      });
    }
  } catch (error) {
    console.error("Error in chatbot API:", error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
