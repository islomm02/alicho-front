"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, MessageSquare, Globe, Users, Zap, Instagram, Settings, Send } from "lucide-react"
import Link from "next/link"
import { useLanguage, getCookie } from "@/contexts/LanguageContext"
import data from "@/messages/home.json"
import { getCookies } from "@/hooks/cookie"

const translations = data 

interface TariffPlan {
  id: number
  name: string
  price: number
  currency: string
  features: string[]
}

const featureTranslationMap: Record<string, string> = {
  'messages_limit_10000': 'messages10k',
  'messages_limit_30000': 'messages30k', 
  'messages_limit_50000': 'messages50k',
  'leads_limit_1000': 'leads1k',
  'leads_limit_3000': 'leads3k',
  'leads_limit_5000': 'leads5k',
  'instagram_integration': 'instagramIntegration',
  'amocrm_integration': 'amocrmIntegration',
  'telegram_integration': 'telegramIntegration',
  'task_automation': 'taskAutomation',
  'ai_support_24_7': 'ai247Support',
  'multilingual_support': 'multilingualSupport',
  'analytics_panel': 'analyticsPanel',
  'priority_support': 'prioritySupport',
  'unlimited_integrations': 'unlimitedIntegrations',
  'account_management': 'accountManagement',
  'advanced_analytics': 'advancedAnalytics',
  'custom_ai_training': 'customAI'
}

export default function HomePage() {
  const { language, setLanguage, t: globalT } = useLanguage()
  const [tariffPlans, setTariffPlans] = useState<TariffPlan[]>([])
  const [loading, setLoading] = useState(true)
  const t = translations[language]
  const [cookie, setCookie] = useState<string | null>("")

  
  useEffect(() => {
    const defaultTariffs = [
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
    setCookie(localStorage.getItem("company_id") || null)
    setTariffPlans(defaultTariffs)
    setLoading(false)
  }, [])

  const handleSelectPlan = (planId: number) => {
    window.location.href = `/register?plan=${planId}`
  }

  const getPlanName = (planName: string) => {
    switch (planName) {
      case 'basic': return t.basicPlan
      case 'standard': return t.standardPlan
      case 'premium': return t.premiumPlan
      default: return planName
    }
  }

  const getFeatureTranslation = (featureKey: string) => {
    const translationKey = featureTranslationMap[featureKey]
    return translationKey ? (t as any)[translationKey] : featureKey
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex  items-center">
              <MessageSquare className="h-5 w-5 sm:w-8 sm:h-8 text-purple-600" />
              <span className="ml-2 sm:text-xl text-lg font-bold text-gray-900">AliCho</span>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "uz" | "ru" | "en")}
                className="text-sm  border border-gray-300 rounded-md px-2 py-1"
              >
                <option value="uz">🇺🇿 O'zbek</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="en">🇺🇸 English</option>
              </select>
              <Link className={`${cookie ? "hidden" : ""}`} href="/login">
                <Button variant="ghost">{t.login}</Button>
              </Link>
              <Link className="px-0 mr-4" href={` ${cookie ? "/admin/ai-history" : "/register"}  `}>
                <Button   className="bg-purple-600 text-[10px] py-0 hover:bg-purple-700">{ cookie ?  "Admin page" :  t.register  }</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-purple-600 border-purple-200">
            <Zap className="w-4 h-4 mr-1" />
            {t.aiPowered}
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            {t.heroTitle}
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t.heroDescription}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
  onClick={() => document.location.pathname = "/register"} 
  size="lg" 
  className="bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2 px-6 sm:px-8"
>
  <Zap className="w-5 h-5" />
  {t.startAutomation}
</Button>

            <span className="text-sm text-gray-500">{t.noCreditCard}</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.completeSolution}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t.solutionDescription}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-pink-600" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.multiPlatform}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.multiPlatformDesc}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.smartTasks}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.smartTasksDesc}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.smartLeads}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.smartLeadsDesc}</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{t.ai247}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{t.ai247Desc}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">{t.integrations}</h2>

          <div className="flex flex-wrap justify-center gap-6">
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <Instagram className="w-5 h-5 mr-2 text-pink-600" />
              {t.instagram}
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              {t.amocrm}
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-lg bg-white">
              <Send className="w-5 h-5 mr-2 text-blue-500" />
              {t.telegramBot}
            </Badge>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.pricing}</h2>
            <p className="text-xl text-gray-600">{t.pricingDesc}</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-lg text-gray-600">Tariff planlar yuklanmoqda...</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {tariffPlans.map((plan, index) => (
                <Card key={plan.id} className={`relative border-2 ${index === 0 ? 'border-purple-200' : 'border-gray-200'}`}>
                  {index === 0 ? (
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-lg">
                      <Badge className="mb-4 bg-white text-purple-600">{t.mostPopular}</Badge>
                      <h3 className="text-2xl font-bold mb-2">{getPlanName(plan.name)}</h3>
                      <div className="text-4xl font-bold mb-1">{plan.price.toLocaleString()}</div>
                      <div className="text-purple-100">{t.monthly}</div>
                    </div>
                  ) : (
                    <CardHeader className="p-6 bg-gray-50">
                      <h3 className="text-2xl font-bold mb-2">{getPlanName(plan.name)}</h3>
                      <div className="text-4xl font-bold mb-1">{plan.price.toLocaleString()}</div>
                      <div className="text-gray-500">{t.monthly}</div>
                    </CardHeader>
                  )}
                  <CardContent className="p-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="w-5 h-5 text-green-500 mr-3" />
                          {getFeatureTranslation(feature)}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full mt-6 ${index === 0 
                        ? 'bg-purple-600 hover:bg-purple-700' 
                        : 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                      variant={index === 0 ? 'default' : 'outline'}
                    >
                      {t.startAutomation}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <MessageSquare className="h-8 w-8 text-purple-400" />
            <span className="ml-2 text-xl font-bold">AliCho</span>
          </div>

          <div className="mb-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white">
              {t.privacyPolicy}
            </Link>
          </div>

          <div className="text-gray-400 mb-4">{t.companyName}</div>

          <div className="text-gray-500 text-sm">{t.copyright}</div>
        </div>
      </footer>
    </div>
  )
}
