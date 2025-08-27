/**
 * @jest-environment node
 */

import { POST } from './route'
import { NextRequest } from 'next/server'
import { apiCall } from '@/lib/api'

// Mock cookies
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    set: jest.fn(),
  })),
}))

// Mock API calls
jest.mock('@/lib/api', () => ({
  apiCall: jest.fn(),
  apiConfig: {
    endpoints: {
      register: '/api/register'
    }
  },
  handleApiError: jest.fn((error) => error.message || 'Network error')
}))

const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>

describe('/api/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should register user with valid data', async () => {
      const validData = {
        name: 'John Doe',
        email: 'john@example.com',
        company_name: 'Test Company',
        password: 'password123',
        tariff_plan_id: 1,
      }

      // Mock successful API response
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
          user: {
            id: 'user123',
            name: 'John Doe',
            email: 'john@example.com',
            tariff_plan_id: 1
          },
          token: 'jwt_token_123'
        })
      } as Response)

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe("Muvaffaqiyatli ro'yxatdan o'tdingiz")
      expect(data.user).toBeDefined()
      expect(data.user.name).toBe('John Doe')
      expect(data.user.email).toBe('john@example.com')
    })

    it('should return 400 for missing name', async () => {
      const invalidData = {
        email: 'john@example.com',
        company_name: 'Test Company',
        password: 'password123',
        tariff_plan_id: 1,
      }

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Barcha maydonlar kiritilishi shart')
    })

    it('should return 400 for invalid content type', async () => {
      const request = new NextRequest('http://localhost:3000/api/register', {
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
      const request = new NextRequest('http://localhost:3000/api/register', {
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

    it('should return 400 for missing tariff_plan_id', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        company_name: 'Test Company',
        password: 'password123',
      }

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Tariff rejasini tanlash majburiy')
    })

    it('should return 400 for invalid tariff_plan_id', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        company_name: 'Test Company',
        password: 'password123',
        tariff_plan_id: 5,
      }

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Tariff rejasini tanlash majburiy')
    })

    it('should return 400 for missing company name', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        tariff_plan_id: 1,
      }

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Barcha maydonlar kiritilishi shart')
    })

    it('should return 400 for invalid company name', async () => {
      const invalidData = {
        name: 'John Doe',
        email: 'john@example.com',
        company_name: 'A', // Too short
        password: 'password123',
        tariff_plan_id: 1,
      }

      const request = new NextRequest('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Kompaniya nomi kamida 2 ta belgidan iborat bo\'lishi kerak')
    })
  })
})