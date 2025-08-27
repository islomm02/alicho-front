import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegisterPage from './page'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Mock Next.js router
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock toast hook - need to mock before importing the component
const mockToast = jest.fn()
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: mockToast,
  })),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock window.location  
const mockLocation = {
  href: '',
}
delete (window as any).location
window.location = mockLocation as any

// Helper to render with LanguageProvider
const renderWithLanguageProvider = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocation.href = ''
    ;(global.fetch as jest.Mock).mockReset()
  })

  it('renders register form correctly', () => {
    renderWithLanguageProvider(<RegisterPage />)

    expect(screen.getByText('Yangi hisob yarating')).toBeInTheDocument()
    expect(screen.getByLabelText("To'liq ism")).toBeInTheDocument()
    expect(screen.getByLabelText('Email manzil')).toBeInTheDocument()
    expect(screen.getByLabelText('Kompaniya nomi')).toBeInTheDocument()
    expect(screen.getByLabelText('Parol')).toBeInTheDocument()
    expect(screen.getByLabelText('Parolni tasdiqlang')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: "Ro'yxatdan o'tish" })).toBeInTheDocument()
  })

  it('changes language correctly', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const languageSelect = screen.getByRole('combobox')
    await user.selectOptions(languageSelect, 'en')

    expect(screen.getByText('Create a new account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: "To'liq ism kiritilishi shart",
      variant: 'destructive',
    })
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const nameInput = screen.getByLabelText("To'liq ism")
    await user.type(nameInput, 'John Doe')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Email manzil kiritilishi shart',
      variant: 'destructive',
    })
  })

  it('shows validation error for empty company name', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Kompaniya nomi kiritilishi shart',
      variant: 'destructive',
    })
  })

  it('shows validation error for short password', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    const companyInput = screen.getByLabelText('Kompaniya nomi')
    const passwordInput = screen.getByLabelText('Parol')
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(companyInput, 'Acme Corp')
    await user.type(passwordInput, '123')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Parol kamida 6 ta belgi bo\'lishi kerak',
      variant: 'destructive',
    })
  })

  it('shows validation error for password mismatch', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const nameInput = screen.getByLabelText("To'liq ism")
    const emailInput = screen.getByLabelText('Email manzil')
    const companyInput = screen.getByLabelText('Kompaniya nomi')
    const passwordInput = screen.getByLabelText('Parol')
    const confirmPasswordInput = screen.getByLabelText('Parolni tasdiqlang')
    
    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(companyInput, 'Acme Corp')
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'different123')

    const submitButton = screen.getByRole('button', { name: "Ro'yxatdan o'tish" })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Parollar mos kelmaydi',
      variant: 'destructive',
    })
  })

  it('toggles password visibility', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<RegisterPage />)

    const passwordInput = screen.getByLabelText('Parol')
    const toggleButton = passwordInput.parentElement?.querySelector('button')

    expect(passwordInput).toHaveAttribute('type', 'password')

    if (toggleButton) {
      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'text')

      await user.click(toggleButton)
      expect(passwordInput).toHaveAttribute('type', 'password')
    }
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        message: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
        user: { id: '1', name: 'John Doe', email: 'john@example.com' }
      }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    renderWithLanguageProvider(<RegisterPage />)

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
      expect(global.fetch).toHaveBeenCalledWith('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          company_name: 'Acme Corp',
          password: 'password123',
          tariff_plan_id: 1,
        }),
      })
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Muvaffaqiyat',
      description: "Muvaffaqiyatli ro'yxatdan o'tdingiz",
    })
  })

  it('handles server error correctly', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: false,
      json: jest.fn().mockResolvedValue({
        success: false,
        error: 'Server xatoligi',
      }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    renderWithLanguageProvider(<RegisterPage />)

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
        description: 'Server xatoligi',
        variant: 'destructive',
      })
    })
  })

  it('handles network error correctly', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    renderWithLanguageProvider(<RegisterPage />)

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

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    let resolvePromise: (value: any) => void
    const fetchPromise = new Promise((resolve) => {
      resolvePromise = resolve
    })
    ;(global.fetch as jest.Mock).mockReturnValue(fetchPromise)

    renderWithLanguageProvider(<RegisterPage />)

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

    expect(submitButton).toBeDisabled()
    expect(screen.getByText('...')).toBeInTheDocument()

    // Resolve the promise to finish the test
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Success' }),
    })
  })
})