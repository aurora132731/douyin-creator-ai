import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  content: string;
  onBack: () => void;
  backLabel?: string;
}

/** 应用内阅读 Markdown 原文（避免浏览器直接打开 .md 时的 UTF-8 乱码） */
export function MarkdownDocViewer({ title, content, onBack, backLabel = "返回" }: Props) {
  return (
    <div className="animate-slide-up space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="btn-ghost inline-flex items-center gap-1 text-xs"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {backLabel}
      </button>

      <header>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-fg-muted">应用内阅读 · UTF-8 正常显示</p>
      </header>

      <article className="glass-card max-h-[calc(100vh-12rem)] overflow-y-auto p-5 sm:p-6">
        <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-fg">
          {content}
        </pre>
      </article>
    </div>
  );
}
