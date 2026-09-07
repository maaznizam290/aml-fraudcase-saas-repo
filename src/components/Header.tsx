import React, { useState } from 'react';
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
  Sparkles,
  User,
  ChevronDown,
  Lock,
  X,
  AlertTriangle
} from 'lucide-react';
import { MainNavTab } from '../types';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onCopyPrompt: () => void;
  copied: boolean;
  onOpenAuditLogs: () => void;
  onOpenQaReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onCopyPrompt,
  copied,
  onOpenAuditLogs,
  onOpenQaReport
}) => {
  const { 
    activeNav, 
    setActiveNav, 
    alerts, 
    candidateRules, 
    memories, 
    userInterceptions,
    currentUser,
    switchUser,
    knownUsers,
    demoMode,
    setDemoMode,
    auditChainVerification,
    notificationMessage,
    dismissNotification
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
      {/* Toast Notification Banner */}
      {notificationMessage && (
        <div className={`px-4 py-1.5 text-xs font-mono flex items-center justify-between border-b transition-all ${
          notificationMessage.type === 'error'
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : notificationMessage.type === 'success'
            ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            : 'bg-cyan-950/90 text-cyan-200 border-cyan-800'
        }`}>
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            {notificationMessage.type === 'error' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate">{notificationMessage.text}</span>
          </div>
          <button onClick={dismissNotification} className="hover:opacity-80 p-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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
                {/* Mode Indicator Badge */}
                <span className="px-1.5 py-0.2 rounded-xs text-[9px] font-mono uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-700/70 font-semibold">
                  {demoMode ? 'DEMO_MODE (POSTGRES READY)' : 'LIVE_PRODUCTION'}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                FINTECH FRAUD &amp; AML INTERCEPTION ENGINE
              </p>
            </div>
          </div>

          {/* Telemetry and System Status Badges */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-slate-300 uppercase tracking-wider text-[10px]">
                HERMES MEMORY: 3 RULES
              </span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Heuristic Engine</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
              <GitBranch className="w-3 h-3 text-purple-400" />
              <span>n8n Pipeline</span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800"></div>

            <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 border border-emerald-800/50 rounded-xs font-bold">
              $275/MO BURN
            </div>
          </div>

          {/* Right Action Buttons & Operator Role Switcher */}
          <div className="flex items-center gap-2">
            {/* RBAC Operator Selector */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="px-2.5 py-1.5 bg-[#0A0C10] hover:bg-slate-800 text-slate-200 border border-[#1E293B] rounded-xs text-xs font-mono transition flex items-center gap-1.5"
                title="Switch active user to test Analyst vs Chief Compliance Officer RBAC permissions"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold text-white max-w-[110px] truncate">{currentUser.name}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded-xs font-bold uppercase ${
                  currentUser.role === 'compliance_officer' 
                    ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                }`}>
                  {currentUser.role === 'compliance_officer' ? 'CCO' : 'ANALYST'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-[#0A0C10] border border-[#1E293B] rounded-xs shadow-xl z-50 py-1 font-mono text-xs">
                  <div className="px-3 py-1.5 border-b border-[#1E293B] text-[10px] text-slate-400 uppercase tracking-wider">
                    Select Active Operator (RBAC)
                  </div>
                  {knownUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex flex-col transition hover:bg-slate-800 ${
                        currentUser.id === u.id ? 'bg-slate-800/60 text-white' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{u.name}</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded-xs font-bold uppercase ${
                          u.role === 'compliance_officer' 
                            ? 'bg-purple-900 text-purple-200' 
                            : 'bg-cyan-900 text-cyan-200'
                        }`}>
                          {u.role === 'compliance_officer' ? 'CCO / MLRO' : 'ANALYST'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">{u.title}</span>
                    </button>
                  ))}
                  <div className="px-3 py-1.5 border-t border-[#1E293B] text-[9px] text-slate-500">
                    *CCO role is required to promote Hermes rules to production.
                  </div>
                </div>
              )}
            </div>

            {/* Audit Logs Trigger */}
            <button
              onClick={onOpenAuditLogs}
              className="px-2.5 py-1.5 bg-[#0A0C10] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] rounded-xs text-xs font-mono transition flex items-center gap-1.5"
              title="Inspect cryptographic SHA-256 PostgreSQL audit trail"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">AUDIT_LOGS</span>
            </button>

            {/* QA Test Report Trigger */}
            {onOpenQaReport && (
              <button
                onClick={onOpenQaReport}
                className="px-2.5 py-1.5 bg-[#0A0C10] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] rounded-xs text-xs font-mono transition flex items-center gap-1.5"
                title="View SQA End-to-End Test Suite & Regulatory Compliance Report"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">QA_REPORT</span>
              </button>
            )}

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

