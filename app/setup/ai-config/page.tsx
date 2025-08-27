"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Plus, X, Bot } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const translations = {
  uz: {
    language: "O'zbek",
    setupTitle: "AI Sozlamalarini To'ldiring",
    setupDescription: "Ro'yxatdan o'tishni yakunlash uchun AI sozlamalarini to'ldiring",
    companyDescription: "Kompaniya Tavsifi",
    companyDescriptionPlaceholder: "Kompaniyangiz faoliyati, xizmatlar va mahsulotlar haqida batafsil yozing...",
    aiContext: "AI Suhbat Yo'riqnomasi",
    aiContextPlaceholder: "ChatGPT mijozlar bilan qanday suhbat olib borishi kerakligini tushuntiring. Masalan: 'Mijozlarga do'stona va professional yondashish, mahsulot haqida aniq ma'lumot berish, savollarni sabr bilan javoblash'",
    embeddings: "Kompaniya Ma'lumotlari",
    embeddingsDescription: "ChatGPT javob berish uchun foydalanadigan kompaniya ma'lumotlarini qo'shing",
    addEmbedding: "Ma'lumot qo'shish",
    embeddingPlaceholder: "Masalan: 'Biz 2020-yilda tashkil etilgan IT kompaniyamiz' yoki 'Mahsulotimiz narxi 100$ dan boshlanadi'",
    saveButton: "Sozlamalarni saqlash",
    backToDashboard: "Bosh sahifaga o'tish",
    companyDescriptionRequired: "Kompaniya tavsifi kiritilishi shart",
    aiContextRequired: "AI yo'riqnomasi kiritilishi shart",
    saveSuccess: "AI sozlamalari muvaffaqiyatli saqlandi!",
    saveError: "Sozlamalarni saqlashda xatolik yuz berdi",
    removeEmbedding: "O'chirish",
  },
  ru: {
    language: "Русский",
    setupTitle: "Заполните настройки ИИ",
    setupDescription: "Завершите регистрацию, заполнив настройки ИИ",
    companyDescription: "Описание компании",
    companyDescriptionPlaceholder: "Подробно опишите деятельность, услуги и продукты вашей компании...",
    aiContext: "Руководство для ИИ-диалога",
    aiContextPlaceholder: "Объясните, как ChatGPT должен общаться с клиентами. Например: 'Дружелюбный и профессиональный подход к клиентам, предоставление точной информации о продуктах, терпеливые ответы на вопросы'",
    embeddings: "Информация о компании",
    embeddingsDescription: "Добавьте информацию о компании, которую ChatGPT будет использовать для ответов",
    addEmbedding: "Добавить информацию",
    embeddingPlaceholder: "Например: 'Мы IT-компания, основанная в 2020 году' или 'Цена нашего продукта начинается от $100'",
    saveButton: "Сохранить настройки", 
    backToDashboard: "Перейти на главную",
    companyDescriptionRequired: "Описание компании обязательно",
    aiContextRequired: "Руководство для ИИ обязательно",
    saveSuccess: "Настройки ИИ успешно сохранены!",
    saveError: "Ошибка при сохранении настроек",
    removeEmbedding: "Удалить",
  },
  en: {
    language: "English",
    setupTitle: "Complete AI Setup",
    setupDescription: "Complete your registration by filling out AI settings",
    companyDescription: "Company Description",
    companyDescriptionPlaceholder: "Describe your company's activities, services and products in detail...",
    aiContext: "AI Conversation Guidelines",
    aiContextPlaceholder: "Explain how ChatGPT should communicate with customers. For example: 'Friendly and professional approach to customers, provide accurate product information, answer questions patiently'",
    embeddings: "Company Information",
    embeddingsDescription: "Add company information that ChatGPT will use to provide answers",
    addEmbedding: "Add Information",
    embeddingPlaceholder: "For example: 'We are an IT company founded in 2020' or 'Our product pricing starts from $100'",
    saveButton: "Save Settings",
    backToDashboard: "Go to Dashboard",
    companyDescriptionRequired: "Company description is required",
    aiContextRequired: "AI guidelines are required",
    saveSuccess: "AI settings saved successfully!",
    saveError: "Error saving settings",
    removeEmbedding: "Remove",
  },
}

export default function AIConfigPage() {
  const { language, setLanguage } = useLanguage()
  const [aiContext, setAiContext] = useState("")
  const [embeddings, setEmbeddings] = useState<string[]>([""])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // @ts-ignore
  const t = (key: string) => translations[language]?.[key] || translations["uz"]?.[key] || key

  // Get user data from localStorage or URL params
  const getUserData = () => {
    try {
      // First try localStorage
      const userData = localStorage.getItem('user')
      if (userData) {
        return JSON.parse(userData)
      }
      
      // Fallback: check URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const userIdFromUrl = urlParams.get('user_id')
      if (userIdFromUrl && userIdFromUrl !== 'unknown') {
        return { id: userIdFromUrl }
      }
      
      return null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }

  // Prevent going back to register page
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // Push current state again to prevent going back
      window.history.pushState(null, '', window.location.pathname)
    }

    // Add initial state
    window.history.pushState(null, '', window.location.pathname)
    
    // Listen for back button
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const addEmbedding = () => {
    setEmbeddings([...embeddings, ""])
  }

  const removeEmbedding = (index: number) => {
    if (embeddings.length > 1) {
      setEmbeddings(embeddings.filter((_, i) => i !== index))
    }
  }

  const updateEmbedding = (index: number, value: string) => {
    const newEmbeddings = [...embeddings]
    newEmbeddings[index] = value
    setEmbeddings(newEmbeddings)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()


    if (!aiContext.trim()) {
      toast({
        title: "Xatolik",
        description: t("aiContextRequired"),
        variant: "destructive",
      })
      return
    }

    if (aiContext.trim().length < 30) {
      toast({
        title: "Xatolik",
        description: "AI yo'riqnomasi kamida 30 ta belgi bo'lishi kerak",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const filteredEmbeddings = embeddings.filter(e => e.trim())
      
      // Validate embeddings length
      for (const embedding of filteredEmbeddings) {
        if (embedding.trim().length < 10) {
          toast({
            title: "Xatolik",
            description: "Har bir ma'lumot kamida 10 ta belgi bo'lishi kerak",
            variant: "destructive",
          })
          return
        }
      }
      
      const userData = getUserData()
      console.log("User data from localStorage:", userData)
      
      const payload: any = {
        ai_context: aiContext.trim(),
        embeddings: filteredEmbeddings,
      }
      
      // Add company_id (user ID) if available
      if (userData?.id) {
        payload.company_id = userData.id
        console.log("Added company_id to payload:", userData.id)
      } else {
        console.log("No user ID found - userData:", userData)
        // Fallback: use a default company_id or generate one
        const fallbackId = 'user_' + Date.now()
        payload.company_id = fallbackId
        console.log("Using fallback company_id:", fallbackId)
      }
      
      console.log("Frontend sending payload:", payload)
      
      if (!payload.ai_context || payload.ai_context.length === 0) {
        throw new Error("AI context bo'sh")
      }
      
      const response = await fetch(`/api/ai-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", response.status, response.statusText)
      
      let data;
      try {
        data = await response.json()
        console.log("Frontend received response data:", data)
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError)
        const textResponse = await response.text()
        console.log("Raw response:", textResponse)
        throw new Error(`Server javob bermadi yoki noto'g'ri format: ${response.status} ${response.statusText}`)
      }

      if (response.ok && data.success) {
        toast({
          title: "Muvaffaqiyat",
          description: data.message || t("saveSuccess"),
        })
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1000)
      } else {
        toast({
          title: "Xatolik",
          description: data.error || t("saveError"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("AI config error:", error)
      toast({
        title: "Xatolik",
        description: `Tarmoq xatoligi: ${error instanceof Error ? error.message : 'Noma\'lum xatolik'}`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AliCho</span>
            </Link>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "uz" | "ru" | "en")}
              className="text-sm border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="uz">uz UZ</option>
              <option value="ru">ru RU</option>
              <option value="en">en EN</option>
            </select>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl mt-16">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("setupTitle")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("setupDescription")}</p>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              ⚠️ Bu ma'lumotlar majburiy - AI xizmatlardan foydalanish uchun to'ldiring
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">


              {/* AI Context */}
              <div>
                <Label htmlFor="ai_context" className="flex items-center text-sm font-medium text-gray-700">
                  <Bot className="h-4 w-4 mr-2" />
                  {t("aiContext")}
                </Label>
                <div className="mt-1">
                  <Textarea
                    id="ai_context"
                    name="ai_context"
                    required
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder={t("aiContextPlaceholder")}
                    rows={4}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Embeddings */}
              <div>
                <Label className="flex items-center text-sm font-medium text-gray-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {t("embeddings")}
                </Label>
                <p className="text-xs text-gray-500 mt-1">{t("embeddingsDescription")}</p>
                
                <div className="mt-3 space-y-3">
                  {embeddings.map((embedding, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Textarea
                        value={embedding}
                        onChange={(e) => updateEmbedding(index, e.target.value)}
                        placeholder={t("embeddingPlaceholder")}
                        rows={2}
                        className="flex-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      />
                      {embeddings.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmbedding(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addEmbedding}
                    className="w-full flex items-center justify-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addEmbedding")}
                  </Button>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isLoading ? "..." : t("saveButton")}
                </Button>
              </div>
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}