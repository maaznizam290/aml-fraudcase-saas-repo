import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HermesMemoryType, HermesCandidateRule } from '../types';
import { 
  Brain, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Lock, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Sliders, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  AlertCircle,
  Play,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const HermesGovernanceView: React.FC = () => {
  const { memories, candidateRules, updateCandidateRuleStatus, runBacktest, currentUser, switchUser } = useApp();
  const [selectedMemoryType, setSelectedMemoryType] = useState<HermesMemoryType | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'CANDIDATE_RULES' | 'MEMORIES'>('CANDIDATE_RULES');
  
  // Backtest state per rule
  const [backtestLoading, setBacktestLoading] = useState<Record<string, boolean>>({});
  const [backtestData, setBacktestData] = useState<Record<string, any>>({});

  const filteredMemories = memories.filter(m => {
    if (selectedMemoryType === 'ALL') return true;
    return m.memory_type === selectedMemoryType;
  });

  const handleRunBacktest = async (ruleId: string) => {
    setBacktestLoading(prev => ({ ...prev, [ruleId]: true }));
    try {
      const result = await runBacktest(ruleId, 25000, 'high_amount');
      setBacktestData(prev => ({ ...prev, [ruleId]: result }));
    } catch (err: any) {
      console.error('Failed to run backtest:', err);
    } finally {
      setBacktestLoading(prev => ({ ...prev, [ruleId]: false }));
    }
  };

  const handlePromoteRule = async (ruleId: string, targetStatus: HermesCandidateRule['status']) => {
    await updateCandidateRuleStatus(ruleId, targetStatus);
  };

  const isCCO = currentUser.role === 'compliance_officer';

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rotate-45"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold">
              [ NOUS_RESEARCH_HERMES // INSTITUTIONAL_MEMORY_LAYER ]
            </span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 font-mono tracking-tight">
            Hermes Self-Learning Engine &amp; Multi-Tier Governance
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed font-sans">
            Continuous institutional learning across investigations. Synthesizes analyst overrides into candidate heuristics with strict CCO human-in-the-loop signoff and real historical backtesting.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="px-3 py-1.5 bg-[#0A0C10] border border-purple-500/40 rounded-xs text-purple-300">
            <span>MEMORIES: </span>
            <strong className="text-white">{memories.length}</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#0A0C10] border border-amber-500/40 rounded-xs text-amber-300">
            <span>PROPOSED: </span>
            <strong className="text-white">{candidateRules.filter(r => r.status === 'PROPOSED').length}</strong>
          </div>
          <div className="px-3 py-1.5 bg-[#0A0C10] border border-cyan-500/40 rounded-xs text-cyan-300">
            <span>DEPLOYED: </span>
            <strong className="text-white">{candidateRules.filter(r => r.status === 'DEPLOYED').length}</strong>
          </div>
        </div>
      </div>

      {/* Regulatory Boundary Card & Active Operator Role */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-amber-950/20 border border-amber-500/40 rounded-xs p-3 flex items-start gap-3">
          <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-300 font-mono uppercase block text-[11px]">
              Statutory Guardrail: No Autonomous Heuristic Deployment
            </span>
            <p className="text-slate-300 font-sans mt-0.5 text-[11px] leading-relaxed">
              Hermes agent memory is strictly separated into advisory and candidate proposal tiers. Under FinCEN and OCC model validation standards, no candidate rule or weight adjustment is ever activated in production without authenticated Chief Compliance Officer (CCO) signoff.
            </p>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-3 flex flex-col justify-between text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Active Operator (RBAC):</span>
            <div className="flex items-center gap-2 mt-1">
              <strong className="text-white">{currentUser.name}</strong>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                isCCO ? 'bg-purple-950 text-purple-300 border border-purple-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {isCCO ? 'CCO / MLRO' : 'ANALYST'}
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Deploy Permission:</span>
            <strong className={isCCO ? 'text-emerald-400' : 'text-rose-400'}>
              {isCCO ? 'AUTHORIZED (CCO)' : 'RESTRICTED (ANALYST)'}
            </strong>
          </div>
        </div>
      </div>

      {/* Sub-Nav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('CANDIDATE_RULES')}
          className={`px-3 py-1.5 rounded-xs transition flex items-center gap-2 ${
            activeTab === 'CANDIDATE_RULES'
              ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold'
              : 'bg-[#0A0C10] border border-[#1E293B] text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>CANDIDATE_HEURISTICS_QUEUE ({candidateRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MEMORIES')}
          className={`px-3 py-1.5 rounded-xs transition flex items-center gap-2 ${
            activeTab === 'MEMORIES'
              ? 'bg-purple-950 border border-purple-400 text-purple-300 font-bold'
              : 'bg-[#0A0C10] border border-[#1E293B] text-slate-400 hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-400" />
          <span>MULTI-TIER_MEMORY_INSPECTION ({memories.length})</span>
        </button>
      </div>

      {/* VIEW 1: Candidate Heuristics Queue */}
      {activeTab === 'CANDIDATE_RULES' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Heuristics generated by Hermes from analyst overrides and recurrent pattern reflections:
            </span>
            <span className="text-cyan-400">
              100% REVERSIBLE &amp; AUDITABLE
            </span>
          </div>

          <div className="space-y-4">
            {candidateRules.map((rule) => {
              const isProposed = rule.status === 'PROPOSED';
              const isApproved = rule.status === 'APPROVED';
              const isDeployed = rule.status === 'DEPLOYED';
              const isRejected = rule.status === 'REJECTED';
              const report = backtestData[rule.id];
              const isLoadingBacktest = backtestLoading[rule.id];

              return (
                <div 
                  key={rule.id}
                  className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {rule.title}
                      </span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-xs font-bold uppercase ${
                        isProposed
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : isApproved || isDeployed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {rule.status}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-500">
                      Proposed: {rule.proposed_at.substring(0, 16).replace('T', ' ')}
                    </div>
                  </div>

                  <p className="text-slate-300 font-sans text-xs leading-relaxed">
                    {rule.description}
                  </p>

                  {/* Pseudo-Code Logic Box */}
                  <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xs text-[11px] text-cyan-300 font-mono">
                    <span className="text-slate-500 block text-[9px] uppercase">Synthesized Rule Logic:</span>
                    <code>{rule.rule_logic}</code>
                  </div>

                  {/* Real Historical Backtest Results Section */}
                  {report && (
                    <div className="p-3 bg-[#080A0E] border border-cyan-950 rounded-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-cyan-400" />
                          HISTORICAL BACKTEST RESULTS (ON REAL TRANSACTIONS DATABASE)
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Evaluated: {report.total_transactions_evaluated} txns
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                        <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                          <span className="text-slate-400 block text-[9px] uppercase">Precision:</span>
                          <strong className="text-emerald-400 text-sm">{report.precision_pct}%</strong>
                        </div>
                        <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                          <span className="text-slate-400 block text-[9px] uppercase">Recall:</span>
                          <strong className="text-cyan-400 text-sm">{report.recall_pct}%</strong>
                        </div>
                        <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                          <span className="text-slate-400 block text-[9px] uppercase">Confusion Matrix:</span>
                          <span className="text-white text-xs">TP: {report.true_positives} | FP: {report.false_positives}</span>
                        </div>
                        <div className="bg-[#0F172A] p-2 rounded border border-[#1E293B]">
                          <span className="text-slate-400 block text-[9px] uppercase">Est. Annual Prevented:</span>
                          <strong className="text-amber-300 text-xs">PKR {(report.estimated_annual_loss_prevented_pkr / 1000000).toFixed(1)}M</strong>
                        </div>
                      </div>

                      {report.sample_flagged?.length > 0 && (
                        <div className="text-[10px] text-slate-400 pt-1">
                          <span className="text-slate-500 block uppercase">Sample Flagged Transactions:</span>
                          <div className="space-y-1 mt-1 font-mono">
                            {report.sample_flagged.map((st: any) => (
                              <div key={st.id} className="flex items-center justify-between bg-[#0F172A] px-2 py-1 rounded">
                                <span className="text-slate-300">{st.id} ({st.channel})</span>
                                <span className="text-amber-400">PKR {st.amount.toLocaleString()}</span>
                                <span className={st.is_actual_fraud ? 'text-emerald-400' : 'text-slate-500'}>
                                  {st.is_actual_fraud ? 'True Positive' : 'False Positive'}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Metrics & Rationale Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E293B] text-[11px]">
                    <div className="flex flex-wrap items-center gap-2 text-slate-400">
                      <span>Impact: <strong className="text-white">{rule.impact_cases_count} cases</strong></span>
                      <span className="text-slate-600">•</span>
                      <span>Rationale: <span className="text-slate-300 italic">{rule.rationale}</span></span>
                      {rule.reviewed_by && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-emerald-400 font-semibold">Signoff: {rule.reviewed_by}</span>
                        </>
                      )}
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-2">
                      {/* Backtest Button */}
                      <button
                        onClick={() => handleRunBacktest(rule.id)}
                        disabled={isLoadingBacktest}
                        className="px-2.5 py-1 bg-[#0F172A] hover:bg-slate-800 text-cyan-300 border border-cyan-800 rounded-xs transition text-xs flex items-center gap-1"
                        title="Evaluate this candidate rule against real historical transactions table"
                      >
                        <Play className={`w-3 h-3 ${isLoadingBacktest ? 'animate-spin' : ''}`} />
                        <span>{isLoadingBacktest ? 'BACKTESTING...' : 'RUN_BACKTEST'}</span>
                      </button>

                      {isProposed && (
                        <>
                          <button
                            onClick={() => handlePromoteRule(rule.id, 'APPROVED')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs transition text-xs flex items-center gap-1"
                            title={isCCO ? 'Approve candidate rule' : 'Requires CCO role to deploy'}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>APPROVE</span>
                          </button>
                          <button
                            onClick={() => handlePromoteRule(rule.id, 'REJECTED')}
                            className="px-3 py-1 bg-[#0F172A] hover:bg-rose-950 text-rose-400 hover:text-rose-300 border border-rose-900 rounded-xs transition text-xs"
                          >
                            REJECT
                          </button>
                        </>
                      )}

                      {isApproved && (
                        <button
                          onClick={() => handlePromoteRule(rule.id, 'DEPLOYED')}
                          className={`px-3 py-1 font-bold rounded-xs transition text-xs flex items-center gap-1 ${
                            isCCO 
                              ? 'bg-cyan-600 hover:bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-600'
                          }`}
                          title={isCCO ? 'Deploy with CCO cryptographic signoff' : 'Switch to David Vance (CCO) in the top nav to deploy'}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{isCCO ? 'DEPLOY_TO_PRODUCTION (CCO)' : 'DEPLOY (REQUIRES CCO)'}</span>
                        </button>
                      )}

                      {isDeployed && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 px-2 py-0.5 bg-emerald-950/40 border border-emerald-800 rounded-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          ACTIVE_IN_PRODUCTION
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Multi-Tier Memory Inspection */}
      {activeTab === 'MEMORIES' && (
        <div className="space-y-3 font-mono text-xs">
          {/* Memory Type Filter Pills */}
          <div className="flex items-center gap-2 border-b border-[#1E293B] pb-2 overflow-x-auto">
            {(['ALL', 'EPISODIC', 'SEMANTIC', 'SKILL', 'FEEDBACK'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMemoryType(type)}
                className={`px-2.5 py-1 rounded-xs transition text-[11px] ${
                  selectedMemoryType === type
                    ? 'bg-purple-950 border border-purple-400 text-purple-300 font-bold'
                    : 'bg-[#0A0C10] border border-[#1E293B] text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredMemories.map((mem) => (
              <div 
                key={mem.id}
                className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3 space-y-2 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] px-1.5 py-0.2 bg-purple-950 text-purple-300 border border-purple-800 rounded font-bold">
                      {mem.memory_type}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Conf: {Math.round(mem.confidence * 100)}%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-200 text-xs">
                    {mem.title}
                  </h4>

                  <p className="text-slate-400 font-sans text-xs leading-relaxed">
                    {mem.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-slate-500">
                  <div className="flex items-center gap-1 overflow-hidden">
                    {mem.tags.map((t, idx) => (
                      <span key={idx} className="bg-[#0F172A] text-slate-400 px-1 py-0.2 rounded truncate">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <span>{mem.created_at.substring(0, 10)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
