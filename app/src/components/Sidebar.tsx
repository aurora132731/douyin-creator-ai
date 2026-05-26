import {

  BarChart3,

  FileText,

  LayoutDashboard,

  Lightbulb,

  PenLine,

  Send,

  Shield,

  Sparkles,

  TrendingUp,

} from "lucide-react";

import type { TabId } from "../types";



const NAV: { id: TabId; label: string; icon: typeof LayoutDashboard; group?: string }[] = [

  { id: "overview", label: "工作台总览", icon: LayoutDashboard },

  { id: "topic", label: "AI 选题", icon: Lightbulb, group: "创作者链路" },

  { id: "create", label: "AI 创作", icon: PenLine },

  { id: "publish", label: "发布助手", icon: Send },

  { id: "compliance", label: "合规预检", icon: Shield },

  { id: "growth", label: "成长复盘", icon: TrendingUp },

  { id: "diagnosis", label: "AI 作品诊断", icon: Sparkles, group: "运营" },

  { id: "metrics", label: "数据指标", icon: BarChart3 },

  { id: "prd", label: "产品方案", icon: FileText },

];



interface Props {

  active: TabId;

  onNavigate: (tab: TabId) => void;

}



export function Sidebar({ active, onNavigate }: Props) {

  let lastGroup = "";



  return (

    <aside className="flex w-56 shrink-0 flex-col border-r border-line-subtle bg-sidebar">

      <div className="flex items-center gap-2.5 border-b border-line-subtle px-5 py-5">

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-douyin-cyan to-douyin-pink">

          <Sparkles className="h-5 w-5 text-white" />

        </div>

        <div>

          <div className="text-sm font-bold text-fg">创灵</div>

          <div className="text-[10px] text-fg-muted">抖音创作者 AI 工作台</div>

        </div>

      </div>



      <nav className="flex-1 overflow-y-auto p-3">

        {NAV.map((item) => {

          const showGroup = item.group && item.group !== lastGroup;

          if (item.group) lastGroup = item.group;

          const Icon = item.icon;

          const isActive = active === item.id;



          return (

            <div key={item.id}>

              {showGroup && (

                <div className="mb-1 mt-4 px-3 text-[10px] font-medium uppercase tracking-wider text-fg-subtle">

                  {item.group}

                </div>

              )}

              <button

                type="button"

                onClick={() => onNavigate(item.id)}

                className={`mb-0.5 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition ${

                  isActive

                    ? "bg-[var(--nav-active-bg)] font-medium text-fg"

                    : "text-fg-muted hover:bg-[var(--nav-hover)] hover:text-fg"

                }`}

              >

                <Icon className={`h-4 w-4 ${isActive ? "text-douyin-cyan" : ""}`} />

                {item.label}

              </button>

            </div>

          );

        })}

      </nav>



      <div className="border-t border-line-subtle p-4">

        <div className="rounded-xl bg-muted p-3 text-[11px] leading-relaxed text-fg-muted">

          <span className="text-douyin-cyan">面试演示版</span>

          <br />

          GitHub Pages · Mock

          <br />

          <span className="text-[10px] text-fg-subtle">非字节官方产品</span>

        </div>

      </div>

    </aside>

  );

}

