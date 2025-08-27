import { NextResponse } from "next/server"
import { apiCall, apiConfig } from "@/lib/api"

interface TariffPlan {
  id: number
  name: string
  price: number
  currency: string
  features: string[]
}

interface TariffResponse {
  success: boolean
  data?: TariffPlan[]
  error?: string
}

export async function GET(): Promise<NextResponse<TariffResponse>> {
  try {
    
    const response = await apiCall(apiConfig.endpoints.tariffs, {
      method: 'GET',
    })

    const data = await response.json()

    if (response.ok && data.success) {
      return NextResponse.json({
        success: true,
        data: data.data,
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: data.error || "Tariff planlarni olishda xatolik yuz berdi" 
        },
        { status: response.status }
      )
    }

  } catch (networkError) {
    console.error("Network error fetching tariffs:", networkError)
    
    // Fallback to default tariffs if backend is unavailable
    const defaultTariffs: TariffPlan[] = [
      {
        id: 1,
        name: 'basic',
        price: 199000,
        currency: 'UZS',
        features: [
          'messages_limit_10000',
          'leads_limit_1000',
          'instagram_integration',
          'amocrm_integration',
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel'
        ]
      },
      {
        id: 2,
        name: 'standard',
        price: 399000,
        currency: 'UZS',
        features: [
          'messages_limit_30000',
          'leads_limit_3000',
          'instagram_integration',
          'amocrm_integration',
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel',
          'priority_support',
          'unlimited_integrations'
        ]
      },
      {
        id: 3,
        name: 'premium',
        price: 599000,
        currency: 'UZS',
        features: [
          'messages_limit_50000',
          'leads_limit_5000',
          'instagram_integration',
          'amocrm_integration',
          'telegram_integration',
          'task_automation',
          'ai_support_24_7',
          'multilingual_support',
          'analytics_panel',
          'account_management',
          'advanced_analytics',
          'custom_ai_training'
        ]
      }
    ]

    return NextResponse.json({
      success: true,
      data: defaultTariffs,
    })
  }
}