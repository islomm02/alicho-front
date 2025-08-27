"use client";
import { Switch } from "antd";
import { ArrowLeft, Settings, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import facebookSettingsTranslations from "@/messages/facebook-settings.json";

function page() {
    const { t } = useLanguage();
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    
    return (
        <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-[1px] h-[78vh] border-[#ECECEC] p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <button 
                    onClick={() => window.location.pathname = "/admin/settings"}
                    className="group flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                </button>
                
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-md">
                        <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="font-semibold text-xl text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {t("pageTitle", facebookSettingsTranslations)}
                    </h2>
                </div>
            </div>

            <div className="relative">
                <div className={`
                    group relative overflow-hidden rounded-2xl bg-white border-2 
                    ${maintenanceMode 
                        ? 'border-amber-200 shadow-amber-100' 
                        : 'border-green-200 shadow-green-100'
                    } 
                    shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out
                    transform hover:scale-[1.02] cursor-pointer
                    max-w-md mx-auto
                `}>
                    <div className={`
                        absolute inset-0 opacity-5 transition-all duration-700 ease-in-out
                        ${maintenanceMode 
                            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-400' 
                            : 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400'
                        }
                    `} />
                    
                    <div className="relative px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className={`
                                    relative p-3 rounded-full transition-all duration-500 
                                    ${maintenanceMode 
                                        ? 'bg-amber-100 animate-pulse' 
                                        : 'bg-green-100'
                                    }
                                `}>
                                    {maintenanceMode ? (
                                        <Shield className="w-6 h-6 text-amber-600" />
                                    ) : (
                                        <Zap className="w-6 h-6 text-green-600" />
                                    )}
                                    
                                    {/* Animated Ring */}
                                    <div className={`
                                        absolute inset-0 rounded-full border-2 
                                        ${maintenanceMode ? 'border-amber-300' : 'border-green-300'}
                                        ${maintenanceMode ? 'animate-ping' : ''}
                                    `} />
                                </div>
                                
                                {/* Status Text */}
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 mb-1">
                                        {t("maintenanceMode", facebookSettingsTranslations)}
                                    </h3>
                                    <p className={`
                                        text-sm font-medium transition-colors duration-300
                                        ${maintenanceMode ? 'text-amber-600' : 'text-green-600'}
                                    `}>
                                        {maintenanceMode ? t("activeStatus", facebookSettingsTranslations) : t("inactiveStatus", facebookSettingsTranslations)}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Right Side - Animated Switch */}
                            <div className="flex flex-col items-center space-y-2">
                                <Switch
                                    checked={maintenanceMode}
                                    onChange={() => setMaintenanceMode(!maintenanceMode)}
                                    size="default"
                                    className={`
                                        transition-all duration-300 hover:scale-110 active:scale-95
                                        ${maintenanceMode 
                                            ? 'shadow-amber-200 shadow-lg' 
                                            : 'shadow-green-200 shadow-lg'
                                        }
                                    `}
                                />
                                
                                {/* Status Indicator Dot */}
                                <div className={`
                                    w-2 h-2 rounded-full transition-all duration-500
                                    ${maintenanceMode 
                                        ? 'bg-amber-400 animate-pulse shadow-amber-300 shadow-lg' 
                                        : 'bg-green-400 shadow-green-300 shadow-lg'
                                    }
                                `} />
                            </div>
                        </div>
                        
                        {/* Animated Progress Bar */}
                        <div className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`
                                h-full transition-all duration-1000 ease-in-out rounded-full
                                ${maintenanceMode 
                                    ? 'w-full bg-gradient-to-r from-amber-400 to-orange-400' 
                                    : 'w-full bg-gradient-to-r from-green-400 to-blue-400'
                                }
                            `} />
                        </div>
                    </div>
                    
                    <div className={`
                        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 
                        transition-opacity duration-300 pointer-events-none
                        ${maintenanceMode 
                            ? 'bg-gradient-to-r from-amber-400 to-orange-400' 
                            : 'bg-gradient-to-r from-green-400 to-blue-400'
                        }
                    `} />
                </div>
                <div className="mt-8 flex justify-center">
                    <button className="group relative overflow-hidden px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-95">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-200 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-purple-200 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                        </div>
                        
                        {/* Ripple Effect */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-active:opacity-100 bg-white/20 animate-ping"></div>
                        
                        {/* Content */}
                        <div className="relative flex items-center space-x-3 z-10">
                            {/* Facebook Icon */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-white rounded-full animate-pulse opacity-20"></div>
                                <svg className="relative z-10 w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </div>
                            
                            {/* Text with gradient */}
                            <span className="font-bold text-lg bg-white bg-clip-text text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-blue-100 transition-all duration-300">
                                Facebook ulash
                            </span>
                            
                            {/* Arrow Animation */}
                            <div className="transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300">
                                <svg className="w-5 h-5 text-white/80 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-60 transition-opacity duration-500 -z-10"></div>
                        
                        {/* Border Animation */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
                        
                        {/* Success Pulse (can be triggered on click) */}
                        <div className="absolute inset-0 rounded-2xl bg-green-400 opacity-0 group-active:animate-ping"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default page;
