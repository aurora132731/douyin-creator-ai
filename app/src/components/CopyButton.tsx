import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { copyText } from "../utils/clipboard";

interface Props {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "复制", className = "" }: Props) {
  const [done, setDone] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(text);
    if (ok) {
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`btn-ghost flex items-center gap-1.5 text-xs ${className}`}
    >
      {done ? (
        <>
          <Check className="h-3.5 w-3.5 text-green-400" />
          已复制
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {label}
        </>
      )}
    </button>
  );
}
