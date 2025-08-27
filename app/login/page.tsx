"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { API } from "@/hooks/getApi"
import { setCookies } from "@/hooks/cookie"

const translations = {
  uz: {
    language: "O'zbek",
    login: "Kirish",
    register: "Ro'yxatdan o'tish",
    loginTitle: "Hisobingizga kiring",
    loginDescription: "AliCho platformasiga kirish uchun ma'lumotlaringizni kiriting",
    email: "Email manzil",
    emailPlaceholder: "sizning@email.com",
    password: "Parol",
    passwordPlaceholder: "Parolingizni kiriting",
    loginButton: "Kirish",
    noAccount: "Hisobingiz yo'qmi?",
    signUp: "Ro'yxatdan o'ting",
    backToHome: "Bosh sahifaga qaytish",
    emailRequired: "Email manzil kiritilishi shart",
    passwordRequired: "Parol kiritilishi shart",
    loginSuccess: "Muvaffaqiyatli kirildi!",
    loginError: "Kirish xatoligi yuz berdi",
  },
  ru: {
    language: "Русский",
    login: "Войти",
    register: "Регистрация",
    loginTitle: "Войдите в свой аккаунт",
    loginDescription: "Введите свои данные для входа в платформу AliCho",
    email: "Email адрес",
    emailPlaceholder: "ваш@email.com",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    loginButton: "Войти",
    noAccount: "Нет аккаунта?",
    signUp: "Зарегистрируйтесь",
    backToHome: "Вернуться на главную",
    emailRequired: "Email адрес обязателен",
    passwordRequired: "Пароль обязателен",
    loginSuccess: "Успешный вход!",
    loginError: "Произошла ошибка входа",
  },
  en: {
    language: "English",
    login: "Login",
    register: "Sign Up",
    loginTitle: "Login to your account",
    loginDescription: "Enter your credentials to access the AliCho platform",
    email: "Email address",
    emailPlaceholder: "your@email.com",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign up",
    backToHome: "Back to home",
    emailRequired: "Email address is required",
    passwordRequired: "Password is required",
    loginSuccess: "Login successful!",
    loginError: "Login error occurred",
  },
}

export default function LoginPage() {
  const { language, setLanguage } = useLanguage()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()


  // @ts-ignore
  const t = (key: string) => translations[language]?.[key] || translations["uz"]?.[key] || key

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast({
        title: "Xatolik",
        description: t("emailRequired"),
        variant: "destructive",
      })
      return
    }

    if (!password) {
      toast({
        title: "Xatolik",
        description: t("passwordRequired"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${API}/api/login`, {
        email: email.trim(),
        password: password.trim()
      })
      
      const data = response.data

      if (data.success && data.token) {
        setCookies("token", data.token)        
        toast({
          title: "Muvaffaqiyat",
          description: data.message || t("loginSuccess"),
        })
        
        setTimeout(() => {
          window.location.href = "/admin/ai-history"
        }, 1000)
      } else {
        toast({
          title: "Xatolik",
          description: data.error || t("loginError"),
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Tarmoq xatoligi yuz berdi"
      toast({
        title: "Xatolik",
        description: errorMessage,
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-16">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("loginTitle")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("loginDescription")}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  {t("email")}
                </Label>
                <div className="mt-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("emailPlaceholder")}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t("password")}
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("passwordPlaceholder")}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isLoading ? "..." : t("loginButton")}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">{t("noAccount")} </span>
                <Link href="/register" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                  {t("signUp")}
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link href="/" className="text-sm text-gray-600 hover:text-gray-500">
                  {t("backToHome")}
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
