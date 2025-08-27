"use client";
import { useEffect, useState } from "react";

export default function AmoCrmButton({ companyId }: { companyId: string }) {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const container = document.getElementById("amocrm-integration-container");
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://www.amocrm.ru/auth/button.min.js";
    script.className = "amocrm_oauth";
    script.charset = "utf-8";

    script.setAttribute("data-name", "Alicho Integration");
    script.setAttribute("data-description", "Alicho AmoCRM integration");
    script.setAttribute("data-redirect_uri", `https://alicho.laravel.cloud/company/${companyId}/oauth/callback`);
    script.setAttribute("data-secrets_uri", `https://alicho.laravel.cloud/api/${companyId}/secret`);
    script.setAttribute("data-logo", "https://alicho.laravel.cloud/logo.png");
    script.setAttribute("data-scopes", "crm,notifications");
    script.setAttribute("data-title", "AmoCRM bilan bog'lanish");
    script.setAttribute("data-compact", "false");
    script.setAttribute("data-class-name", "amocrm-btn");
    script.setAttribute("data-color", "default");
    script.setAttribute("data-state", "random_state_123");
    script.setAttribute("data-error-callback", "onAmoCrmError");
    script.setAttribute("data-mode", "popup");

    script.onload = () => {
      setShowFallback(false);
    };

    script.onerror = () => {
      console.warn("Failed to load AmoCRM script, using fallback");
      setShowFallback(true);
    };

    container.appendChild(script);

    (window as any).onAmoCrmError = (error: any) => {
      console.error("AmoCRM Auth Error:", error);
      alert("AmoCRM avtorizatsiyada xatolik yuz berdi. Qayta urinib ko'ring.");
    };

    // ❌ script.remove() ni olib tashla!
  }, []);

  const handleManualIntegration = () => {
    const authUrl = `https://www.amocrm.ru/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=${encodeURIComponent(`https://alicho.laravel.cloud/company/${companyId}/oauth/callback`)}&scope=crm,notifications&state=random_state_123`;
    const popup = window.open(authUrl, "amocrm_auth", "width=500,height=600,scrollbars=yes,resizable=yes");
    if (!popup) {
      alert("Popup bloklangan. Brauzer sozlamalarini tekshiring.");
    }
  };

  return (
    <div className="flex justify-center">
      <div id="amocrm-integration-container" className="amocrm-button-wrapper" />
      {showFallback && (
        <button
          onClick={handleManualIntegration}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 3L4 14h4.5L7 21l9-11h-4.5L13 3z" />
          </svg>
          <span>AmoCRM bilan bog'lanish</span>
        </button>
      )}
    </div>
  );
}
