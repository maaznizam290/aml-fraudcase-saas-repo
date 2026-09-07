import React from 'react';
import { 
  Brain, 
  GitBranch, 
  Cpu, 
  DollarSign, 
  Copy, 
  Check, 
  ShieldCheck, 
  Activity, 
  FileText,
  Sliders,
  Layers,
  Inbox,
  Search,
  Sparkles
} from 'lucide-react';
import { MainNavTab } from '../types';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onCopyPrompt: () => void;
  copied: boolean;
  onOpenAuditLogs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCopyPrompt,
  copied,
  onOpenAuditLogs
}) => {
  const { activeNav, setActiveNav, alerts, candidateRules, memories, userInterceptions } = useApp();

  const navItems: { id: MainNavTab; label: string; count?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'EXECUTIVE_OVERVIEW' },
    { id: 'wallet_interceptor', label: 'PRE-TX_INTERCEPTOR', count: userInterceptions.length, badgeColor: 'bg-red-500' },
    { id: 'fintech_api', label: 'FINTECH_REST_API', badgeColor: 'bg-emerald-500' },
    { id: 'inbox', label: 'ALERT_INBOX', count: alerts.length },
    { id: 'investigate', label: 'INVESTIGATION_WORKSPACE', badgeColor: 'bg-cyan-500' },
    { id: 'hermes', label: 'HERMES_GOVERNANCE', count: candidateRules.filter(r => r.status === 'PROPOSED').length, badgeColor: 'bg-purple-500' },
    { id: 'ml_registry', label: 'MODEL_REGISTRY' },
    { id: 'simulator', label: '14-STEP_SIMULATOR' },
    { id: 'blueprints', label: 'SYSTEM_BLUEPRINTS' },
    { id: 'prompt', label: 'CLAUDE_PROMPT' },
    { id: 'budget', label: 'BUDGET ($275/MO)' },
  ];

  return (
    <header className="border-b border-[#1E293B] bg-[#0F172A] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Upper Brand & Telemetry Bar */}
        <div className="flex items-center justify-between h-15 py-2">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="w-8 h-8 bg-cyan-500 rounded-xs rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)] shrink-0">
              <div className="w-3.5 h-3.5 bg-[#0A0C10] rotate-45"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white font-mono">
                  VERITAS <span className="text-cyan-400">AML</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono uppercase tracking-widest bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 font-bold">
                  AI-NATIVE_ORCHESTRATOR
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                FINTECH FRAUD &amp; AML INTERCEPTION ENGINE
              </p>
            </div>
          </div>

          {/* Telemetry and System Status Badges */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-slate-300 uppercase tracking-wider text-[11px]">
                HERMES AGENT: ACTIVE
              </span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>DuckDB + Isolation Forest</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
              <span>n8n Intake</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/50 rounded-xs font-bold">
              $275/MO BURN
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Audit Logs Trigger */}
            <button
              onClick={onOpenAuditLogs}
              className="px-2.5 py-1.5 bg-[#0A0C10] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] rounded-xs text-xs font-mono transition flex items-center gap-1.5"
              title="Inspect cryptographic SHA-256 PostgreSQL audit trail"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AUDIT_LOGS</span>
            </button>

            {/* Copy Claude Prompt */}
            <button
              onClick={onCopyPrompt}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">COPY_PROMPT</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation with Geometric Styling */}
        <div className="flex space-x-1 border-t border-[#1E293B] -mb-px overflow-x-auto py-1 scrollbar-none">
          {navItems.map((tab) => {
            const isActive = activeNav === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveNav(tab.id)}
                className={`px-3 py-2 text-xs font-mono tracking-wider border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-[#0A0C10] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className={`text-[9px] px-1 py-0.2 rounded-xs font-bold ${
                    isActive 
                      ? 'bg-cyan-400 text-slate-950' 
                      : 'bg-[#1E293B] text-slate-400'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
