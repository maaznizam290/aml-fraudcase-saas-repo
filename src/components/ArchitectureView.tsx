import React, { useState } from 'react';
import { GitBranch, Cpu, Brain, AlertTriangle, CheckCircle2, Lock } from 'lucide-react';
import { RESEARCH_FINDINGS, N8N_NODES, ML_MODELS, HERMES_AGENT_ARCHITECTURE } from '../data/architectureData';

export const ArchitectureView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'guardrails' | 'n8n' | 'ml' | 'hermes'>('guardrails');

  return (
    <div className="space-y-4">
      {/* Sub-Navigation in Geometric Style */}
      <div className="flex flex-wrap gap-1 p-1 bg-[#1E293B] rounded-xs font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('guardrails')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
            activeSubTab === 'guardrails'
              ? 'bg-[#0A0C10] text-cyan-300 border border-cyan-500/60 font-bold'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-cyan-400 rotate-45"></span>
          <span>[ 01 // REGULATORY_GUARDRAILS ]</span>
        </button>

        <button
          onClick={() => setActiveSubTab('n8n')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
            activeSubTab === 'n8n'
              ? 'bg-[#0A0C10] text-purple-300 border border-purple-500/60 font-bold'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-purple-400 rotate-45"></span>
          <span>[ 02 // N8N_16_NODE_TOPOLOGY ]</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ml')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
            activeSubTab === 'ml'
              ? 'bg-[#0A0C10] text-cyan-300 border border-cyan-500/60 font-bold'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-cyan-400 rotate-45"></span>
          <span>[ 03 // ML_ANOMALY_PIPELINE ]</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hermes')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
            activeSubTab === 'hermes'
              ? 'bg-[#0A0C10] text-amber-300 border border-amber-500/60 font-bold'
              : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="w-1.5 h-1.5 bg-amber-400 rotate-45"></span>
          <span>[ 04 // HERMES_LEARNING_LOOP ]</span>
        </button>
      </div>

      {/* SubTab 1: Regulatory Guardrails */}
      {activeSubTab === 'guardrails' && (
        <div className="space-y-4">
          {/* Executive Synthesis Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    [ FINTECH_CONSENSUS_DIAGNOSIS ]
                  </span>
                </div>
                <h3 className="text-xl font-light text-white mt-1">
                  {RESEARCH_FINDINGS.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                  {RESEARCH_FINDINGS.sourceCount}. Cross-analysis of FATF standards, CBUAE regulatory guidelines, and practitioner reports.
                </p>
              </div>
              <div className="px-3 py-2 rounded-xs bg-[#0A0C10] border border-rose-900/60 text-rose-400 text-xs font-mono text-right shrink-0">
                <div className="text-[10px] text-slate-500 uppercase">FALSE_POSITIVE_RATE</div>
                <div className="text-base font-bold text-rose-400">{RESEARCH_FINDINGS.falsePositiveRate}</div>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xs bg-[#0A0C10] border border-amber-900/50 flex items-start gap-3 text-xs text-amber-200/90 font-mono">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">[ THE_UNIVERSAL_ANTI_PATTERN ]: </strong>
                {RESEARCH_FINDINGS.keyWarning} Uncontrolled autonomous decisioning causes regulatory shutdowns and destroys customer trust.
              </div>
            </div>
          </div>

          {/* 3-Tier Adoption Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {RESEARCH_FINDINGS.tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-[#0A0C10] rounded-xs p-5 border flex flex-col justify-between ${
                  tier.status === 'ACTIVE_IN_MVP'
                    ? 'border-cyan-500/70 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                    : tier.status === 'ROADMAP'
                    ? 'border-[#1E293B]'
                    : 'border-rose-900/60 bg-rose-950/5'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between font-mono">
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded-xs font-semibold ${
                        tier.status === 'ACTIVE_IN_MVP'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : tier.status === 'ROADMAP'
                          ? 'bg-slate-900 text-slate-300 border border-[#1E293B]'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}
                    >
                      {tier.badge}
                    </span>
                    {tier.status === 'ACTIVE_IN_MVP' && (
                      <span className="flex items-center text-[10px] text-cyan-400 font-semibold gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>IN_SCOPE_FOR_MVP</span>
                      </span>
                    )}
                    {tier.status === 'RESTRICTED' && (
                      <span className="flex items-center text-[10px] text-rose-400 font-semibold gap-1">
                        <Lock className="w-3 h-3" />
                        <span>BANNED</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white tracking-tight font-mono">
                    {tier.tier}
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Workflows:</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{tier.workflows}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Agent Scope:</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{tier.agentRole}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E293B]">
                  <span className="text-[10px] font-mono uppercase text-slate-500">Human Control:</span>
                  <p
                    className={`text-xs mt-1 font-mono leading-snug ${
                      tier.status === 'ACTIVE_IN_MVP' ? 'text-cyan-300' : 'text-slate-300'
                    }`}
                  >
                    {tier.humanControl}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 2: n8n 16-Node Pipeline */}
      {activeSubTab === 'n8n' && (
        <div className="space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
                  [ ORCHESTRATION_TOPOLOGY ]
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 font-mono">
                AML & Fraud Alert Triage Workflow (16-Node Execution Topology)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact translation of the provided 16-node workflow into the production SaaS architecture.
              </p>
            </div>
            <div className="flex items-center">
              <span className="px-2.5 py-1 rounded-xs bg-[#0A0C10] border border-purple-800/50 text-purple-300 text-xs font-mono">
                ENDPOINT: /webhook/aml-fraud-alert
              </span>
            </div>
          </div>

          {/* Node Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {N8N_NODES.map((node) => (
              <div
                key={node.id}
                className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between hover:border-purple-500/50 transition group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-5 h-5 rounded-xs bg-[#0F172A] text-purple-400 border border-purple-800/60 text-[10px] font-mono flex items-center justify-center font-bold">
                      {node.id}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase">
                      {node.type}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-white group-hover:text-purple-300 transition font-mono">
                    {node.name}
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {node.role}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1E293B] text-[10px] font-mono text-slate-500">
                  GUARDRAIL: {node.guardrailNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: ML Anomaly Pipeline */}
      {activeSubTab === 'ml' && (
        <div className="space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    [ GITHUB_REPO_REFERENCE ]
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 font-mono">
                  abhinayasridharrajaram/Claude-Fraud-Detection Architecture
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Leverages DuckDB for sub-millisecond tabular aggregation and combines unsupervised anomaly detectors (Isolation Forest, LOF, OCSVM) with calibrated XGBoost classification.
                </p>
              </div>
              <a
                href="https://github.com/abhinayasridharrajaram/Claude-Fraud-Detection"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xs bg-[#0A0C10] hover:bg-slate-900 text-cyan-300 border border-cyan-800/60 text-xs font-mono shrink-0"
              >
                GITHUB_SOURCE ↗
              </a>
            </div>
          </div>

          {/* Model Registry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ML_MODELS.map((model, idx) => (
              <div
                key={idx}
                className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {model.model}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-xs bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                      ENSEMBLE
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-mono">
                    {model.algorithm}
                  </p>

                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Role:</span>
                      <p className="text-slate-400 leading-relaxed text-[11px]">{model.role}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Input Features:</span>
                      <p className="text-slate-400 font-mono text-[11px]">{model.inputFeatures}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-mono text-[10px] uppercase">Output Metric:</span>
                      <p className="text-cyan-400 font-mono text-[11px]">{model.outputScore}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#1E293B] text-[10px] text-slate-500 font-mono truncate">
                  SRC: {model.originInRepo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Hermes Self-Learning Loop */}
      {activeSubTab === 'hermes' && (
        <div className="space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    [ CONTINUOUS_INSTITUTIONAL_LEARNING ]
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 font-mono">
                  Nous Research Hermes Agent Integration
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Hermes enables persistent institutional memory without model fine-tuning. It reflects on analyst decisions, detects emerging fraud typologies, and proposes versioned candidate heuristics.
                </p>
              </div>
              <a
                href={HERMES_AGENT_ARCHITECTURE.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xs bg-[#0A0C10] hover:bg-slate-900 text-amber-300 border border-amber-800/60 text-xs font-mono shrink-0"
              >
                HERMES_DOCS ↗
              </a>
            </div>
          </div>

          {/* 4 Memory Tiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {HERMES_AGENT_ARCHITECTURE.memoryTiers.map((mem, i) => (
              <div key={i} className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-2">
                <div className="flex items-center justify-between font-mono">
                  <h4 className="text-xs font-bold text-amber-300">{mem.type}</h4>
                  <span className="text-[10px] text-slate-500">{mem.storage}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{mem.content}</p>
                <div className="text-[11px] text-slate-400 bg-[#0F172A] p-2 rounded-xs border border-[#1E293B] mt-2 font-mono">
                  <strong className="text-amber-400 font-semibold">VALUE: </strong>
                  {mem.useCase}
                </div>
              </div>
            ))}
          </div>

          {/* Safe Governance Pipeline */}
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rotate-45"></span>
              Safe Self-Learning Governance Lifecycle (No Autonomous Rule Modification)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 font-mono">
              {HERMES_AGENT_ARCHITECTURE.governancePipeline.map((stage, i) => (
                <div key={i} className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-3 space-y-1 text-xs">
                  <span className="font-bold text-amber-400 text-[11px]">{stage.stage}</span>
                  <p className="text-slate-400 text-[10px] leading-relaxed">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
