"use client"
import MyTable from "@/components/admin/CustomTable"
import { useState } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import aiHistoryTranslations from "@/messages/ai-history.json";
import { AiRequestsType } from "@/types";
import { EyeIcon } from "lucide-react";
import { Space } from "antd";
import { useRouter } from "next/navigation";



const data:AiRequestsType[] = [
  {
    company_id: 1,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"

  },
  {
    company_id: 2,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 3,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 4,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 5,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 6,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 8,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 9,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 10,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  {
    company_id: 11,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
    created_at: "2025-08-19 13:40:12"
  },
  
];








function page() {
  const router = useRouter();
  const { t } = useLanguage()

  const columns = [
    {
      title: "ID",
      dataIndex: "company_id",
      key: "company_id", 
    },
    {
      title: t("name", aiHistoryTranslations),
      dataIndex: "model_name",
      key: "model_name",
    },
    {
      title: t("input_tokens", aiHistoryTranslations),
      dataIndex: "input_tokens",
      key: "input_tokens",
    },
    {
      title: t("output_tokens", aiHistoryTranslations),
      dataIndex: "output_tokens",
      key: "output_tokens",
    },
    {
      title: t("total_cost", aiHistoryTranslations),
      dataIndex: "total_cost",
      key: "total_cost",
    },
    {
      title: t("created_at", aiHistoryTranslations),
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: t("actions", aiHistoryTranslations),
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <button
            onClick={() => router.push(`/admin/ai-history/${record.company_id}`)} 
            className="flex sm:text-[10px] items-center gap-[10px] px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
          >
            <EyeIcon size={16} />
            <p className="hidden lg:block">{t("viewDetails", aiHistoryTranslations)}</p>
          </button>
        </Space>
      ),
    },
  ];
  
  const [filteredUsers, setFilteredUsers] = useState(data)  
  const [inputValue, setInputValue] = useState("")
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.toLowerCase(); 
  setInputValue(value);

  setFilteredUsers(
    data.filter((item) => item.model_name?.toLowerCase().includes(value))
  );
};


  return (
    <div>
      <div className="flex justify-between">
        <p className="text-xl font-semibold text-gray-900">
          {t("pageTitle", aiHistoryTranslations)}
        </p>
        <input 
          value={inputValue} 
          onChange={(e) => handleSearch(e)} 
          className="px-[10px] w-[25%] py-[4px] border-[#d8d8d8] border-[1px] rounded-md" 
          placeholder={t("searchPlaceholder", aiHistoryTranslations)}
        />
      </div>
      <MyTable columns={columns} data={filteredUsers} />
    </div>
  )
}

export default page