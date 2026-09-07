import React from 'react';
import { useApp } from '../context/AppContext';
import { MOCK_TREND_DATA } from '../data/syntheticData';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  TrendingDown, 
  Activity, 
  ChevronRight, 
  AlertTriangle,
  Brain,
  Sliders,
  FileCheck,
  Server
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const { kpis, alerts, selectAlert, setActiveNav, triggerScenario } = useApp();

  return (
    <div className="space-y-4">
      {/* Top Value Prop Banner */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              [ ENTERPRISE_EXECUTIVE_SUMMARY // TIER_1_DEPLOYED ]
            </span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 font-mono tracking-tight">
            Veritas AI-Native AML & Fraud Orchestration Suite
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
            Autonomous alert triage, deterministic evidence aggregation, and DuckDB ensemble anomaly scoring — backed by human compliance signoff and Hermes institutional memory.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveNav('inbox')}
            className="px-3 py-1.5 bg-[#0A0C10] border border-[#1E293B] hover:border-cyan-500 text-xs font-mono text-cyan-300 rounded-xs transition flex items-center gap-1.5"
          >
            <span>VIEW_INBOX ({alerts.length})</span>
            <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button
            onClick={() => setActiveNav('investigate')}
            className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-bold text-slate-950 rounded-xs transition shadow-[0_0_10px_rgba(6,182,212,0.3)] flex items-center gap-1.5"
          >
            <span>ACTIVE_INVESTIGATION</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* KPI 1: Median Triage Time */}
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MEDIAN_TRIAGE_TIME</span>
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-light font-mono text-white">3.8</span>
              <span className="text-xs font-mono text-slate-400">mins</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] font-mono text-emerald-400">
              <TrendingDown className="w-3 h-3" />
              <span>Down from 42 mins baseline</span>
            </div>
          </div>
        </div>

        {/* KPI 2: False-Positive Reduction */}
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">FALSE_POS_REDUCTION</span>
            <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-light font-mono text-cyan-300">87.4%</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              <span>Saves ~3,200 analyst hrs/mo</span>
            </div>
          </div>
        </div>

        {/* KPI 3: AI Acceptance Rate */}
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">AI_ACCEPTANCE_RATE</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-light font-mono text-purple-300">91.4%</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              <span>Compliance Lead Approved</span>
            </div>
          </div>
        </div>

        {/* KPI 4: High-Risk Ratio */}
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">CRITICAL_RATIO</span>
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-light font-mono text-amber-300">
                {kpis.highRiskRatio}%
              </span>
              <span className="text-xs font-mono text-slate-400">triage density</span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-1">
              <span>Filtered from low-risk noise</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Operating Burn */}
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">MONTHLY_BURN</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-light font-mono text-emerald-400">$275</span>
              <span className="text-xs font-mono text-slate-500">/ mo</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400/80 mt-1">
              <span>Lean Pre-Seed Unit Econ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Investor Spotlight: Live Fintech Pre-Transaction Interception */}
      <div className="bg-linear-to-r from-red-950/40 via-[#0F172A] to-cyan-950/40 border border-red-900/50 rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xs bg-red-500/20 border border-red-500/50 flex items-center justify-center shrink-0 text-red-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.2 bg-red-950 text-red-300 border border-red-800 text-[9px] font-mono font-bold rounded-xs">
                NEW RELEASE FOR FINTECHS
              </span>
              <h3 className="text-sm font-bold font-mono text-white">
                Pre-Transaction Fraud Interception (JazzCash, Easypaisa, NayaPay, SadaPay, Raast)
              </h3>
            </div>
            <p className="text-xs text-slate-300 font-sans mt-1 max-w-3xl leading-relaxed">
              When a normal user attempts a fraudulent transfer, the transaction is intercepted <strong className="text-red-300">before funds leave the wallet</strong>. 
              Powered by <span className="text-amber-300 font-mono">developerPratik Random Forest</span> (&lt;5ms), <span className="text-cyan-300 font-mono">Jube AML scenarios</span>, and <span className="text-purple-300 font-mono">FinRobot CoT</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveNav('wallet_interceptor')}
            className="px-3 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold rounded-xs transition flex items-center gap-1.5 shadow"
          >
            <span>LAUNCH_PHONE_SIMULATOR</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveNav('fintech_api')}
            className="px-3 py-2 bg-[#0A0C10] border border-[#1E293B] hover:border-cyan-400 text-cyan-300 text-xs font-mono rounded-xs transition flex items-center gap-1.5"
          >
            <span>VIEW_REST_API</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Charts & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (8 cols): Anomaly Trends Comparison (Recharts) */}
        <div className="lg:col-span-8 bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold font-mono text-white uppercase tracking-wider">
                  24-Hour Pipeline Analytics: ML Anomalies vs False Positives Cleared
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Real-time correlation of raw incoming rule triggers against DuckDB ML ensemble anomaly scores.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="px-2 py-0.5 bg-[#0F172A] border border-[#1E293B] rounded-xs text-cyan-300">
                TOTAL: 305 ALERTS
              </span>
              <span className="px-2 py-0.5 bg-[#0F172A] border border-[#1E293B] rounded-xs text-emerald-300">
                196 AUTO-CLEARED
              </span>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-64 font-mono text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCleared" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="2 2" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderColor: '#1E293B', 
                    borderRadius: '2px', 
                    fontSize: '11px',
                    color: '#F8FAFC'
                  }}
                  itemStyle={{ padding: '2px 0' }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="rect"
                  formatter={(val) => <span className="text-[11px] font-mono text-slate-300">{val}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="totalAlerts" 
                  name="Total Rule Alerts" 
                  stroke="#06b6d4" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="falsePositivesCleared" 
                  name="AI Safely Cleared" 
                  stroke="#10b981" 
                  strokeWidth={1.5}
                  fillOpacity={1} 
                  fill="url(#colorCleared)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="mlAnomalies" 
                  name="ML Confirmed Anomalies" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAnomalies)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (4 cols): Live Alert Triage Stream */}
        <div className="lg:col-span-4 bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  REAL-TIME_ALERT_STREAM
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">LIVE FEED</span>
            </div>

            <div className="divide-y divide-[#1E293B] mt-2 space-y-2">
              {alerts.slice(0, 4).map((alert) => (
                <div 
                  key={alert.id}
                  onClick={() => selectAlert(alert.id)}
                  className="pt-2 pb-1 cursor-pointer group hover:bg-[#0F172A]/60 px-2 rounded-xs transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-white group-hover:text-cyan-400 transition">
                      {alert.customer.name}
                    </span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                      alert.ai_recommendation?.disposition === 'ESCALATE'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {alert.ai_recommendation?.disposition || 'PENDING'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-slate-400">
                    <span>{alert.alert_type.replace('_', ' ')}</span>
                    <span className="text-slate-300 font-semibold">
                      {alert.transaction.currency} {alert.transaction.amount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-slate-500">
                    <span>Score: {alert.risk_score}/100</span>
                    <span className="text-cyan-400/80 group-hover:translate-x-0.5 transition-transform flex items-center">
                      Investigate <ChevronRight className="w-2.5 h-2.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">100% Deterministic Trail</span>
            <button
              onClick={() => setActiveNav('inbox')}
              className="text-cyan-400 hover:text-cyan-300 transition"
            >
              FULL_INBOX_VIEW →
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Regulatory Safeguards Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#0F172A] border border-[#1E293B] p-3 rounded-xs flex items-start gap-2.5">
          <Brain className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase block">
              Tier 1 Regulatory Scope
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Recommendation-only mode. Every adverse decision requires explicit compliance analyst approval before enforcement.
            </p>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] p-3 rounded-xs flex items-start gap-2.5">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase block">
              Hermes Controlled Learning
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Hermes detects recurring patterns but cannot alter production thresholds without MLRO audit and governance signoff.
            </p>
          </div>
        </div>

        <div className="bg-[#0F172A] border border-[#1E293B] p-3 rounded-xs flex items-start gap-2.5">
          <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase block">
              Immutable Audit Trail
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Every inference, feature fetch, and analyst click is cryptographically hashed with SHA-256 for OCC and FinCEN examination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
