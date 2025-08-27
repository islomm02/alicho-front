import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { apiCall, apiConfig, handleApiError } from "@/lib/api"

interface RegisterRequest {
  name: string
  email: string
  company_name: string
  password: string
  tariff_plan_id: number
  confirmPassword?: string
}

interface RegisterResponse {
  success: boolean
  message?: string
  user?: {
    id: string
    name: string
    email: string
    company_name?: string
  }
  token?: string
  error?: string
  errors?: Record<string, string[]>
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 6
const NAME_MIN_LENGTH = 2
const COMPANY_NAME_MIN_LENGTH = 2

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email) && email.length <= 254
}

function isValidName(name: string): boolean {
  return name.length >= NAME_MIN_LENGTH && name.length <= 100 && /^[a-zA-Z\s\u0400-\u04FF\u0410-\u044F]+$/.test(name)
}

function isValidCompanyName(companyName: string): boolean {
  return companyName.length >= COMPANY_NAME_MIN_LENGTH && companyName.length <= 100
}

function isStrongPassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return { isValid: false, message: `Parol kamida ${PASSWORD_MIN_LENGTH} belgi bo'lishi kerak` }
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Parol 128 belgidan oshmasligi kerak" }
  }
  
  // Simplified validation - just length for now
  return { isValid: true }
}

export async function POST(request: NextRequest): Promise<NextResponse<RegisterResponse>> {
  try {
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type application/json bo'lishi kerak" },
        { status: 400 }
      )
    }

    let body: RegisterRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Noto'g'ri JSON format" },
        { status: 400 }
      )
    }

    const { name, email, company_name, password, tariff_plan_id } = body

    // Basic validation before sending to backend
    if (!name || !email || !company_name || !password) {
      return NextResponse.json(
        { success: false, error: "Barcha maydonlar kiritilishi shart" }, 
        { status: 400 }
      )
    }

    // Validate name
    if (!isValidName(name.trim())) {
      return NextResponse.json(
        { success: false, error: "To'liq ism kamida 2 ta harfdan iborat bo'lishi kerak" },
        { status: 400 }
      )
    }

    // Validate email
    if (!isValidEmail(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Email manzil noto'g'ri formatda" },
        { status: 400 }
      )
    }

    // Validate company name
    if (!isValidCompanyName(company_name.trim())) {
      return NextResponse.json(
        { success: false, error: "Kompaniya nomi kamida 2 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      )
    }

    const passwordValidation = isStrongPassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { success: false, error: passwordValidation.message },
        { status: 400 }
      )
    }

    if (!tariff_plan_id || tariff_plan_id < 1 || tariff_plan_id > 3) {
      return NextResponse.json(
        { success: false, error: "Tariff rejasini tanlash majburiy" }, 
        { status: 400 }
      )
    }

    const registerData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company_name: company_name.trim(),
      password: password,
      password_confirmation: password, 
      tariff_plan_id: tariff_plan_id
    }


    try {
      // Send request to backend
      const response = await apiCall(apiConfig.endpoints.register, {
        method: 'POST',
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Create response object
        const responseData: RegisterResponse = {
          success: true,
          message: data.message || "Muvaffaqiyatli ro'yxatdan o'tdingiz",
          user: data.user
        }

        // Set auth cookie if backend returns token
        if (data.token) {
          const cookieStore = await cookies()
          cookieStore.set("auth-token", data.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 86400, // 24 hours
            path: "/",
          })
          
          // Include token in response for frontend client-side cookie
          responseData.token = data.token
        }

        return NextResponse.json(responseData)
      } else {
        // Handle error response
        const errorResponse: RegisterResponse = {
          success: false,
          error: data.error || data.message || "Ro'yxatdan o'tishda xatolik yuz berdi"
        }

        // Include Laravel validation errors if present
        if (data.errors) {
          errorResponse.errors = data.errors
        }

        return NextResponse.json(errorResponse, { status: response.status })
      }

    } catch (networkError) {
      const errorMessage = handleApiError(networkError)
      console.error("Network error during registration:", networkError)
      
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 503 } // Service Unavailable
      )
    }

  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { success: false, error: "Server xatoligi yuz berdi" }, 
      { status: 500 }
    )
  }
}