"use client";
import AmoCrmButton from "@/components/admin/Amocrm";
import { ArrowLeft, Copy, Edit, Settings, Shield, Zap, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import crmSettingsTranslations from "@/messages/crm-settings.json";

function page() {
    const { t } = useLanguage();
    const [isDomainDisabled, setIsDomainDisabled] = useState(true);

    const [copiedField, setCopiedField] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);

    const [companyId, setCompanyId] = useState("123");

    // Separate states for each field
    const [domainText, setDomainText] = useState("");
    const [refreshToken, setRefreshToken] = useState("eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InRyOTNPbzNZaXpvdk8ifQ...");
    const [accessToken, setAccessToken] = useState("def502001a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z...");
    const [clientSecret, setClientSecret] = useState("Y3hQ8R7vN2mK9pL6sX4wF1bE5dT0zM3nH8jU2cV7gA9qI6rO4yP1sW8eR5t...");
    const [clientId, setClientId] = useState("a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6");

    useEffect(() => {
        const isConnected = domainText.trim() !== "";
        localStorage.setItem('crmConnected', isConnected.toString());
        
        window.dispatchEvent(new CustomEvent('crmStatusChanged', { 
            detail: { connected: isConnected } 
        }));
    }, [domainText]);

    // Load saved values on component mount
    useEffect(() => {
        const savedDomainText = localStorage.getItem('crmBaseDomain') || "";
        setDomainText(savedDomainText);
        
        // Load other saved values if they exist
        const savedRefreshToken = localStorage.getItem('crmRefreshToken') || "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InRyOTNPbzNZaXpvdk8ifQ...";
        const savedAccessToken = localStorage.getItem('crmAccessToken') || "def502001a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z...";
        const savedClientSecret = localStorage.getItem('crmClientSecret') || "Y3hQ8R7vN2mK9pL6sX4wF1bE5dT0zM3nH8jU2cV7gA9qI6rO4yP1sW8eR5t...";
        const savedClientId = localStorage.getItem('crmClientId') || "a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5p6";
        
        setRefreshToken(savedRefreshToken);
        setAccessToken(savedAccessToken);
        setClientSecret(savedClientSecret);
        setClientId(savedClientId);
    }, []);

    const handleCopy = async (text: string, fieldName: string) => {
        setIsCopying(true);
        setCopiedField(fieldName);
        setIsCopying(true)
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
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[1px]  border-[#ECECEC] p-6 rounded-xl shadow-sm">
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
                        {t("pageTitle", crmSettingsTranslations)}
                    </h2>
                </div>
            </div>

            <div className="space-y-6">
               


                {/* AmoCRM Integration Button Card */}
                <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13 3L4 14h4.5L7 21l9-11h-4.5L13 3z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("cardTitle", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("cardDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <p className="text-gray-600 mb-4">{t("integrationInstructions", crmSettingsTranslations)}</p>
                            
                            <AmoCrmButton companyId={companyId} />
                        </div>
                    </div>
                </div>

                 <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("baseDomain", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("domainDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={isDomainDisabled}
                                type="text"
                                value={domainText}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setDomainText(value);
                                    localStorage.setItem('crmBaseDomain', value);
                                }}
                                className={`
                                    w-full px-4 py-3 pr-24 rounded-xl border-2 transition-all duration-300
                                    focus:outline-none focus:ring-4 focus:ring-opacity-20
                                    ${isDomainDisabled
                                        ? 'bg-gray-50 border-gray-200 text-gray-500' 
                                        : 'bg-white border-sky-300 focus:border-sky-500 focus:ring-sky-500 shadow-lg'
                                    }
                                `}
                                placeholder={t("domainPlaceholder", crmSettingsTranslations)}
                            />

                            <button
                                onClick={() => handleCopy(domainText, 'crmBaseDomain')}
                                disabled={isCopying && copiedField === 'crmBaseDomain'}
                                className={`
                                    absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'crmBaseDomain' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                    }
                                `}
                            >
                                {copiedField === 'crmBaseDomain' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsDomainDisabled(!isDomainDisabled)}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${isDomainDisabled 
                                        ? 'text-gray-400 hover:text-sky-600 hover:bg-sky-50' 
                                        : 'text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100'
                                    }
                                `}
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Focus Ring Animation */}
                            {!isDomainDisabled && (
                                <div className="absolute inset-0 rounded-xl border-2 border-sky-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse" />
                            )}

                            
                        </div>

                        <p
                            className={`
                                text-red-500 text-sm mt-2 transition-all duration-300 transform
                                ${isDomainDisabled || domainText 
                                    ? 'opacity-0 translate-y-[-10px]' 
                                    : 'opacity-100 translate-y-0'
                                }
                            `}
                        >
                            {t("fieldRequired", crmSettingsTranslations)}
                        </p>
                    </div>
                </div>  
                 <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("refreshToken", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("refreshTokenDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={true}
                                type="text"
                                value={refreshToken}
                                readOnly
                                className="w-full px-4 py-3 pr-14 rounded-xl border-2 transition-all duration-300 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                placeholder={t("refreshTokenPlaceholder", crmSettingsTranslations)}
                            />

                            {/* Copy Button Only */}
                            <button
                                onClick={() => handleCopy(refreshToken, 'crmRefreshToken')}
                                disabled={isCopying && copiedField === 'crmRefreshToken'}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'crmRefreshToken' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                    }
                                `}
                            >
                                {copiedField === 'crmRefreshToken' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>  
                 <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("accessToken", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("accessTokenDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={true}
                                type="text"
                                value={accessToken}
                                readOnly
                                className="w-full px-4 py-3 pr-14 rounded-xl border-2 transition-all duration-300 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                placeholder={t("accessTokenPlaceholder", crmSettingsTranslations)}
                            />

                            {/* Copy Button Only */}
                            <button
                                onClick={() => handleCopy(accessToken, 'crmAccessToken')}
                                disabled={isCopying && copiedField === 'crmAccessToken'}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'crmAccessToken' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                    }
                                `}
                            >
                                {copiedField === 'crmAccessToken' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>  
                 <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("clientSecret", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("clientSecretDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={true}
                                type="text"
                                value={clientSecret}
                                readOnly
                                className="w-full px-4 py-3 pr-14 rounded-xl border-2 transition-all duration-300 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                placeholder={t("clientSecretPlaceholder", crmSettingsTranslations)}
                            />

                            {/* Copy Button Only */}
                            <button
                                onClick={() => handleCopy(clientSecret, 'crmClientSecret')}
                                disabled={isCopying && copiedField === 'crmClientSecret'}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'crmClientSecret' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                    }
                                `}
                            >
                                {copiedField === 'crmClientSecret' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>  
                 <div className="relative overflow-hidden rounded-2xl bg-white border-2 border-sky-200 shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
                    <div className="absolute inset-0 opacity-5 transition-all duration-700 ease-in-out bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400" />
                    
                    <div className="relative p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="p-2 bg-sky-100 rounded-lg">
                                <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.379 2.655-.141 3.094-.141 3.094s.113.094.253.047.282-.141.423-.235c.188-.14.47-.329.47-.329l2.374-1.857 1.437 1.04c.329.188.564.094.658-.141l1.708-8.013c.141-.611-.141-1.003-.564-1.003-.329 0-.658.141-1.003.376L12 13.2 5.618 9.72c-.423-.188-.564-.376-.423-.658.141-.376.658-.47.987-.564z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{t("clientId", crmSettingsTranslations)}</h3>
                                <p className="text-sm text-gray-500">{t("clientIdDescription", crmSettingsTranslations)}</p>
                            </div>
                        </div>

                        <div className="group relative">
                            <input
                                disabled={true}
                                type="text"
                                value={clientId}
                                readOnly
                                className="w-full px-4 py-3 pr-14 rounded-xl border-2 transition-all duration-300 bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                                placeholder={t("clientIdPlaceholder", crmSettingsTranslations)}
                            />

                            {/* Copy Button Only */}
                            <button
                                onClick={() => handleCopy(clientId, 'crmClientId')}
                                disabled={isCopying && copiedField === 'crmClientId'}
                                className={`
                                    absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg
                                    transition-all duration-300 transform hover:scale-110 active:scale-95
                                    ${copiedField === 'crmClientId' 
                                        ? 'text-green-600 bg-green-50' 
                                        : 'text-gray-500 hover:text-orange-600 hover:bg-orange-50'
                                    }
                                `}
                            >
                                {copiedField === 'crmClientId' ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>  
            </div>
        </div>
    );
}

export default page;
