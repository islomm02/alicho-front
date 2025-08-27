"use client";
import { paths } from "@/hooks/paths";
import {
    ArrowsAltOutlined,
    CloudServerOutlined,
    HistoryOutlined,
    LogoutOutlined,
    SettingFilled,
    UsergroupAddOutlined,
    UserOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import { LucideSettings2, MessagesSquareIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import sidebarTranslations from "@/messages/sidebar.json";

interface SideBarProps {
    isOpen?: boolean;
    onClose?: () => void;
    onLogoutClick?: () => void;
}

function SideBar({ isOpen = true, onClose, onLogoutClick }: SideBarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const languageDropdownRef = useRef<HTMLDivElement>(null);

    const [company, setCompany] = useState<{name:string, id:number} | null>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
                setShowLanguageDropdown(false);
            }
        }

        if (showLanguageDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguageDropdown]);


    const languages = [
        { code: "uz", name: "O'zbek", flag: "🇺🇿" },
        { code: "ru", name: "Русский", flag: "🇷🇺" },
        { code: "en", name: "English", flag: "🇺🇸" },
    ];

    const links = [
        {
            href: `/admin${paths.ai_requests}`,
            label: t("aiHistory", sidebarTranslations),
            icon: <HistoryOutlined />,
        },
        {
            href: `/admin${paths.crm_settings}`,
            label: t("crmSettings", sidebarTranslations),
            icon: <LucideSettings2 />,
        },
        {
            href: `/admin${paths.users}`,
            label: t("users", sidebarTranslations),
            icon: <UsergroupAddOutlined />,
        },
        {
            href: `/admin${paths.chat_messages}`,
            label: t("chatMessages", sidebarTranslations),
            icon: <MessagesSquareIcon />,
        },
        {
            href: `/admin${paths.customers}`,
            label: t("customers", sidebarTranslations),
            icon: <UserOutlined />,
        },
        {
            href: `/admin${paths.embadding_resources}`,
            label: t("embeddingResources", sidebarTranslations),
            icon: <ArrowsAltOutlined />,
        },
        {
            href: `/admin${paths.settings}`,
            label: t("settings", sidebarTranslations),
            icon: <SettingFilled />,
        },
        {
            href: `/admin${paths.task_resources}`,
            label: t("taskResources", sidebarTranslations),
            icon: <CloudServerOutlined />,
        },
    ];

    
    return (
        <>
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-[#0000002a] bg-opacity-50 z-30 md:hidden"
                    onClick={onClose}
                />
            )}
            
            <div className={`
                fixed left-0 top-0 h-screen w-[240px] text-white bg-gradient-to-b from-purple-600 via-purple-700 to-purple-800 overflow-y-auto z-40 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 md:w-[15%] md:min-w-[240px]
            `}>
            <div>
                <div className=" flex gap-[20px] items-center justify-center mt-[30px] ">
                    <Image
                        className="rounded-full"
                        alt="User Img"
                        src={`/user-img.jpg`}
                        width={40}
                        height={40}
                    />
                    <div>
                        <p className="text-[20px] text-white font-semibold ">
                            {company?.name ||  "User Name"}
                        </p>
                        <p className="text-white text-[10px] ">ID: 162722671</p>
                    </div>
                </div>

                <div className="flex flex-col gap-[5px] justify-center items-center mt-[30px] px-2">
  {links.map((link) => {
    const isActive = pathname === link.href;
    return (
      <Link
        key={link.href}
        href={link.href}
        className={`flex text-start gap-2 items-center justify-start p-2 rounded-md w-full 
          transition-all duration-200 ease-in-out hover:translate-x-[5px] 
          ${
            isActive
              ? "bg-white/50 backdrop-blur-sm border border-white/30 shadow-lg text-white hover:bg-white/30"
              : "text-white/90 hover:text-purple-400 hover:bg-white/10 backdrop-blur-sm"
          }`}
      >
        {link.icon}
        <p>{link.label}</p>
      </Link>
    );
  })}
</div>

            </div>
            <div className="absolute bottom-4 left-0 right-0 px-2 space-y-2">
                <div className="relative" ref={languageDropdownRef}>
                    <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="flex w-full hover:bg-white/30 duration-200 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2 py-1 rounded-md gap-2 items-center cursor-pointer"
                    >
                        <GlobalOutlined />
                        <p>{languages.find(l => l.code === language)?.flag}</p>
                    </button>

                    {showLanguageDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-md shadow-lg py-2 min-w-[120px] z-50">
                            <p className="px-3 py-1 text-xs text-gray-500 font-semibold">
                                {t("selectLanguage", sidebarTranslations)}
                            </p>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code as any);
                                        setShowLanguageDropdown(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                                        language === lang.code ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                    }`}
                                >
                                    <span>{lang.flag}</span>
                                    <span className="text-sm">{lang.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <button
                    onClick={onLogoutClick}
                    className="flex w-full hover:bg-white/30 duration-200 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-2 py-1 rounded-md gap-2 items-center cursor-pointer"
                >
                    <LogoutOutlined />
                    <p>{t("logout", sidebarTranslations)}</p>
                </button>
            </div>

        </div>
        </>
    );
}

export default SideBar;
