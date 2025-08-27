"use client";
import { useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import aiHistoryDetailTranslations from "@/messages/ai-history-detail.json";

const data = [
  {
    company_id: 1,
    model_name: "John Brown",
    input_tokens: 32,
    output_tokens: 32,
    total_cost: 0.0000009,
  },
  {
    company_id: 2,
    model_name: "Sarah White",
    input_tokens: 50,
    output_tokens: 40,
    total_cost: 0.0000096,
  },
];

export default function DetailPage() {
  const { t } = useLanguage();
  const { id } = useParams(); 
  const item = data.find((d) => d.company_id === Number(id));

  if (!item) {
    return <p>{t("notFound", aiHistoryDetailTranslations)}</p>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {t("companyInfo", aiHistoryDetailTranslations).replace("${id}", item.company_id.toString())}
      </h1>

      <div className="space-y-3">
        <p>
          <span className="font-semibold">{t("modelName", aiHistoryDetailTranslations)}</span> {item.model_name}
        </p>
        <p>
          <span className="font-semibold">{t("inputTokens", aiHistoryDetailTranslations)}</span> {item.input_tokens}
        </p>
        <p>
          <span className="font-semibold">{t("outputTokens", aiHistoryDetailTranslations)}</span> {item.output_tokens}
        </p>
        <p>
          <span className="font-semibold">{t("totalCost", aiHistoryDetailTranslations)}</span> {item.total_cost}
        </p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => history.back()}
      >
        {t("backButton", aiHistoryDetailTranslations)}
      </button>
    </div>
  );
}
