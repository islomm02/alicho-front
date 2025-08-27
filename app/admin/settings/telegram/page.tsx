"use client";
import { ArrowLeft, Copy, Edit, Settings, Shield, Zap, Check, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useUnsavedChanges } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";
import telegramSettingsTranslations from "@/messages/telegram-settings.json";

function page() {
    const { t } = useLanguage();
    const [isTgIdDisabled, setIsTgIdDisabled] = useState(true);
    const [isTgTokenDisabled, setIsTgTokenDisabled] = useState(true);
    const [maintenanceMode, setMaintenanceMode] = useState(false);

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    const [idText, setIdText] = useState("");
    const [tokenText, setTokenText] = useState("");
    
    // Original values for change detection
    const [originalIdText, setOriginalIdText] = useState("");
    const [originalTokenText, setOriginalTokenText] = useState("");

    const { hasUnsavedChanges, setHasUnsavedChanges, setOnSaveCallback } = useUnsavedChanges();

    // Update connection status whenever fields change
    useEffect(() => {
        const isConnected = idText.trim() !== "" && tokenText.trim() !== "";
        localStorage.setItem('telegramConnected', isConnected.toString());
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('telegramStatusChanged', { 
            detail: { connected: isConnected } 
        }));
    }, [idText, tokenText]);

    // Load saved values on component mount
    useEffect(() => {
        const savedIdText = localStorage.getItem('telegramChatId') || "";
        const savedTokenText = localStorage.getItem('telegramBotToken') || "";
        
        setIdText(savedIdText);
        setTokenText(savedTokenText);
    }, []);

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

    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[1px] h-[78vh] border-[#ECECEC] p-6 rounded-xl shadow-sm">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => window.location.pathname = "/admin/settings"}
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-sky-600 transition-colors duration-200" />
                </button>
                
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-sky-500 rounded-lg shadow-md">
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 bg-gradient-to-r from-sky-600 to-cyan-600 bg-clip-text text-transparent">
                        {t("pageTitle", telegramSettingsTranslations)}
                    </h2>
                </div>
            </div>

            {/* Settings Cards Container */}
            <div className="space-y-6">
                {/* Telegram Chat ID Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("chatIdTitle", telegramSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("chatIdDescription", telegramSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={isTgIdDisabled}
                                type="text"
                                value={idText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setIdText(value);
                                    localStorage.setItem('telegramChatId', value);
                                }}
                                className={`
                                    w-full px-4 py-3 pr-24 rounded-xl border-2 transition-all duration-300
                                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                                    ${isTgIdDisabled
                                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                                        : 'bg-white border-sky-300 focus:border-sky-500 focus:ring-sky-500 shadow-lg'
                                    }
                                `}
                                placeholder={t("chatIdPlaceholder", telegramSettingsTranslations)}
                            />

                            {/* Copy Button */}
                            <button
                                onClick={() => handleCopy(idText, 'telegramChatId')}
                                disabled={isCopying && copiedField === 'telegramChatId'}
                                className={`
                                    absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'telegramChatId' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-sky-600 hover:bg-sky-50'
                                    }
                                `}
                            >
                                {copiedField === 'telegramChatId' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsTgIdDisabled(!isTgIdDisabled)}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${isTgIdDisabled 
                                        ? 'text-gray-400 hover:text-sky-600 hover:bg-sky-50' 
                                        : 'text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100'
                                    }
                                `}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Focus Ring Animation */}
                            {!isTgIdDisabled && (
                                <div className="absolute inset-0 rounded-xl border-2 border-sky-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
                            )}
                        </div>

                        <p
                            className={`
                                text-red-500 text-sm mt-2 transition-all duration-300 transform
                                ${isTgIdDisabled || idText 
                                    ? 'opacity-0 translate-y-[-10px]' 
                                    : 'opacity-100 translate-y-0'
                                }
                            `}
                        >
                            {t("fieldRequired", telegramSettingsTranslations)}
                        </p>
                    </div>
                </div>
                {/* Telegram Bot Token Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-cyan-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-cyan-100 rounded-lg">
                                <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("botTokenTitle", telegramSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("botTokenDescription", telegramSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={isTgTokenDisabled}
                                type="text"
                                value={tokenText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setTokenText(value);
                                    localStorage.setItem('telegramBotToken', value);
                                }}
                                className={`
                                    w-full px-4 py-3 pr-24 rounded-xl border-2 transition-all duration-300
                                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                                    ${isTgTokenDisabled
                                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                                        : 'bg-white border-cyan-300 focus:border-cyan-500 focus:ring-cyan-500 shadow-lg'
                                    }
                                `}
                                placeholder={t("botTokenPlaceholder", telegramSettingsTranslations)}
                            />

                            {/* Copy Button */}
                            <button
                                onClick={() => handleCopy(tokenText, 'telegramBotToken')}
                                disabled={isCopying && copiedField === 'telegramBotToken'}
                                className={`
                                    absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'telegramBotToken' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-cyan-600 hover:bg-cyan-50'
                                    }
                                `}
                            >
                                {copiedField === 'telegramBotToken' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsTgTokenDisabled(!isTgTokenDisabled)}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${isTgTokenDisabled 
                                        ? 'text-gray-400 hover:text-cyan-600 hover:bg-cyan-50' 
                                        : 'text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100'
                                    }
                                `}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Focus Ring Animation */}
                            {!isTgTokenDisabled && (
                                <div className="absolute inset-0 rounded-xl border-2 border-cyan-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
                            )}
                        </div>

                        <p
                            className={`
                                text-red-500 text-sm mt-2 transition-all duration-300 transform
                                ${isTgTokenDisabled || tokenText 
                                    ? 'opacity-0 translate-y-[-10px]' 
                                    : 'opacity-100 translate-y-0'
                                }
                            `}
                        >
                            {t("fieldRequired", telegramSettingsTranslations)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;
