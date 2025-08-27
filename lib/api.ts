const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const apiConfig = {
  baseURL: API_BASE_URL,
  endpoints: {
    register: '/api/register',
    login: '/api/login', 
    aiConfig: '/api/ai-config',
    tariffs: '/api/tariffs'
  }
}

export async function apiCall(endpoint: string, options:any) {
  const url = `${API_BASE_URL}${endpoint}`
  
  console.log(`API Call: ${options.method || 'GET'} ${url}`)
  
 

  try {
    const response = await fetch(url)
    console.log(`API Response: ${response.status} ${response.statusText}`)
    return response
  } catch (error) {
    console.error('API Call Error:', error)
    throw error
  }
}

export function handleApiError(error: any): string {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Backend server bilan bog\'lanib bo\'lmadi. Server ishlaganligini tekshiring.'
  }
  
  if (error.code === 'ECONNREFUSED') {
    return 'Backend server ishlamayapti'
  }
  
  return error.message || 'Noma\'lum xatolik yuz berdi'
}