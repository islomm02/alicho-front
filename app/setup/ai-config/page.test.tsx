import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AIConfigPage from './page'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Mock Next.js router
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

// Mock fetch
global.fetch = jest.fn()

// Helper to render with LanguageProvider
const renderWithLanguageProvider = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      {ui}
    </LanguageProvider>
  )
}

describe('AIConfigPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  it('renders AI config form correctly', () => {
    renderWithLanguageProvider(<AIConfigPage />)

    expect(screen.getByText("AI Sozlamalarini To'ldiring")).toBeInTheDocument()
    expect(screen.getByText("Ro'yxatdan o'tishni yakunlash uchun AI sozlamalarini to'ldiring")).toBeInTheDocument()
    expect(screen.getByLabelText('AI Suhbat Yo\'riqnomasi')).toBeInTheDocument()
    expect(screen.getByText('Kompaniya Ma\'lumotlari')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sozlamalarni saqlash' })).toBeInTheDocument()
  })

  it('shows mandatory warning message', () => {
    renderWithLanguageProvider(<AIConfigPage />)
    
    expect(screen.getByText('⚠️ Bu ma\'lumotlar majburiy - AI xizmatlardan foydalanish uchun to\'ldiring')).toBeInTheDocument()
  })

  it('does not show skip button', () => {
    renderWithLanguageProvider(<AIConfigPage />)
    
    expect(screen.queryByText('Keyinga qoldirish')).not.toBeInTheDocument()
    expect(screen.queryByText('Skip for now')).not.toBeInTheDocument()
    expect(screen.queryByText('Отложить')).not.toBeInTheDocument()
  })

  it('does not show back to dashboard link', () => {
    renderWithLanguageProvider(<AIConfigPage />)
    
    expect(screen.queryByText('Bosh sahifaga qaytish')).not.toBeInTheDocument()
    expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Перейти на главную')).not.toBeInTheDocument()
  })

  it('changes language correctly', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<AIConfigPage />)

    const languageSelect = screen.getByRole('combobox')
    await user.selectOptions(languageSelect, 'en')

    expect(screen.getByText('Complete AI Setup')).toBeInTheDocument()
    expect(screen.getByText('Complete your registration by filling out AI settings')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save Settings' })).toBeInTheDocument()

    await user.selectOptions(languageSelect, 'ru')

    expect(screen.getByText('Заполните настройки ИИ')).toBeInTheDocument()
    expect(screen.getByText('Завершите регистрацию, заполнив настройки ИИ')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Сохранить настройки' })).toBeInTheDocument()
  })


  it('shows validation error for empty AI context', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<AIConfigPage />)

    const submitButton = screen.getByRole('button', { name: 'Sozlamalarni saqlash' })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'AI yo\'riqnomasi kiritilishi shart',
      variant: 'destructive',
    })
  })

  it('can add and remove embeddings', async () => {
    const user = userEvent.setup()
    renderWithLanguageProvider(<AIConfigPage />)

    // Initially should have 1 embedding field (excluding AI Context field)
    const embeddingInputs = screen.getAllByPlaceholderText(/Masalan: 'Biz 2020/)
    expect(embeddingInputs).toHaveLength(1)

    // Add embedding
    const addButton = screen.getByRole('button', { name: 'Ma\'lumot qo\'shish' })
    await user.click(addButton)

    // Should now have 2 embedding fields
    const embeddingInputsAfterAdd = screen.getAllByPlaceholderText(/Masalan: 'Biz 2020/)
    expect(embeddingInputsAfterAdd).toHaveLength(2)

    // Remove embedding (X button should appear when there are multiple)
    const removeButtons = screen.getAllByRole('button')
    const removeButton = removeButtons.find(button => button.querySelector('svg')) // X icon
    
    if (removeButton && removeButton !== addButton) {
      await user.click(removeButton)
      // Should be back to 1 embedding field
      const embeddingInputsAfterRemove = screen.getAllByPlaceholderText(/Masalan: 'Biz 2020/)
      expect(embeddingInputsAfterRemove).toHaveLength(1)
    }
  })

  it('submits form successfully with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        success: true,
        message: 'AI sozlamalari muvaffaqiyatli saqlandi',
      }),
    }
    ;(global.fetch as jest.Mock).mockResolvedValue(mockResponse)

    renderWithLanguageProvider(<AIConfigPage />)

    const aiContextInput = screen.getByLabelText('AI Suhbat Yo\'riqnomasi')
    const embeddingInput = screen.getByPlaceholderText(/Masalan: 'Biz 2020/)

    await user.type(aiContextInput, 'Always be professional and helpful. Provide accurate information about our services.')
    await user.type(embeddingInput, 'Our company was founded in 2020 and we serve 100+ clients.')

    const submitButton = screen.getByRole('button', { name: 'Sozlamalarni saqlash' })
    await user.click(submitButton)

    expect(global.fetch).toHaveBeenCalledWith('/api/ai-config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ai_context: 'Always be professional and helpful. Provide accurate information about our services.',
        embeddings: ['Our company was founded in 2020 and we serve 100+ clients.'],
      }),
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Muvaffaqiyat',
      description: 'AI sozlamalari muvaffaqiyatli saqlandi',
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

    renderWithLanguageProvider(<AIConfigPage />)

    const aiContextInput = screen.getByLabelText('AI Suhbat Yo\'riqnomasi')

    await user.type(aiContextInput, 'Valid AI context that meets requirements')

    const submitButton = screen.getByRole('button', { name: 'Sozlamalarni saqlash' })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Server xatoligi',
      variant: 'destructive',
    })
  })

  it('handles network error correctly', async () => {
    const user = userEvent.setup()
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    renderWithLanguageProvider(<AIConfigPage />)

    const aiContextInput = screen.getByLabelText('AI Suhbat Yo\'riqnomasi')

    await user.type(aiContextInput, 'Valid AI context that meets requirements')

    const submitButton = screen.getByRole('button', { name: 'Sozlamalarni saqlash' })
    await user.click(submitButton)

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Xatolik',
      description: 'Tarmoq xatoligi yuz berdi',
      variant: 'destructive',
    })
  })
})