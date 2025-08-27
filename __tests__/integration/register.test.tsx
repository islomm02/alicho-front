/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/register/page'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock toast hook
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

// Helper to render with LanguageProvider
const renderWithLanguageProvider = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  )
}

describe('Register Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should complete full registration flow successfully', async () => {
    const user = userEvent.setup()
    
    // Mock successful API response
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        user: { id: '1', name: 'John Doe', email: 'john@example.com' }
      }),
    })

    renderWithLanguageProvider(<RegisterPage />)

    // Fill in the form
    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    const companyInput = screen.getByLabelText('Kompaniya nomi')
    const passwordInput = screen.getByLabelText('Parol')
    const confirmPasswordInput = screen.getByLabelText('Parolni tasdiqlang')

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(companyInput, 'Acme Corporation')
    await user.type(passwordInput, 'securePassword123')
    await user.type(confirmPasswordInput, 'securePassword123')

    // Submit the form
    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    // Wait for the API call and success message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Muvaffaqiyat',
        description: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
      })
    })

    // Verify the API was called with correct data
    expect(global.fetch).toHaveBeenCalledWith('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        company_name: 'Acme Corporation',
        password: 'securePassword123',
        tariff_plan_id: 1,
      }),
    })
  })

  it('should handle server validation errors', async () => {
    const user = userEvent.setup()
    
    // Mock error response
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({
        success: false,
        error: "Email manzil noto'g'ri formatda"
      }),
    })

    renderWithLanguageProvider(<RegisterPage />)

    // Fill in form with invalid email
    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    const companyInput = screen.getByLabelText('Kompaniya nomi')
    const passwordInput = screen.getByLabelText('Parol')
    const confirmPasswordInput = screen.getByLabelText('Parolni tasdiqlang')

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'invalid-email') 
    await user.type(companyInput, 'Acme Corp')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    // Wait for server validation error
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Xatolik',
        description: "Email manzil noto'g'ri formatda",
        variant: 'destructive',
      })
    })
  })

  it('should handle network errors', async () => {
    const user = userEvent.setup()
    
    // Mock network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    renderWithLanguageProvider(<RegisterPage />)

    // Fill form with valid data
    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    const companyInput = screen.getByLabelText('Kompaniya nomi')
    const passwordInput = screen.getByLabelText('Parol')
    const confirmPasswordInput = screen.getByLabelText('Parolni tasdiqlang')

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(companyInput, 'Acme Corp')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password123')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Xatolik',
        description: 'Tarmoq xatoligi yuz berdi',
        variant: 'destructive',
      })
    })
  })

  it('should test multi-language functionality', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    // Change to English
    const languageSelect = screen.getByRole('combobox')
    await user.selectOptions(languageSelect, 'en')

    expect(screen.getByText('Create a new account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()

    // Change to Russian
    await user.selectOptions(languageSelect, 'ru')

    expect(screen.getByText('Создайте новый аккаунт')).toBeInTheDocument()
    expect(screen.getByLabelText('Полное имя')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Зарегистрироваться' })).toBeInTheDocument()
  })
})