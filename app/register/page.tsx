"use client"
import type React from "react"
import axios from "axios"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageSquare, Eye, EyeOff, Building, MessageCircle, Bot, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { PlusOutlined, RobotOutlined } from "@ant-design/icons"
import { API } from "@/hooks/getApi"
import  data from "@/messages/register.json"

const translations  = data

function RegisterPageContent() {
  
  const searchParams = useSearchParams()
  
  const { language, setLanguage } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tariffPlanId, setTariffPlanId] = useState<number>(1) 
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const [isMoreRegisterOpen, setIsMoreRegisterOpen] = useState(false)
  const [additionalInfoList, setAdditionalInfoList] = useState<string[]>([])
  const [companyDescription, setCompanyDescription] = useState("")
  const [aiContext, setAiContext] = useState("")
  const [isAiModalLoading, setIsAiModalLoading] = useState(false)
  
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: ""
  })
  
  const [aiModalValidationErrors, setAiModalValidationErrors] = useState({
    companyDescription: "",
    aiContext: "",
    additionalInfo: ""
  })
  // @ts-ignore
  
  
  const t = (key: string) => translations[language]?.[key] || translations["uz"]?.[key] || key


  useEffect(() => {
    
    if (isMoreRegisterOpen) {
      document.body.style.overflow = 'hidden'
    
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMoreRegisterOpen])

  useEffect(() => {
    const planParam = searchParams?.get('plan')
    if (planParam) {
      const planId = parseInt(planParam)
      if (planId >= 1 && planId <= 3) {
        setTariffPlanId(planId)
      }
    }
    
  }, [searchParams])
  

  const getTariffPlanName = (planId: number) => {
    switch (planId) {
      case 1: return t("basicPlan")
      case 2: return t("standardPlan")
      case 3: return t("premiumPlan")
      default: return t("basicPlan")
    }
  }

  const validateForm = () => {
    const errors = {
      name: "",
      email: "",
      companyName: "",
      password: "",
      confirmPassword: ""
    }

    let isValid = true

    if (!name.trim()) {
      errors.name = t("nameRequired")
      isValid = false
    }

    if (!email.trim()) {
      errors.email = t("emailRequired")
      isValid = false
    }

    if (!companyName.trim()) {
      errors.companyName = t("companyRequired")
      isValid = false
    }

    if (!password || password.length < 6) {
      errors.password = password ? t("passwordMinLength") : t("passwordRequired")
      isValid = false
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("confirmPasswordRequired")
      isValid = false
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t("passwordMismatch")
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const addAdditionalInfo = () => {
    if (additionalInfoList.length < 10) {
      setAdditionalInfoList([...additionalInfoList, ""])
    }
  }

  const updateAdditionalInfo = (index: number, value: string) => {
    const updatedList = [...additionalInfoList]
    updatedList[index] = value
    setAdditionalInfoList(updatedList)
  }

  const removeAdditionalInfo = (index: number) => {
    const updatedList = additionalInfoList.filter((_, i) => i !== index)
    setAdditionalInfoList(updatedList)
  }

  const validateAiSetup = () => {
    const errors = {
      companyDescription: "",
      aiContext: "",
      additionalInfo: ""
    }
    let isValid = true

    // Validate Company Description
    if (!companyDescription.trim()) {
      errors.companyDescription = t("companyDescriptionRequired")
      isValid = false
    } else if (companyDescription.trim().length < 50) {
      errors.companyDescription = t("companyDescriptionMinLength")
      isValid = false
    }

    // Validate AI Context
    if (!aiContext.trim()) {
      errors.aiContext = t("aiContextRequired")
      isValid = false
    } else if (aiContext.trim().length < 30) {
      errors.aiContext = t("aiContextMinLength")
      isValid = false
    }

    // Validate Additional Info
    const validAdditionalInfo = additionalInfoList.filter(info => info.trim() !== "")
    if (validAdditionalInfo.length === 0) {
      errors.additionalInfo = t("additionalInfoRequired")
      isValid = false
    } else {
      // Check if each additional info has minimum length
      const shortInfo = additionalInfoList.find(info => info.trim() !== "" && info.trim().length < 10)
      if (shortInfo) {
        errors.additionalInfo = t("additionalInfoMinLength")
        isValid = false
      }
    }

    setAiModalValidationErrors(errors)
    return isValid
  }

  const handleAiSetupSubmit = async () => {
    
    setAiModalValidationErrors({
      companyDescription: "",
      aiContext: "",
      additionalInfo: ""
    })

  

    if (!validateAiSetup()) {
      toast({
        title: t("error"),
        description: t("validationError"),
        variant: "destructive"
      })
      return
    }
    
    setIsAiModalLoading(true)
    
    try {
      // Get user data from localStorage (saved during registration)
      const userData = localStorage.getItem('user')
      let userId = null
      
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        userId = parsedUserData.id
      }

      const aiSetupPayload = {
          name: name.trim(),
          email: email.trim(),
          password:password.trim(),
          password_confirmation: confirmPassword.trim(),
          company_name: companyName.trim(),
          tariff_plan_id: tariffPlanId,
          language: language,
          ai_context: aiContext.trim(),
          embeddings: additionalInfoList.filter(info => info.trim() !== ""),
      }
      
      console.log(aiSetupPayload)

      const registerUser = async () => {     
  try {
    const res = await axios.post(`${API}/api/register`, aiSetupPayload);
    
    console.log(res);
    

    if (res.data.token) {
      document.cookie = `token=${res.data.token}; path=/; max-age=${60*60*24*7}`;
    }

    alert(res.data.company_id)

    if(res.data.company_id){
      localStorage.setItem("company_id", res.data.company_id)
    }

  } catch (err) {
    console.error("Request failed:", err);
    toast({
      title: "❌ Error",
      description: "Server error",
      className: "border-red-500 bg-red-50 text-red-800",
      duration: 3000
    });
  }
};

await registerUser();

      toast({
        title: "🎉 " + t("success"),
        description: "✅ " + t("aiSetupSave"),
        className: "border-green-200 bg-green-50 text-green-800",
        duration: 5000,
      })

      window.location.pathname =  "/admin/ai-history"

      

    } catch (error) {
      console.error("AI Setup submission error:", error)
      toast({
        title: t("error"),
        description: t("saveError"),
        variant: "destructive"
      })
    } finally {
      setIsAiModalLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast({
        title: t("error"),
        description: t("nameRequired"),
        variant: "destructive",
      })
      return
    }

    if (!email.trim()) {
      toast({
        title: t("error"),
        description: t("emailRequired"),
        variant: "destructive",
      })
      return
      
    }

    if (!companyName.trim()) {
      toast({
        title: t("error"),
        description: t("companyRequired"),
        variant: "destructive",
      })
      return
    }


    if (!password || password.length < 6) {
      toast({
        title: t("error"),
        description: t("passwordMinLength"),
        variant: "destructive",
      })
      return
    }

    if (!confirmPassword) {
      toast({
        title: t("error"),
        description: t("confirmPasswordRequired"),
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: t("error"),
        description: t("passwordMismatch"),
        variant: "destructive",
      })
      return
    }


    setIsLoading(true)
    setIsMoreRegisterOpen(false)

    
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
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t("registerTitle")}</h2>
          <p className="mt-2 text-sm text-gray-600">{t("registerDescription")}</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  {t("name")}
                </Label>
                <div className="mt-1">
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (validationErrors.name) {
                        setValidationErrors(prev => ({ ...prev, name: "" }))
                      }
                    }}
                    placeholder={t("namePlaceholder")}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      validationErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>
                  )}
                </div>
              </div>

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
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationErrors.email) {
                        setValidationErrors(prev => ({ ...prev, email: "" }))
                      }
                    }}
                    placeholder={t("emailPlaceholder")}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      validationErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                  {t("companyName")}
                </Label>
                <div className="mt-1">
                  <Input
                    id="company_name"
                    name="company_name"
                    type="text"
                    autoComplete="organization"
                    required
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value)
                      if (validationErrors.companyName) {
                        setValidationErrors(prev => ({ ...prev, companyName: "" }))
                      }
                    }}
                    placeholder={t("companyPlaceholder")}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${
                      validationErrors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {validationErrors.companyName && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.companyName}</p>
                  )}
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (validationErrors.password) {
                        setValidationErrors(prev => ({ ...prev, password: "" }))
                      }
                    }}
                    placeholder={t("passwordPlaceholder")}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10 ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
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
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                  {t("confirmPassword")}
                </Label>
                <div className="mt-1 relative">
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      if (validationErrors.confirmPassword) {
                        setValidationErrors(prev => ({ ...prev, confirmPassword: "" }))
                      }
                    }}
                    placeholder={t("confirmPasswordPlaceholder")}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 pr-10 ${
                      validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Tariff Plan Selection */}
              <div>
                <Label htmlFor="tariff_plan" className="block text-sm font-medium text-gray-700">
                  {t("tariffPlan")}
                </Label>
                <div className="mt-1">
                  <select
                    id="tariff_plan"
                    name="tariff_plan"
                    value={tariffPlanId}
                    onChange={(e) => setTariffPlanId(parseInt(e.target.value))}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value={1}>{t("basicPlan")}</option>
                    <option value={2}>{t("standardPlan")}</option>
                    <option value={3}>{t("premiumPlan")}</option>
                  </select>
                </div>
                <p className="mt-1 text-sm text-gray-500">{t("selectPlan")}</p>
              </div>

              <div>
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    if (validateForm()) {
                      setIsMoreRegisterOpen(true)
                    }
                  }}
                  type="button"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  {isLoading ? "..." : t("registerButton")}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">{t("haveAccount")} </span>
                <Link href="/login" className="text-sm font-medium text-purple-600 hover:text-purple-500">
                  {t("signIn")}
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

      {isMoreRegisterOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-[#f3f3f3] bg-opacity-20 flex items-start justify-center z-50 overflow-y-auto py-8">
                    <div className="w-full max-w-2xl mx-4">
                        <div className="text-center flex flex-col justify-center items-center mb-6">
                              <Bot className="h-[40px] text-purple-600 w-[40px] mr-2" />
                              <h2 className="font-bold">{t("aiSetupTitle")}</h2>
                              <p className="text-[#888] font-medium">{t("aiSetupDescription")}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-6 border-[1px] border-[#ECECEC] w-full">
                      {/* <Alicho */}
                        <h3 className="text-lg flex gap-[10px] font-semibold text-[#888] mb-4">
                            <RobotOutlined/>
                            {t("aiGuidelines")}
                        </h3>
                        <textarea 
                          value={aiContext}
                          onChange={(e) => setAiContext(e.target.value)}
                          placeholder={t("aiContextPlaceholder")} 
                          className={`border-[1.5px] p-2 w-full h-24 rounded-[6px] resize-none focus:outline-none ${
                            aiModalValidationErrors.aiContext 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-[#ECECEC] focus:border-purple-500'
                          }`}
                          name="ai_context" 
                        />
                        {aiModalValidationErrors.aiContext && (
                          <p className="mt-1 text-sm text-red-500">{aiModalValidationErrors.aiContext}</p>
                        )}
                       <h3 className="text-lg items-center mt-[50px] flex gap-[10px] font-semibold text-[#888] ">
                            <MessageCircle/>
                            {t("companyInformation")}
                        </h3>
                        <p className="font-semibold text-[10px] text-[#888]">{t("companyInformationDescription")}</p>
                        <textarea 
                          value={companyDescription}
                          onChange={(e) => setCompanyDescription(e.target.value)}
                          placeholder={t("companyDescriptionPlaceholder")} 
                          className={`border-[1.5px] p-2 w-full h-24 rounded-[6px] resize-none focus:outline-none ${
                            aiModalValidationErrors.companyDescription 
                              ? 'border-red-500 focus:border-red-500' 
                              : 'border-[#ECECEC] focus:border-purple-500'
                          }`}
                          name="company_description" 
                        />
                        {aiModalValidationErrors.companyDescription && (
                          <p className="mt-1 text-sm text-red-500">{aiModalValidationErrors.companyDescription}</p>
                        )}
                        
                        {/* Dynamic Additional Information Textareas */}
                        {additionalInfoList.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-md font-semibold text-[#888] mb-3 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {t("additionalInfoCount")} ({additionalInfoList.length}/10)
                            </h4>
                            {aiModalValidationErrors.additionalInfo && (
                              <p className="mb-3 text-sm text-red-500">{aiModalValidationErrors.additionalInfo}</p>
                            )}
                            {additionalInfoList.map((info, index) => (
                              <div key={index} className="mb-3 relative">
                                <div className="flex items-start gap-2">
                                  <textarea 
                                    value={info}
                                    onChange={(e) => updateAdditionalInfo(index, e.target.value)}
                                    placeholder={`${index + 1}. ${t("additionalInfoPlaceholder")}`}
                                    className="border-[1.5px] p-3 w-full h-20 border-[#ECECEC] rounded-[6px] resize-none focus:border-purple-500 focus:outline-none"
                                    name={`additional_info_${index}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removeAdditionalInfo(index)}
                                    className="flex-shrink-0 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                    title={t("removeInfo")}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <button 
                          onClick={addAdditionalInfo}
                          disabled={additionalInfoList.length >= 10}
                          className={`flex justify-center items-center py-2 w-full border-[1px] rounded-sm transition-colors ${
                            additionalInfoList.length >= 10 
                              ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
                              : 'border-[#ECECEC] hover:bg-gray-50'
                          }`}
                        >
                          <PlusOutlined/>
                          {additionalInfoList.length >= 10 
                            ? t("maxInfoLimit")
                            : t("addInfo")
                          }
                        </button>
                        
                        {/* Show validation error for additional info when no items exist */}
                        {additionalInfoList.length === 0 && aiModalValidationErrors.additionalInfo && (
                          <div className="mt-4">
                            <h4 className="text-md font-semibold text-[#888] mb-3 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {t("additionalInfoCount")} (0/10)
                            </h4>
                            <p className="mb-3 text-sm text-red-500">{aiModalValidationErrors.additionalInfo}</p>
                          </div>
                        )}
                        
                            <div className="flex flex-col items-center gap-3 justify-center">
                                <button
                                    onClick={handleAiSetupSubmit}
                                    disabled={isAiModalLoading}
                                    className="px-4 py-2 text-white mt-[30px] bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                                >
                                    {isAiModalLoading ? "..." : t("aiSetupSave")}
                                </button>

                                <p onClick={() => window.location.pathname = "/"} className="text-[12px] font-medium text-[#888] cursor-pointer hover:text-purple-600">
                                    {t("continueToHome")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
}


export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  )
}
