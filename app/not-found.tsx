"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import notFoundTranslations from "@/messages/not-found.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Search, MessageCircle, Settings, LifeBuoy, ArrowRight, Star, Sparkles } from "lucide-react";

export default function NotFound() {
    const { t } = useLanguage();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const popularLinks = [
        {
            href: "/admin",
            icon: Settings,
            label: t("popularLinks.dashboard", notFoundTranslations),
            color: "bg-gradient-to-r from-blue-500 to-cyan-500",
            shadowColor: "shadow-blue-200"
        },
        {
            href: "/admin/settings", 
            icon: Settings,
            label: t("popularLinks.settings", notFoundTranslations),
            color: "bg-gradient-to-r from-purple-500 to-pink-500",
            shadowColor: "shadow-purple-200"
        },
        {
            href: "/",
            icon: LifeBuoy,
            label: t("popularLinks.help", notFoundTranslations),
            color: "bg-gradient-to-r from-green-500 to-teal-500", 
            shadowColor: "shadow-green-200"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Shapes */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute top-40 right-10 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-delayed"></div>
                <div className="absolute -bottom-8 left-20 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                
                {/* Sparkles */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`absolute animate-sparkle opacity-60`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                        }}
                    >
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                ))}
            </div>

            <div className={`max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                {/* 404 Number with Creative Design */}
                <div className="relative mb-8">
                    <div className="text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 leading-none select-none relative">
                        {t("title", notFoundTranslations)}
                        {/* Floating decorative elements around 404 */}
                        <div className="absolute -top-10 -left-10 animate-bounce">
                            <Sparkles className="w-12 h-12 text-yellow-400 fill-current" />
                        </div>
                        <div className="absolute -top-5 -right-10 animate-bounce" style={{ animationDelay: "1s" }}>
                            <Star className="w-8 h-8 text-pink-400 fill-current" />
                        </div>
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 animate-pulse">
                            <div className="w-16 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* Shadow effect */}
                    <div className="absolute inset-0 text-[200px] font-black text-gray-200 leading-none select-none transform translate-x-2 translate-y-2 -z-10">
                        {t("title", notFoundTranslations)}
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 animate-fade-in-up">
                        {t("subtitle", notFoundTranslations)}
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        {t("description", notFoundTranslations)}
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors group-focus-within:text-blue-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t("searchPlaceholder", notFoundTranslations)}
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
                            />
                        </div>
                    </form>

                    {/* Primary Action Button */}
                    <button
                        onClick={() => router.push("/")}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl mb-12 animate-fade-in-up"
                        style={{ animationDelay: "0.6s" }}
                    >
                        <Home className="w-6 h-6 mr-2" />
                        {t("homeButton", notFoundTranslations)}
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Popular Links Section */}
                <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                    <p className="text-gray-600 mb-6 text-lg">
                        {t("helpText", notFoundTranslations)}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {popularLinks.map((link, index) => (
                            <button
                                key={link.href}
                                onClick={() => router.push(link.href)}
                                className={`group relative p-6 ${link.color} text-white rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl ${link.shadowColor}`}
                                style={{ animationDelay: `${1 + index * 0.1}s` }}
                            >
                                <div className="flex items-center justify-center space-x-3">
                                    <link.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                    <span className="font-semibold text-lg">{link.label}</span>
                                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                </div>
                                
                                {/* Shine effect */}
                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
                            </button>
                        ))}
                    </div>

                    {/* Contact Support Button */}
                    <button
                        onClick={() => router.push("/contact")}
                        className="inline-flex items-center px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        {t("contactSupport", notFoundTranslations)}
                    </button>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(180deg); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(-180deg); }
                }
                @keyframes sparkle {
                    0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .animate-float-delayed {
                    animation: float-delayed 8s ease-in-out infinite;
                }
                .animate-sparkle {
                    animation: sparkle 3s ease-in-out infinite;
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}