/**
 * @jest-environment node
 */

import { POST, GET } from './route'
import { NextRequest } from 'next/server'

// Mock cookies - will be overridden in individual tests
const mockCookieGet = jest.fn()
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: mockCookieGet,
  })),
}))

// Mock API calls
jest.mock('@/lib/api', () => ({
  apiCall: jest.fn(),
  apiConfig: {
    endpoints: {
      aiConfig: '/api/ai-config'
    }
  },
  handleApiError: jest.fn((error) => error.message || 'Network error')
}))

const mockApiCall = require('@/lib/api').apiCall as jest.MockedFunction<any>

describe('/api/ai-config', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Default: authenticated user
    mockCookieGet.mockImplementation((name) => {
      if (name === 'auth-token') {
        return { value: 'mock_token_123' }
      }
      return null
    })
  })

  describe('POST', () => {
    it('should save AI config with valid data', async () => {
      const validData = {
        company_id: 'user_123456789',
        ai_context: 'Always be professional and helpful. Provide accurate information about our services and pricing.',
        embeddings: [
          'Our company was founded in 2020',
          'We offer 24/7 customer support',
          'Our pricing starts from $99/month'
        ],
      }

      // Mock successful API response
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "AI sozlamalari muvaffaqiyatli saqlandi"
        })
      })

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('AI sozlamalari muvaffaqiyatli saqlandi')
    })

    it('should return 401 without auth token', async () => {
      // Mock no auth token
      mockCookieGet.mockReturnValue(null)

      const validData = {
        company_description: 'Test company description',
        ai_context: 'Test AI context',
        embeddings: ['Test embedding'],
      }

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Avtorizatsiya talab qilinadi')
    })

    it('should return 400 for missing AI context', async () => {
      const invalidData = {
        embeddings: ['Test embedding that is long enough'],
      }

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe("AI yo'riqnomasi kiritilishi shart")
    })


    it('should return 400 for short AI context', async () => {
      const invalidData = {
        ai_context: 'Too short',
        embeddings: ['Test embedding that is long enough'],
      }

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('AI yo\'riqnomasi kamida 30 belgi bo\'lishi kerak')
    })

    it('should return 400 for too many embeddings', async () => {
      const invalidData = {
        ai_context: 'This is a valid AI context that is long enough',
        embeddings: Array(25).fill('Valid embedding content here'),
      }

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Maksimal 20 ta ma\'lumot qo\'shish mumkin')
    })

    it('should return 400 for short embedding', async () => {
      const invalidData = {
        ai_context: 'This is a valid AI context that is long enough',
        embeddings: ['Short'],
      }

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Har bir ma\'lumot kamida 10 belgi bo\'lishi kerak')
    })

    it('should filter empty embeddings', async () => {
      const validData = {
        ai_context: 'This is a valid AI context that is long enough',
        embeddings: [
          'Valid embedding content here',
          '',
          '   ',
          'Another valid embedding content'
        ],
      }

      // Mock successful API response
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "AI sozlamalari muvaffaqiyatli saqlandi"
        })
      })

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should return 400 for invalid content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: 'invalid body',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Content-Type application/json bo\'lishi kerak')
    })

    it('should return 400 for malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Noto\'g\'ri JSON format')
    })

    it('should trim whitespace from inputs', async () => {
      const dataWithSpaces = {
        ai_context: '  This is a valid AI context that is long enough  ',
        embeddings: [
          '  Valid embedding content here  ',
          '  Another valid embedding content  '
        ],
      }

      // Mock successful API response
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "AI sozlamalari muvaffaqiyatli saqlandi"
        })
      })

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithSpaces),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })

  describe('GET', () => {
    it('should return AI config for authenticated user', async () => {
      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toBeDefined()
      expect(data.data.is_configured).toBe(false)
    })

    it('should return 401 without auth token for GET', async () => {
      // Mock no auth token
      mockCookieGet.mockReturnValue(null)

      const request = new NextRequest('http://localhost:3000/api/ai-config', {
        method: 'GET',
      })

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Avtorizatsiya talab qilinadi')
    })
  })
})