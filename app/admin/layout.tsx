"use client"
import Navbar from "@/components/admin/navbar";
import SideBar from "@/components/admin/side-bar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ReactNode, useState } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { UnsavedChangesProvider } from "@/contexts/SettingsContext";
import sidebarTranslations from "@/messages/sidebar.json";

export default function AdminLayout({ children }: {children: ReactNode}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    localStorage.removeItem("company_id")
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <UnsavedChangesProvider>
        <div className="h-screen flex flex-col">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4  p-2 bg-purple-600 text-white rounded-md shadow-lg md:hidden"
        >
          <Menu size={24} />
        </button>

        <SideBar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onLogoutClick={() => setShowLogoutModal(true)}
        />
        
        <div className="flex flex-1">
          <div className="hidden md:block w-[15%] min-w-[240px]"></div>
          
          <main className="flex-1 px-4 md:px-[50px] py-16 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>

        {/* Logout Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-[#0000002a] bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t("confirmLogout", sidebarTranslations)}
              </h3>
              <p className="text-gray-600 mb-6">
                {t("logoutConfirmMessage", sidebarTranslations)}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {t("cancel", sidebarTranslations)}
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
                >
                  {t("yesLogout", sidebarTranslations)}
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </UnsavedChangesProvider>
    </ProtectedRoute>
  );
}
