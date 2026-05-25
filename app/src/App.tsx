import { useState } from "react";
import { AppFooter } from "./components/AppFooter";
import { LifecycleBar } from "./components/LifecycleBar";
import { ProfileBar } from "./components/ProfileBar";
import { Sidebar } from "./components/Sidebar";
import { DEFAULT_METRICS } from "./data/mockData";
import { useCreatorProfile } from "./hooks/useCreatorProfile";
import { useLifecycleProgress } from "./hooks/useLifecycleProgress";
import { CompliancePage } from "./pages/CompliancePage";
import { CreatePage } from "./pages/CreatePage";
import { DiagnosisPage } from "./pages/DiagnosisPage";
import { GrowthPage } from "./pages/GrowthPage";
import { MetricsPage } from "./pages/MetricsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PrdPage } from "./pages/PrdPage";
import { PublishPage } from "./pages/PublishPage";
import { TopicPage } from "./pages/TopicPage";
import type { TabId } from "./types";

export default function App() {
  const { profile, setProfile } = useCreatorProfile();
  const { completed, markComplete, resetProgress } = useLifecycleProgress();
  const [tab, setTab] = useState<TabId>("overview");
  const [selectedTopic, setSelectedTopic] = useState("");

  const renderPage = () => {
    switch (tab) {
      case "overview":
        return (
          <OverviewPage
            profile={profile}
            metrics={DEFAULT_METRICS}
            completedCount={completed.size}
            onNavigate={setTab}
            onResetProgress={resetProgress}
          />
        );
      case "topic":
        return (
          <TopicPage
            profile={profile}
            onSelectTopic={setSelectedTopic}
            onComplete={() => markComplete("topic")}
          />
        );
      case "create":
        return (
          <CreatePage
            profile={profile}
            selectedTopic={selectedTopic}
            onGoTopic={() => setTab("topic")}
            onComplete={() => markComplete("create")}
          />
        );
      case "publish":
        return (
          <PublishPage
            profile={profile}
            selectedTopic={selectedTopic}
            onComplete={() => markComplete("publish")}
          />
        );
      case "compliance":
        return <CompliancePage onComplete={() => markComplete("compliance")} />;
      case "growth":
        return (
          <GrowthPage
            profile={profile}
            onNavigate={setTab}
            onComplete={() => markComplete("growth")}
          />
        );
      case "diagnosis":
        return (
          <DiagnosisPage
            profile={profile}
            onNavigate={setTab}
            onComplete={() => markComplete("growth")}
          />
        );
      case "metrics":
        return <MetricsPage metrics={DEFAULT_METRICS} />;
      case "prd":
        return <PrdPage />;
      default:
        return null;
    }
  };

  const showLifecycle = ["topic", "create", "publish", "compliance", "growth"].includes(
    tab
  );

  return (
    <div className="flex h-full min-h-screen bg-douyin-dark">
      <Sidebar active={tab} onNavigate={setTab} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 space-y-3 border-b border-douyin-border bg-douyin-dark/95 p-4 backdrop-blur">
          <ProfileBar profile={profile} onChange={setProfile} />
          {showLifecycle && (
            <LifecycleBar
              activeTab={tab}
              completed={completed}
              onNavigate={setTab}
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">{renderPage()}</div>
        <AppFooter />
      </main>
    </div>
  );
}
