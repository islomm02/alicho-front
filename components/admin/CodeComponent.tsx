"use client"
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CodeBlock({code}:{ code: string,  }) {
    const language = "javascript"
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-[#1e1e1e] rounded-xl overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 rounded-md flex items-center gap-1 text-sm"
      >
        <Copy size={16} />
        {copied ? "Copied!" : "Copy"}
      </button>
      <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0 }}>
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
