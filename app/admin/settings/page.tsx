"use client";
import { AmoCrmIcon, FacebookIcon, TelegramIcon } from "@/assets/icons";
import CodeBlock from "@/components/admin/CodeComponent";
import { useLanguage } from "@/contexts/LanguageContext";
import settingsTranslations from "@/messages/settings.json";
import { getCookies } from "@/hooks/cookie";
import { API } from "@/hooks/getApi";
import axios from "axios";
import {  Edit,  Settings, Sparkles, CheckCircle, XCircle, Link, Save, Copy, Check } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUnsavedChanges } from "@/contexts/SettingsContext";

function page() {
    const router = useRouter();
    const { t } = useLanguage();
    const pathname = usePathname();
    const { hasUnsavedChanges, setHasUnsavedChanges, setOnSaveCallback } = useUnsavedChanges();
    const [isTelegramConnected, setIsTelegramConnected] = useState(false)
    const [isFacebookConnected, setIsFacebookConnected] = useState(false)
    const [isCrmConnected, setIsCrmConnected] = useState(false)
    
    const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
    const [aiContext, setAiContext] = useState("test");
    const [chatText, setChatText] = useState("Default chat text");
    const [amocrmBaseDomain, setAmocrmBaseDomain] = useState("example.amocrm.ru");
    
    const [isAiContextDisabled, setIsAiContextDisabled] = useState(true);
    const [isChatTextDisabled, setIsChatTextDisabled] = useState(true);
    const [isAmocrmDomainDisabled, setIsAmocrmDomainDisabled] = useState(true);
    
    const [originalMaintenanceMode] = useState<boolean>(false);
    const [originalAiContext] = useState("test");
    const [originalChatText] = useState("Default chat text");
    const [originalAmocrmBaseDomain] = useState("example.amocrm.ru");
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [cookie, setCookie] = useState(getCookies("token"));
    
    // Copy states
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    // Load connection states on mount
    useEffect(() => {
        const telegramConnected = localStorage.getItem('telegramConnected') === 'true';
        const crmConnected = localStorage.getItem('crmConnected') === 'true';
        
        setIsTelegramConnected(telegramConnected);
        setIsCrmConnected(crmConnected);

        // Listen for connection status changes
        const handleTelegramStatusChange = (event: CustomEvent) => {
            setIsTelegramConnected(event.detail.connected);
        };

        const handleCrmStatusChange = (event: CustomEvent) => {
            setIsCrmConnected(event.detail.connected);
        };

        window.addEventListener('telegramStatusChanged', handleTelegramStatusChange as EventListener);
        window.addEventListener('crmStatusChanged', handleCrmStatusChange as EventListener);

        return () => {
            window.removeEventListener('telegramStatusChanged', handleTelegramStatusChange as EventListener);
            window.removeEventListener('crmStatusChanged', handleCrmStatusChange as EventListener);
        };
    }, []);
    
    const isChanged = 
        maintenanceMode !== originalMaintenanceMode ||
        aiContext !== originalAiContext ||
        chatText !== originalChatText ||
        amocrmBaseDomain !== originalAmocrmBaseDomain;

    // Update unsaved changes context
    useEffect(() => {
        setHasUnsavedChanges(isChanged);
    }, [isChanged, setHasUnsavedChanges]);

    // Save function
    const handleSave = async () => {
        try {
            // TODO: Add API call to save settings
            console.log("Saving settings:", {
                maintenanceMode,
                aiContext,
                chatText,
                amocrmBaseDomain
            });
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update original values to match current values
            // This would normally come from a successful API response
            setHasUnsavedChanges(false);
            
            alert(t("settingsSavedSuccess", settingsTranslations));
        } catch (error) {
            console.error("Error saving settings:", error);
            alert(t("settingsSaveError", settingsTranslations));
        }
    };

    // Set save callback for context
    useEffect(() => {
        setOnSaveCallback(() => handleSave);
    }, [setOnSaveCallback]);

    // Handle copy function
    const handleCopy = async (text: string, fieldName: string) => {
        setIsCopying(true);
        setCopiedField(fieldName);
        
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
        
        setTimeout(() => {
            setIsCopying(false);
            setCopiedField(null);
        }, 2000);
    };
  

    const handleDelete = (id: number) => {
        // delete api
        // axios.delete(`${API}/api/keys/${id.toString()}`, {headers: {Authorization : `Bearer ${cookie}`}})
        console.log("delete code is commented");
    };

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                {/* Header Section */}
                <div className="mb-8 p-6">
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            {t("pageTitle", settingsTranslations)}
                        </h1>
                    </div>
                    <p className="text-gray-600 ml-12">{t("pageDescription", settingsTranslations)}</p>
                </div>

                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        
                        {/* Facebook Card */}
                        <div className={`
                            group relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-500 ease-in-out
                            transform hover:scale-105 hover:shadow-2xl cursor-pointer
                            ${isFacebookConnected 
                                ? 'border-green-200 shadow-green-100' 
                                : 'border-blue-200 shadow-blue-100'
                            }
                        `}>
                            {/* Animated Background */}
                            <div className={`
                                absolute inset-0 opacity-5 transition-all duration-700
                                ${isFacebookConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-blue-400' 
                                    : 'bg-gradient-to-r from-blue-400 to-purple-400'
                                }
                            `} />
                            
                            <div className="relative p-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    {/* Animated Icon Container */}
                                    <div className={`
                                        relative p-3 rounded-full transition-all duration-500 group-hover:scale-110
                                        ${isFacebookConnected ? 'bg-green-100' : 'bg-blue-100'}
                                    `}>
                                        <FacebookIcon/>
                                        {/* Pulse Animation for Connected */}
                                        {isFacebookConnected && (
                                            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-75" />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                            {t("facebookConnection", settingsTranslations)}
                                        </h3>
                                        <p className="text-sm text-gray-500">{t("socialNetworkIntegration", settingsTranslations)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    {/* Status Badge */}
                                    <div className={`
                                        flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300
                                        ${isFacebookConnected 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-red-100 text-red-600'
                                        }
                                    `}>
                                        {isFacebookConnected ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        <span>{isFacebookConnected ? t("connected", settingsTranslations) : t("notConnected", settingsTranslations)}</span>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={() => router.push(`${pathname}/facebook`)}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                                            transition-all duration-300 transform hover:scale-105 active:scale-95
                                            ${isFacebookConnected 
                                                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-200' 
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                            }
                                            shadow-lg hover:shadow-xl
                                        `}
                                    >
                                        {isFacebookConnected ? <Settings className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                                        <span>{isFacebookConnected ? t("setupButton", settingsTranslations) : t("connectButton", settingsTranslations)}</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Hover Glow Effect */}
                            <div className={`
                                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                                transition-opacity duration-300 pointer-events-none
                                ${isFacebookConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-blue-400' 
                                    : 'bg-gradient-to-r from-blue-400 to-purple-400'
                                }
                            `} />
                        </div>
                        {/* Telegram Card */}
                        <div className={`
                            group relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-500 ease-in-out
                            transform hover:scale-105 hover:shadow-2xl cursor-pointer
                            ${isTelegramConnected 
                                ? 'border-green-200 shadow-green-100' 
                                : 'border-sky-200 shadow-sky-100'
                            }
                        `}>
                            {/* Animated Background */}
                            <div className={`
                                absolute inset-0 opacity-5 transition-all duration-700
                                ${isTelegramConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-sky-400' 
                                    : 'bg-gradient-to-r from-sky-400 to-cyan-400'
                                }
                            `} />
                            
                            <div className="relative p-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    {/* Animated Icon Container */}
                                    <div className={`
                                        relative p-3 rounded-full transition-all duration-500 group-hover:scale-110
                                        ${isTelegramConnected ? 'bg-green-100' : 'bg-sky-100'}
                                    `}>
                                        <TelegramIcon/>
                                        {/* Pulse Animation for Connected */}
                                        {isTelegramConnected && (
                                            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-75" />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-sky-600 transition-colors duration-300">
                                            {t("telegramConnection", settingsTranslations)}
                                        </h3>
                                        <p className="text-sm text-gray-500">{t("socialNetworkIntegration", settingsTranslations)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    {/* Status Badge */}
                                    <div className={`
                                        flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300
                                        ${isTelegramConnected 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-red-100 text-red-600'
                                        }
                                    `}>
                                        {isTelegramConnected ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        <span>{isTelegramConnected ? t("connected", settingsTranslations) : t("notConnected", settingsTranslations)}</span>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={() => router.push(`${pathname}/telegram` )}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                                            transition-all duration-300 transform hover:scale-105 active:scale-95
                                            ${isTelegramConnected 
                                                ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-sky-200' 
                                                : 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white hover:from-sky-600 hover:to-cyan-700'
                                            }
                                            shadow-lg hover:shadow-xl
                                        `}
                                    >
                                        {isTelegramConnected ? <Settings className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                                        <span>{isTelegramConnected ? t("setupButton", settingsTranslations) : t("connectButton", settingsTranslations)}</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Hover Glow Effect */}
                            <div className={`
                                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                                transition-opacity duration-300 pointer-events-none
                                ${isTelegramConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-sky-400' 
                                    : 'bg-gradient-to-r from-sky-400 to-cyan-400'
                                }
                            `} />
                        </div>
                        {/* AMOCRM Card */}
                        <div className={`
                            group relative overflow-hidden rounded-2xl bg-white border-2 transition-all duration-500 ease-in-out
                            transform hover:scale-105 hover:shadow-2xl cursor-pointer
                            ${isCrmConnected 
                                ? 'border-green-200 shadow-green-100' 
                                : 'border-orange-200 shadow-orange-100'
                            }
                        `}>
                            {/* Animated Background */}
                            <div className={`
                                absolute inset-0 opacity-5 transition-all duration-700
                                ${isCrmConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-orange-400' 
                                    : 'bg-gradient-to-r from-orange-400 to-yellow-400'
                                }
                            `} />
                            
                            <div className="relative p-6">
                                <div className="flex items-center space-x-4 mb-6">
                                    {/* Animated Icon Container */}
                                    <div className={`
                                        relative p-3 rounded-full transition-all duration-500 group-hover:scale-110
                                        ${isCrmConnected ? 'bg-green-100' : 'bg-orange-100'}
                                    `}>
                                        <AmoCrmIcon/>
                                        {/* Pulse Animation for Connected */}
                                        {isCrmConnected && (
                                            <div className="absolute inset-0 rounded-full border-2 border-green-300 animate-ping opacity-75" />
                                        )}
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                                            {t("amocrmConnection", settingsTranslations)}
                                        </h3>
                                        <p className="text-sm text-gray-500">{t("crmSystemIntegration", settingsTranslations)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    {/* Status Badge */}
                                    <div className={`
                                        flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300
                                        ${isCrmConnected 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-red-100 text-red-600'
                                        }
                                    `}>
                                        {isCrmConnected ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        <span>{isCrmConnected ? t("connected", settingsTranslations) : t("notConnected", settingsTranslations)}</span>
                                    </div>
                                    
                                    {/* Action Button */}
                                    <button 
                                        onClick={() => router.push(`${pathname}/crm` )}
                                        className={`
                                            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                                            transition-all duration-300 transform hover:scale-105 active:scale-95
                                            ${isCrmConnected 
                                                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-200' 
                                                : 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white hover:from-orange-600 hover:to-yellow-700'
                                            }
                                            shadow-lg hover:shadow-xl
                                        `}
                                    >
                                        {isCrmConnected ? <Settings className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                                        <span>{isCrmConnected ? t("setupButton", settingsTranslations) : t("connectButton", settingsTranslations)}</span>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Hover Glow Effect */}
                            <div className={`
                                absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                                transition-opacity duration-300 pointer-events-none
                                ${isCrmConnected 
                                    ? 'bg-gradient-to-r from-green-400 to-orange-400' 
                                    : 'bg-gradient-to-r from-orange-400 to-yellow-400'
                                }
                            `} />
                        </div>
                    </div>

                    {/* AI Settings Section */}
                    <div className="mt-16 p-6">
                        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-2xl">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 opacity-50" />
                            
                            <div className="relative p-8">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                {t("aiSettingsTitle", settingsTranslations)}
                                            </h2>
                                            <p className="text-gray-600">{t("aiSettingsDescription", settingsTranslations)}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Animated Save Button */}
                                    <button
                                        onClick={handleSave}
                                        disabled={!isChanged}
                                        className={`
                                            group relative overflow-hidden px-6 py-3 rounded-xl text-white font-semibold
                                            transition-all duration-500 transform active:scale-95
                                            ${isChanged 
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105' 
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Save className={`w-4 h-4 transition-transform duration-300 ${isChanged ? 'group-hover:scale-110' : ''}`} />
                                            <span>{t("save", settingsTranslations)}</span>
                                        </div>
                                        
                                        {/* Shimmer Effect for Active Button */}
                                        {isChanged && (
                                            <div className="absolute inset-0 -top-2 -bottom-2 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                                        )}
                                    </button>
                                </div>
                        {/* <div className="flex justify-between px-7 py-4 mt-[30px] border-[1px] border-[#a7a7a7] rounded-md items-center w-[300px] ">
                            <h2>{t("maintenanceMode", settingsTranslations)}</h2>
                            <Switch
                                value={maintenanceMode}
                                onChange={() =>
                                    setMaintenanceMode(!maintenanceMode)
                                }
                            />
                        </div> */}
                                {/* AI Context Field */}
                                <div className="mt-8 space-y-6">
                                    <div className="group relative">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500" />
                                            <span>{t("aiContext", settingsTranslations)}</span>
                                        </label>
                                        
                                        <div className="relative">
                                            <input
                                                disabled={isAiContextDisabled}
                                                type="text"
                                                value={aiContext}
                                                onChange={(e) => setAiContext(e.target.value)}
                                                className={`
                                                    w-full px-4 py-3 pr-24 rounded-xl border-2 transition-all duration-300
                                                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                                                    ${isAiContextDisabled
                                                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                                                        : 'bg-white border-purple-300 focus:border-purple-500 focus:ring-purple-500 shadow-lg'
                                                    }
                                                `}
                                                placeholder={t("aiContextPlaceholder", settingsTranslations)}
                                            />

                                            {/* Copy Button */}
                                            <button
                                                onClick={() => handleCopy(aiContext, 'aiContext')}
                                                disabled={isCopying && copiedField === 'aiContext'}
                                                className={`
                                                    absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                                    ${copiedField === 'aiContext' 
                                                        ? 'text-green-600 bg-green-50' 
                                                        : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                                                    }
                                                `}
                                            >
                                                {copiedField === 'aiContext' ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => setIsAiContextDisabled(!isAiContextDisabled)}
                                                className={`
                                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                                    ${isAiContextDisabled 
                                                        ? 'text-gray-400 hover:text-purple-600 hover:bg-purple-50' 
                                                        : 'text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100'
                                                    }
                                                `}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            
                                            {/* Focus Ring Animation */}
                                            {!isAiContextDisabled && (
                                                <div className="absolute inset-0 rounded-xl border-2 border-purple-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
                                            )}
                                        </div>

                                        <p
                                            className={`
                                                text-red-500 text-sm mt-2 transition-all duration-300 transform
                                                ${isAiContextDisabled || aiContext 
                                                    ? 'opacity-0 translate-y-[-10px]' 
                                                    : 'opacity-100 translate-y-0'
                                                }
                                            `}
                                        >
                                            {t("fieldCannotBeEmpty", settingsTranslations)}
                                        </p>
                                    </div>
                                    {/* Chat Text Field */}
                                    <div className="group relative">
                                        <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500" />
                                            <span>{t("chatText", settingsTranslations)}</span>
                                        </label>
                                        
                                        <div className="relative">
                                            <input
                                                disabled={isChatTextDisabled}
                                                type="text"
                                                value={chatText}
                                                onChange={(e) => setChatText(e.target.value)}
                                                className={`
                                                    w-full px-4 py-3 pr-24 rounded-xl border-2 transition-all duration-300
                                                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                                                    ${isChatTextDisabled
                                                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                                                        : 'bg-white border-blue-300 focus:border-blue-500 focus:ring-blue-500 shadow-lg'
                                                    }
                                                `}
                                                placeholder={t("chatTextPlaceholder", settingsTranslations)}
                                            />

                                            {/* Copy Button */}
                                            <button
                                                onClick={() => handleCopy(chatText, 'chatText')}
                                                disabled={isCopying && copiedField === 'chatText'}
                                                className={`
                                                    absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                                    ${copiedField === 'chatText' 
                                                        ? 'text-green-600 bg-green-50' 
                                                        : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
                                                    }
                                                `}
                                            >
                                                {copiedField === 'chatText' ? (
                                                    <Check className="w-4 h-4" />
                                                ) : (
                                                    <Copy className="w-4 h-4" />
                                                )}
                                            </button>

                                            {/* Edit Button */}
                                            <button
                                                onClick={() => setIsChatTextDisabled(!isChatTextDisabled)}
                                                className={`
                                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                                    ${isChatTextDisabled 
                                                        ? 'text-gray-400 hover:text-blue-600 hover:bg-blue-50' 
                                                        : 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100'
                                                    }
                                                `}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            
                                            {/* Focus Ring Animation */}
                                            {!isChatTextDisabled && (
                                                <div className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
                                            )}
                                        </div>

                                        <p
                                            className={`
                                                text-red-500 text-sm mt-2 transition-all duration-300 transform
                                                ${isChatTextDisabled || chatText 
                                                    ? 'opacity-0 translate-y-[-10px]' 
                                                    : 'opacity-100 translate-y-0'
                                                }
                                            `}
                                        >
                                            {t("fieldCannotBeEmpty", settingsTranslations)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        {/* <div className="relative w-full">
                          <h2 className="mt-[30px]">{t("amocrmBaseDomain", settingsTranslations)}</h2>
                            <input
                                disabled={isAmocrmDomainDisabled}
                                type="text"
                                value={amocrmBaseDomain}
                                onChange={(e) => setAmocrmBaseDomain(e.target.value)}
                                className={`p-2 pr-10 mt-[5px] bg-[#fff] border-[#d5d5d5] ${
                                    isAmocrmDomainDisabled
                                        ? ""
                                        : "border-green-500"
                                } border-[1px] rounded-[16px] w-full`}
                            />

                            <button
                                onClick={() =>
                                    setIsAmocrmDomainDisabled(!isAmocrmDomainDisabled)
                                }
                                className="absolute right-3 top-12 -translate-y-1/2 text-gray-500 hover:text-black"
                            >
                                <Edit />
                            </button>

                            <p
                                className={` ${
                                    isAmocrmDomainDisabled
                                        ? "hidden"
                                        : amocrmBaseDomain
                                        ? "hidden"
                                        : "text-red-500 text-[13px]"
                                }`}
                            >
                                {t("fieldCannotBeEmpty", settingsTranslations)}
                            </p>
                        </div> */}
                    </div>
                </div>
                    {/* Integration Code Section */}
                    <div className="mt-12 p-6">
                        <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-2xl">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 opacity-50" />
                            
                            <div className="relative p-8">
                                {/* Header */}
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                                            {t("integrationCodeTitle", settingsTranslations)}
                                        </h3>
                                        <p className="text-gray-600">{t("integrationCodeDescription", settingsTranslations)}</p>
                                    </div>
                                </div>
                                
                                {/* Animated Code Block Container */}
                                <div className="relative">
                                    {/* Copy Button for Integration Code */}
                                    <button
                                        onClick={() => handleCopy(`<script src="https://alicho.laravel.cloud/js/chat-widget.js"></script>
  <script>
      window.initChatWidget({
          token: "18a17824cde624a9e21fcaabca0703b2e78c1f56ee9ea129a9e0a232ee618d17",
          user_id: null, // Bu joyga o'z platformangizdagi foydalanuvchi ID sini qo'ying
      });
  </script>`, 'integrationCode')}
                                        disabled={isCopying && copiedField === 'integrationCode'}
                                        className={`
                                            absolute top-4 right-4 z-10 flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium
                                            transition-all duration-300 transform hover:scale-105 active:scale-95
                                            ${copiedField === 'integrationCode' 
                                                ? 'bg-green-100 text-green-700 border border-green-200' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-md'
                                            }
                                        `}
                                    >
                                        {copiedField === 'integrationCode' ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>{t("copied", settingsTranslations)}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>{t("copyButton", settingsTranslations)}</span>
                                            </>
                                        )}
                                    </button>
                                    
                                    <div className="transform transition-all duration-500 hover:scale-[1.01]">
                                        <CodeBlock
                                            code={`<script src="https://alicho.laravel.cloud/js/chat-widget.js"></script>
  <script>
      window.initChatWidget({
          token: "18a17824cde624a9e21fcaabca0703b2e78c1f56ee9ea129a9e0a232ee618d17",
          user_id: null, // Bu joyga o'z platformangizdagi foydalanuvchi ID sini qo'ying
      });
  </script>`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            {/* </div> */}
        </>
    );
}

export default page;
