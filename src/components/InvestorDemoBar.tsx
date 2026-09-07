import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SCENARIOS } from '../data/syntheticData';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  MessageSquare, 
  Activity, 
  Database,
  ExternalLink,
  Bot
} from 'lucide-react';

const DEMO_14_STEPS = [
  {
    step: 1,
    title: 'Initial State',
    actor: 'Investor',
    action: 'Observing 23 active alerts in AML queue; median triage time sits at 4.2 mins.',
    investorNarration: 'Notice the queue density. Traditional compliance teams spend 40 minutes per alert doing manual tab-hopping across KYC, Core Banking, and device logs.'
  },
  {
    step: 2,
    title: 'Simulate Suspicious Transaction',
    actor: 'Investor',
    action: 'Investor clicks scenario trigger button on control bar.',
    investorNarration: 'Watch what happens the moment a transaction hits our ingestion gateway.'
  },
  {
    step: 3,
    title: 'Pipeline Ingest',
    actor: 'n8n Webhook',
    action: 'n8n webhook fires intake node; normalizes transaction schema and assigns correlation GUID.',
    investorNarration: 'Our stateless intake layer receives the raw payload and immediately triggers parallel feature extraction.'
  },
  {
    step: 4,
    title: 'Data Gathering & Enrichment',
    actor: 'System',
    action: 'Parallel fetch executes across Core Ledger (90-day history), OFAC/Sanctions lists, and KYC profile.',
    investorNarration: 'Instead of an analyst opening 4 browser tabs, our engine gathers the entire evidentiary package in under 200 milliseconds.'
  },
  {
    step: 5,
    title: 'Python ML Anomaly Scoring',
    actor: 'DuckDB + Scikit-Learn',
    action: 'DuckDB computes 90-day rolling velocity; Isolation Forest & XGBoost emit fraud probability 0.89, anomaly score 0.93.',
    investorNarration: 'Here is our quantitative backbone based on the Claude-Fraud-Detection benchmark. Isolation Forest detects an 8.4x velocity spike and device hardware mismatch.'
  },
  {
    step: 6,
    title: 'Claude Reasoning & Synthesis',
    actor: 'Claude 3.7 Sonnet',
    action: 'Claude synthesizes evidence package into strict JSON schema with direct citations.',
    investorNarration: 'Next, Claude acts as the reasoning investigator. It cross-checks the ML score against customer baseline and generates an explainable brief with zero hallucinations.'
  },
  {
    step: 7,
    title: 'Recommendation Card Emitted',
    actor: 'Veritas AI Hub',
    action: 'Displays ESCALATE (94% Confidence) with 4 cited behavioral red flags.',
    investorNarration: 'We get a definitive recommendation: ESCALATE with 94% confidence. Not vague probabilities, but an actionable, cited conclusion.'
  },
  {
    step: 8,
    title: 'Explainability & Citations',
    actor: 'Compliance UI',
    action: 'Analyst inspects "Why?" breakdown citing exact data fields (velocity_90d_ratio=8.4, dev_unknown_macbook).',
    investorNarration: 'Notice every single bullet point is tethered to a verifiable database field. Regulators demand complete determinism, and we give it to them.'
  },
  {
    step: 9,
    title: 'Human Analyst Decision',
    actor: 'Compliance Lead',
    action: 'Analyst reviews corroboration and clicks [Approve Recommendation].',
    investorNarration: 'Crucial regulatory boundary: Veritas never closes accounts autonomously. A human compliance officer remains the sovereign authority on adverse actions.'
  },
  {
    step: 10,
    title: 'Case Disposition & Action',
    actor: 'System',
    action: 'Alert status transitions to RESOLVED (ESCALATED). Virtual card tokens placed on temporary administrative hold.',
    investorNarration: 'The disposition executes immediately, saving the institution from severe fund leakage.'
  },
  {
    step: 11,
    title: 'Immutable Audit Trail',
    actor: 'Supabase PostgreSQL',
    action: 'Cryptographic SHA-256 evidence hash logged to audit_logs table with actor timestamp and model version.',
    investorNarration: 'An immutable cryptographic record is etched into PostgreSQL. When the OCC or FinCEN audits this case 3 years from now, the exact evidence is replayable.'
  },
  {
    step: 12,
    title: 'Hermes Learning Trigger',
    actor: 'Hermes Agent',
    action: 'Investigation outcome and rationale dispatched to Hermes self-learning service.',
    investorNarration: 'Now comes the defensible moat: the outcome is dispatched to our Nous Research Hermes learning agent.'
  },
  {
    step: 13,
    title: 'Institutional Memory Indexed',
    actor: 'Hermes Memory',
    action: 'New pattern indexed into Semantic and Skill memory: "Virtual Card Micro-Smurfing to Crypto Off-Ramps (94% Confidence)".',
    investorNarration: 'Hermes indexes the new smurfing topology into multi-tier memory. Next time an attacker tries this variant, detection is near-instant.'
  },
  {
    step: 14,
    title: 'The Investor Climax',
    actor: 'Founder',
    action: 'Demonstration completes in 3 minutes 20 seconds.',
    investorNarration: 'Notice how we didn\'t just solve one alert—our platform got permanently smarter for every future compliance analyst. That is the AI-native compliance fly-wheel.'
  }
];

export const InvestorDemoBar: React.FC = () => {
  const { 
    activeScenarioId, 
    triggerScenario, 
    simulationStep, 
    runSimulationStep, 
    resetSimulation, 
    demoMode, 
    setDemoMode,
    setActiveNav
  } = useApp();

  const [showPitchNotes, setShowPitchNotes] = useState<boolean>(true);
  const currentStep = DEMO_14_STEPS[Math.min(simulationStep, DEMO_14_STEPS.length - 1)];

  return (
    <div className="bg-[#0A0C10] border-b border-[#1E293B] sticky top-0 z-40 shadow-xl">
      {/* Upper Control Strip: Scenario Trigger & Dual Mode Toggle */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B]/80">
        {/* Left: Quick Scenarios */}
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none">
          <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest shrink-0 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-cyan-400 rotate-45 inline-block"></span>
            VC_SCENARIOS:
          </span>
          {SCENARIOS.map((scenario) => {
            const isSelected = activeScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  triggerScenario(scenario.id);
                  setActiveNav('investigate');
                }}
                className={`text-[11px] font-mono px-2.5 py-1 rounded-xs transition flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 font-semibold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                    : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="text-[9px] px-1 py-0.2 bg-[#0A0C10] rounded-xs text-slate-400 border border-[#1E293B]">
                  {scenario.badge.replace('SCENARIO_', '')}
                </span>
                <span>{scenario.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Runtime Mode Toggle & Pitch Script Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Pitch Script Drawer Toggle */}
          <button
            onClick={() => setShowPitchNotes(!showPitchNotes)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xs text-[11px] font-mono transition border ${
              showPitchNotes
                ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3 h-3 text-amber-400" />
            <span>PITCH_SCRIPT</span>
          </button>

          {/* Dual Runtime Mode Toggle */}
          <div className="flex items-center bg-[#0F172A] border border-[#1E293B] rounded-xs p-0.5 font-mono text-[10px]">
            <button
              onClick={() => setDemoMode(true)}
              className={`px-2 py-0.5 rounded-xs transition ${
                demoMode
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-semibold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Runs fully standalone with deterministic synthetic data (100% stable investor demo)"
            >
              DEMO_MODE=TRUE (OFFLINE)
            </button>
            <button
              onClick={() => setDemoMode(false)}
              className={`px-2 py-0.5 rounded-xs transition ${
                !demoMode
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Connects to live Supabase / Anthropic / n8n / Python ML API endpoints"
            >
              LIVE_MODE (APIs)
            </button>
          </div>
        </div>
      </div>

      {/* Lower Walkthrough Strip: 14-Step Progress Bar & Founder Narration */}
      <div className="px-4 py-2 bg-[#0F172A]/70 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Step Info & Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              STAGE {currentStep.step} / {DEMO_14_STEPS.length}:
            </span>
            <span className="text-xs font-mono font-bold text-white">
              {currentStep.title}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-xs bg-[#0A0C10] border border-[#1E293B] text-cyan-400">
              [{currentStep.actor}]
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={runSimulationStep}
              disabled={simulationStep >= DEMO_14_STEPS.length - 1}
              className={`flex items-center gap-1 px-3 py-1 rounded-xs text-[11px] font-mono font-bold transition uppercase ${
                simulationStep >= DEMO_14_STEPS.length - 1
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-[#1E293B]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
              }`}
            >
              <span>NEXT_STAGE</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={resetSimulation}
              className="p-1 rounded-xs bg-[#0A0C10] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#1E293B] transition"
              title="Reset Demo Loop"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 14 Step Ticks */}
        <div className="hidden lg:flex items-center gap-1">
          {DEMO_14_STEPS.map((s, idx) => (
            <div
              key={idx}
              className={`h-1.5 w-4 rounded-none transition-all ${
                idx === simulationStep
                  ? 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]'
                  : idx < simulationStep
                  ? 'bg-cyan-800'
                  : 'bg-[#1E293B]'
              }`}
              title={`Step ${s.step}: ${s.title}`}
            />
          ))}
        </div>
      </div>

      {/* Founder Pitch Script Drawer */}
      {showPitchNotes && (
        <div className="px-4 py-2.5 bg-[#080A0E] border-t border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 max-w-5xl">
            <div className="px-1.5 py-0.5 rounded-xs bg-amber-950 text-amber-300 font-mono text-[9px] uppercase tracking-wider font-bold border border-amber-800/60 shrink-0 mt-0.5">
              FOUNDER_SAY_THIS
            </div>
            <p className="text-slate-200 font-sans italic leading-relaxed text-[12px]">
              "{currentStep.investorNarration}"
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              TIER_1_AUDIT_SAFE
            </span>
            <span className="text-slate-600">|</span>
            <span>HERMES_MEMORY_SYNCED</span>
          </div>
        </div>
      )}
    </div>
  );
};
