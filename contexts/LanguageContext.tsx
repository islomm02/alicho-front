"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "uz" | "ru" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string, translations: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Cookie utility functions
const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>("uz");

    useEffect(() => {
        const savedLanguage = getCookie("language") as Language;
        if (savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        setCookie("language", lang);
        // Trigger a custom event for other pages to listen to
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    };

    const t = (key: string, translations: any) => {
        return translations[language]?.[key] || translations["uz"]?.[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

// Export utility functions for direct use
export { getCookie, setCookie };