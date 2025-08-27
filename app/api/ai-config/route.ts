import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { apiCall, apiConfig, handleApiError } from "@/lib/api"

interface AIConfigRequest {
  company_id?: string | number
  ai_context: string
  embeddings: string[]
}

interface AIConfigResponse {
  success: boolean
  message?: string
  error?: string
}

const DESCRIPTION_MIN_LENGTH = 50
const AI_CONTEXT_MIN_LENGTH = 30
const EMBEDDING_MIN_LENGTH = 10
const MAX_EMBEDDINGS = 20

function isValidDescription(description: string): boolean {
  return description.length >= DESCRIPTION_MIN_LENGTH && description.length <= 2000
}

function isValidAIContext(context: string): boolean {
  return context.length >= AI_CONTEXT_MIN_LENGTH && context.length <= 1500
}

function isValidEmbedding(embedding: string): boolean {
  return embedding.length >= EMBEDDING_MIN_LENGTH && embedding.length <= 1000
}

export async function POST(request: NextRequest): Promise<NextResponse<AIConfigResponse>> {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiya talab qilinadi" },
        { status: 401 }
      )
    }

    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type application/json bo'lishi kerak" },
        { status: 400 }
      )
    }

    let body: AIConfigRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri JSON format" },
        { status: 400 }
      )
    }

    const { company_id, ai_context, embeddings } = body

    console.log("Received request body:", { company_id, ai_context, embeddings })

    // Required fields validation
    if (!ai_context) {
      console.log("Validation failed: AI context missing")
      return NextResponse.json(
        { success: false, error: "AI yo'riqnomasi kiritilishi shart" }, 
        { status: 400 }
      )
    }

    // Type validation
    if (typeof ai_context !== "string" || !Array.isArray(embeddings)) {
      console.log("Validation failed: Type validation", { 
        ai_context_type: typeof ai_context, 
        embeddings_is_array: Array.isArray(embeddings) 
      })
      return NextResponse.json(
        { success: false, error: "Ma'lumotlar formati noto'g'ri" },
        { status: 400 }
      )
    }

    // Trim inputs
    const trimmedAIContext = ai_context.trim()
    const trimmedEmbeddings = embeddings.map(e => e.trim()).filter(e => e.length > 0)
    
    console.log("After trimming:", { 
      trimmedAIContext_length: trimmedAIContext.length, 
      trimmedEmbeddings_count: trimmedEmbeddings.length,
      trimmedEmbeddings 
    })

    // Validate AI context
    if (!isValidAIContext(trimmedAIContext)) {
      console.log("Validation failed: AI context too short", { 
        length: trimmedAIContext.length, 
        minRequired: AI_CONTEXT_MIN_LENGTH 
      })
      return NextResponse.json(
        { success: false, error: `AI yo'riqnomasi kamida ${AI_CONTEXT_MIN_LENGTH} belgi bo'lishi kerak` },
        { status: 400 }
      )
    }

    // Validate embeddings
    if (trimmedEmbeddings.length > MAX_EMBEDDINGS) {
      return NextResponse.json(
        { success: false, error: `Maksimal ${MAX_EMBEDDINGS} ta ma'lumot qo'shish mumkin` },
        { status: 400 }
      )
    }

    for (const embedding of trimmedEmbeddings) {
      if (!isValidEmbedding(embedding)) {
        return NextResponse.json(
          { success: false, error: `Har bir ma'lumot kamida ${EMBEDDING_MIN_LENGTH} belgi bo'lishi kerak` },
          { status: 400 }
        )
      }
    }

    // Prepare data for backend (JSON payload format)
    const aiConfigData: any = {
      ai_context: trimmedAIContext,
      embeddings: trimmedEmbeddings,
    }
    
    // Add company_id if provided
    if (company_id) {
      aiConfigData.company_id = company_id
    }

    console.log("Sending AI config to backend:", aiConfigData)

    try {
      // Send request to backend
      const response = await apiCall(apiConfig.endpoints.aiConfig, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken.value}`,
        },
        body: JSON.stringify(aiConfigData),
      })

      const data = await response.json()
      console.log("Backend AI config response:", data)

      if (response.ok && data.success) {
        return NextResponse.json({
          success: true,
          message: data.message || "AI sozlamalari muvaffaqiyatli saqlandi",
        })
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: data.error || data.message || "AI sozlamalarni saqlashda xatolik yuz berdi" 
          },
          { status: response.status }
        )
      }

    } catch (networkError) {
      const errorMessage = handleApiError(networkError)
      console.error("Network error during AI config:", networkError)
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 503 } // Service Unavailable
      )
    }

  } catch (error) {
    console.error("AI config error:", error)
    return NextResponse.json(
      { success: false, error: "Server xatoligi yuz berdi" }, 
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve current AI config
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")
    
    if (!authToken) {
      return NextResponse.json(
        { success: false, error: "Avtorizatsiya talab qilinadi" },
        { status: 401 }
      )
    }

    // TODO: Get user's AI config from database
    // For now return mock data
    const mockConfig = {
      success: true,
      data: {
        company_description: "",
        ai_context: "",
        embeddings: [],
        is_configured: false,
      }
    }

    return NextResponse.json(mockConfig)

  } catch (error) {
    console.error("Get AI config error:", error)
    return NextResponse.json(
      { success: false, error: "Server xatoligi yuz berdi" }, 
      { status: 500 }
    )
  }
}