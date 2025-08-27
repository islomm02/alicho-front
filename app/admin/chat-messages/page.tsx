"use client"
import MyTable from "@/components/admin/CustomTable";
import { ArrowLeft, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import chatMessagesTranslations from "@/messages/chat-messages.json";

function Page() {
  const router = useRouter();
  const { t } = useLanguage();

  const columns = [
    {
      title: t("tableHeaders.id", chatMessagesTranslations),
      dataIndex: "id",
      key: "id",
    },
    {
      title: t("tableHeaders.userId", chatMessagesTranslations),
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: t("tableHeaders.userText", chatMessagesTranslations),
      dataIndex: "user_text",
      key: "user_text",
    },
    {
      title: t("tableHeaders.reply", chatMessagesTranslations),
      dataIndex: "reply",
      key: "reply",
    },
    {
      title: t("tableHeaders.actions", chatMessagesTranslations),
      key: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/admin/chat-messages/${record.id}`)}
            className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <EyeIcon size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => router.push("/admin/chat-messages")}
        className="flex items-center gap-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
      >
        <ArrowLeft size={18} /> {t("back", chatMessagesTranslations)}
      </button>

      <MyTable
        columns={columns}
        data={[{ id: 1, user_id: 2334, user_text: "salom", reply: "Alik" }]}
      />
    </div>
  );
}

export default Page;
