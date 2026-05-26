import { useState } from "react";
import { useTheme } from "./hooks/useTheme";
import { AppFooter } from "./components/AppFooter";
import { LifecycleBar } from "./components/LifecycleBar";
import { ProfileBar } from "./components/ProfileBar";
import { Sidebar } from "./components/Sidebar";
import { DEFAULT_METRICS } from "./data/mockData";
import { useCreatorProfile } from "./hooks/useCreatorProfile";
import { useLifecycleProgress } from "./hooks/useLifecycleProgress";
import { DEFAULT_TOPIC_SESSION } from "./hooks/useTopicSession";
import { CompliancePage } from "./pages/CompliancePage";
import { CreatePage, type ScriptDraftPayload } from "./pages/CreatePage";
import { DiagnosisPage } from "./pages/DiagnosisPage";
import { GrowthPage } from "./pages/GrowthPage";
import { MetricsPage } from "./pages/MetricsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { PrdPage } from "./pages/PrdPage";
import { PublishPage } from "./pages/PublishPage";
import { TopicPage } from "./pages/TopicPage";
import type { TabId, TopicSessionContext } from "./types";

export default function App() {
  const { theme, setTheme } = useTheme();
  const { profile, setProfile } = useCreatorProfile();
  const { completed, markComplete, resetProgress } = useLifecycleProgress();
  const [tab, setTab] = useState<TabId>("overview");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topicSession, setTopicSession] = useState<TopicSessionContext>(DEFAULT_TOPIC_SESSION);
  const [scriptDraft, setScriptDraft] = useState<ScriptDraftPayload | undefined>();
  const [diagnosisWorkId, setDiagnosisWorkId] = useState<string | null>(null);
  const compliancePassed = completed.has("compliance");

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
            session={topicSession}
            onSessionChange={setTopicSession}
            onProfileChange={setProfile}
            onSelectTopic={setSelectedTopic}
            onNavigateToCreate={() => setTab("create")}
            onComplete={() => markComplete("topic")}
          />
        );
      case "create":
        return (
          <CreatePage
            profile={profile}
            session={topicSession}
            selectedTopic={selectedTopic}
            onGoTopic={() => setTab("topic")}
            onGoCompliance={() => setTab("compliance")}
            onComplete={() => markComplete("create")}
            onScriptDraft={setScriptDraft}
          />
        );
      case "compliance":
        return (
          <CompliancePage
            session={topicSession}
            upstreamDraft={scriptDraft}
            onComplete={() => markComplete("compliance")}
          />
        );
      case "publish":
        return (
          <PublishPage
            profile={profile}
            session={topicSession}
            selectedTopic={selectedTopic}
            compliancePassed={compliancePassed}
            onComplete={() => markComplete("publish")}
          />
        );
      case "growth":
        return (
          <GrowthPage
            profile={profile}
            metrics={DEFAULT_METRICS}
            onNavigate={setTab}
            onStartDiagnosis={(workId) => {
              setDiagnosisWorkId(workId);
              setTab("diagnosis");
            }}
            onComplete={() => markComplete("growth")}
          />
        );
      case "diagnosis":
        return (
          <DiagnosisPage
            profile={profile}
            onNavigate={setTab}
            onComplete={() => markComplete("growth")}
            initialWorkId={diagnosisWorkId}
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

  const showLifecycle = ["topic", "create", "compliance", "publish", "growth"].includes(tab);

  return (
    <div className="flex h-full min-h-screen bg-app text-fg">
      <Sidebar active={tab} onNavigate={setTab} />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 space-y-3 border-b border-line-subtle bg-header/95 p-4 backdrop-blur">
          <ProfileBar profile={profile} onChange={setProfile} theme={theme} onThemeChange={setTheme} />
          {showLifecycle && (
            <LifecycleBar activeTab={tab} completed={completed} onNavigate={setTab} />
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">{renderPage()}</div>
        <AppFooter />
      </main>
    </div>
  );
}
