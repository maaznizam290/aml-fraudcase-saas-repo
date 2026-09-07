import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { InvestorDemoBar } from './components/InvestorDemoBar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { AlertInbox } from './components/AlertInbox';
import { InvestigationWorkspace } from './components/InvestigationWorkspace';
import { WalletInterceptorView } from './components/WalletInterceptorView';
import { FintechApiView } from './components/FintechApiView';
import { HermesGovernanceView } from './components/HermesGovernanceView';
import { ModelRegistryView } from './components/ModelRegistryView';
import { InvestorDemoSimulator } from './components/InvestorDemoSimulator';
import { BlueprintInspector } from './components/BlueprintInspector';
import { PromptViewer } from './components/PromptViewer';
import { BudgetBreakdown } from './components/BudgetBreakdown';
import { AuditLogModal } from './components/AuditLogModal';
import { QaReportModal } from './components/QaReportModal';
import { generateClaudeCodePrompt } from './data/masterPrompt';
import { PromptConfig } from './types';

const MainLayout: React.FC = () => {
  const { activeNav, setActiveNav } = useApp();
  const [copied, setCopied] = useState(false);
  const [showAuditLogs, setShowAuditLogs] = useState(false);
  const [showQaReport, setShowQaReport] = useState(false);

  const [promptConfig, setPromptConfig] = useState<PromptConfig>({
    includeDemoMode: true,
    includeHermes: true,
    includeN8n: true,
    includeDuckDbMl: true,
    includeSlackResend: true,
    budgetCap: 300,
    targetModel: 'claude-3-7-sonnet'
  });

  const handleCopyPrompt = () => {
    const text = generateClaudeCodePrompt(promptConfig);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] font-sans antialiased selection:bg-cyan-950 selection:text-cyan-300 flex flex-col">
      {/* Top Header */}
      <Header
        onCopyPrompt={handleCopyPrompt}
        copied={copied}
        onOpenAuditLogs={() => setShowAuditLogs(true)}
        onOpenQaReport={() => setShowQaReport(true)}
      />

      {/* Sticky Investor Demo Bar (5 VC Scenarios, 14-Step Progress, Pitch Notes, Offline/Live Toggle) */}
      <InvestorDemoBar />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {activeNav === 'overview' && <ExecutiveDashboard />}
        {activeNav === 'wallet_interceptor' && <WalletInterceptorView />}
        {activeNav === 'fintech_api' && <FintechApiView />}
        {activeNav === 'inbox' && <AlertInbox />}
        {activeNav === 'investigate' && <InvestigationWorkspace />}
        {activeNav === 'hermes' && <HermesGovernanceView />}
        {activeNav === 'ml_registry' && <ModelRegistryView />}
        {activeNav === 'simulator' && <InvestorDemoSimulator />}
        {activeNav === 'blueprints' && <BlueprintInspector />}
        {activeNav === 'prompt' && (
          <PromptViewer
            onCopyPrompt={handleCopyPrompt}
            copied={copied}
            config={promptConfig}
            setConfig={setPromptConfig}
          />
        )}
        {activeNav === 'budget' && <BudgetBreakdown />}
      </main>

      {/* Audit Log Modal */}
      {showAuditLogs && (
        <AuditLogModal onClose={() => setShowAuditLogs(false)} />
      )}

      {/* QA Test Suite & Regulatory Compliance Report Modal */}
      {showQaReport && (
        <QaReportModal onClose={() => setShowQaReport(false)} />
      )}

      {/* Geometric Balance Technical Status Bar Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0F172A] py-2.5 px-4 sm:px-8 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-cyan-400 rotate-45 shrink-0"></span>
            <span className="font-bold text-white tracking-widest uppercase">
              VERITAS AML // INVESTOR DEMO MVP READY
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">FINTECH PROTOTYPE SUITE</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[10px]">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              N8N_WEBHOOK_INGEST
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              CLAUDE_3.7_SONNET_REASONING
            </span>
            <span className="flex items-center gap-1.5 text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
              HERMES_4_TIER_MEMORY
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              DUCKDB_ML_ENSEMBLE
            </span>
            <span className="text-slate-500">SYS_VER: 2026.09.07</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
