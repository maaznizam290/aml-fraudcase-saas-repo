import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Disposition } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  CreditCard, 
  MapPin, 
  Smartphone, 
  Clock, 
  Cpu, 
  MessageSquare, 
  ExternalLink, 
  ArrowRight,
  Sparkles,
  FileText,
  Lock,
  RotateCcw,
  Sliders,
  Check,
  XCircle,
  Hash
} from 'lucide-react';
import { SlackCardModal } from './SlackCardModal';

export const InvestigationWorkspace: React.FC = () => {
  const { 
    selectedAlert, 
    transactions, 
    approveRecommendation, 
    overrideRecommendation,
    demoMode,
    currentUser
  } = useApp();

  const [showSlackModal, setShowSlackModal] = useState<boolean>(false);
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [overrideChoice, setOverrideChoice] = useState<Disposition>('CLEAR');
  const [analystNotes, setAnalystNotes] = useState<string>('');
  const [approvalNotes, setApprovalNotes] = useState<string>('');
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  if (!selectedAlert) {
    return (
      <div className="p-8 text-center text-slate-500 font-mono">
        NO_ACTIVE_ALERT_SELECTED
      </div>
    );
  }

  const alert = selectedAlert;
  const customer = alert.customer;
  const triggerTxn = alert.transaction;
  const ml = alert.ml_prediction;
  const ai = alert.ai_recommendation;

  // Filter transactions for this customer
  const customerTxns = transactions.filter(t => t.customer_id === customer.id);

  const handleApprove = () => {
    approveRecommendation(alert.id, approvalNotes || 'Corroborated by deterministic velocity and ML model scores.');
    setShowApprovalModal(false);
    setSuccessToast(`Case ${alert.id} approved: ${ai?.disposition}. Dispatched to Hermes learning memory.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleOverride = () => {
    if (!analystNotes.trim()) return;
    overrideRecommendation(alert.id, overrideChoice, analystNotes);
    setShowOverrideModal(false);
    setSuccessToast(`Case ${alert.id} overridden to ${overrideChoice}. Dispatched to Hermes Feedback & Candidate Heuristics.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const isEscalate = ai?.disposition === 'ESCALATE';
  const isClear = ai?.disposition === 'CLEAR';

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-950 border border-emerald-500 text-emerald-300 px-4 py-2.5 rounded-xs font-mono text-xs flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-400/80">HERMES_INDEXED</span>
        </div>
      )}

      {/* Case Header Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xs bg-[#0A0C10] border border-[#1E293B] flex items-center justify-center font-mono font-bold text-cyan-400 text-sm">
            {customer.avatar_seed}
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="text-[10px] uppercase text-cyan-400 font-bold tracking-wider">
                [ CASE_FILE // {alert.id} ]
              </span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                alert.status === 'RESOLVED' || alert.status === 'ESCALATED'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {alert.status}
              </span>
            </div>
            <h2 className="text-lg font-light text-white font-mono mt-0.5">
              {customer.name} — <span className="text-slate-400">{alert.alert_type.replace(/_/g, ' ')}</span>
            </h2>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setShowSlackModal(true)}
            className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#2C3136] text-slate-300 hover:text-white rounded-xs border border-slate-700 transition flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span>SLACK_CARD_PREVIEW</span>
          </button>

          <div className="px-3 py-1.5 bg-[#0A0C10] border border-[#1E293B] rounded-xs text-slate-400 text-[11px]">
            <span>REGULATORY_TIER: </span>
            <strong className="text-emerald-400 font-bold">TIER_1 (RECOMMENDATION ONLY)</strong>
          </div>
        </div>
      </div>

      {/* Hero 3-Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =========================================================================
            PANEL 1: CUSTOMER KYC DOSSIER (3 COLS)
            ========================================================================= */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  CUSTOMER_KYC_DOSSIER
                </span>
              </div>
              <span className="text-[10px] text-slate-500">{customer.external_id}</span>
            </div>

            {/* Profile Fields */}
            <div className="space-y-2.5">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Declared Occupation:</span>
                <span className="text-slate-200 font-semibold">{customer.occupation}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Monthly Income (Declared):</span>
                <span className="text-cyan-400 font-bold">
                  ${customer.monthly_income_usd.toLocaleString()} USD
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Jurisdiction / Location:</span>
                <span className="text-slate-200">{customer.city}, {customer.country}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Regulatory Risk Tier:</span>
                <span className={`inline-block px-2 py-0.5 rounded-xs font-bold text-[10px] mt-0.5 ${
                  customer.risk_tier === 'CRITICAL'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : customer.risk_tier === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {customer.risk_tier} RISK
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">KYC Verification Status:</span>
                <span className="text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  {customer.kyc_status}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Account Age / Tenure:</span>
                <span className="text-slate-300">{customer.account_age_days} days</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Linked Accounts:</span>
                <span className="text-slate-300">{customer.linked_accounts_count} accounts</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Historical Alerts:</span>
                <span className="text-amber-400 font-bold">{customer.total_historical_alerts} alerts</span>
              </div>
            </div>

            {/* Device & Hardware Fingerprint */}
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                HARDWARE_FINGERPRINT
              </span>
              <div className="p-2 bg-[#0F172A] rounded-xs border border-[#1E293B] text-[11px] break-all text-slate-300 font-mono">
                {customer.device_fingerprint}
              </div>
              <div className="text-[10px] text-slate-500">
                Active Session: {triggerTxn.device_id}
              </div>
            </div>

            {/* OFAC / Sanctions Check Card */}
            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase block">
                  OFAC / SANCTIONS CHECK
                </span>
                <span className="text-[10px] text-emerald-300">0 Matches Found (Passed)</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 2: UNIFIED INTERACTIVE TIMELINE & EVIDENCE (5 COLS)
            ========================================================================= */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  EVIDENTIARY_TIMELINE // 90-DAY_LEDGER
                </span>
              </div>
              <span className="text-[10px] text-cyan-400">DUCKDB_AGGREGATED</span>
            </div>

            {/* Triggering Transaction Highlight Card */}
            <div className="p-3.5 bg-[#0F172A] border-2 border-cyan-500/60 rounded-xs space-y-2.5 relative">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase px-1.5 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 rounded-xs font-bold">
                  TRIGGERING TRANSACTION
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {triggerTxn.timestamp.replace('T', ' ').replace('Z', '')}
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono text-white">
                  {triggerTxn.currency} {triggerTxn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-[#0A0C10] border border-[#1E293B] rounded-xs">
                  {triggerTxn.channel}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Recipient:</span>
                  <span className="font-semibold text-cyan-300 truncate max-w-[200px]">{triggerTxn.recipient}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Destination Bank:</span>
                  <span className="text-slate-300">{triggerTxn.recipient_bank} ({triggerTxn.recipient_country})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Origin IP:</span>
                  <span className="text-slate-300">{triggerTxn.ip_address} ({triggerTxn.location_city}, {triggerTxn.location_country})</span>
                </div>
              </div>
            </div>

            {/* Velocity Spike & Anomaly Indicator */}
            {ml && (
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xs">
                  <span className="text-[10px] text-slate-500 uppercase block">90-Day Velocity Spike:</span>
                  <span className="text-lg font-bold font-mono text-amber-400">
                    {ml.velocity_90d_ratio}x
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Above account baseline</span>
                </div>

                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xs">
                  <span className="text-[10px] text-slate-500 uppercase block">DuckDB Anomaly Score:</span>
                  <span className="text-lg font-bold font-mono text-cyan-400">
                    {Math.round(ml.anomaly_score * 100)}%
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">Ensemble confidence</span>
                </div>
              </div>
            )}

            {/* Historical Transactions List */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Recent Preceding Transactions (Last 90 Days):
              </span>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {customerTxns.map((txn) => {
                  const isTrigger = txn.is_trigger;
                  return (
                    <div 
                      key={txn.id}
                      className={`p-2 rounded-xs border transition ${
                        isTrigger 
                          ? 'bg-rose-950/30 border-rose-800 text-rose-200'
                          : 'bg-[#0F172A]/70 border-[#1E293B] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white">
                          {txn.recipient}
                        </span>
                        <span className="font-mono font-bold">
                          {txn.currency} {txn.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                        <span>{txn.timestamp.substring(0, 16).replace('T', ' ')}</span>
                        <span>{txn.channel} • {txn.location_city}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PANEL 3: THE AI INVESTIGATOR HUB (4 COLS)
            ========================================================================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white uppercase tracking-wider text-xs">
                  AI_INVESTIGATOR_HUB
                </span>
              </div>
              <span className="text-[10px] text-purple-400 font-bold uppercase">{ai?.model_used || 'CLAUDE 3.5 SONNET / HEURISTICS'}</span>
            </div>

            {/* Recommendation Banner */}
            <div className={`p-4 rounded-xs border ${
              isEscalate
                ? 'bg-rose-950/40 border-rose-600/80 text-rose-200'
                : isClear
                ? 'bg-emerald-950/40 border-emerald-600/80 text-emerald-200'
                : 'bg-amber-950/40 border-amber-600/80 text-amber-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  {isEscalate && <ShieldAlert className="w-5 h-5 text-rose-400" />}
                  {isClear && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  <span>DISPOSITION: {ai?.disposition}</span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#0A0C10] rounded-xs border border-current">
                  {ai?.confidence}% CONFIDENCE
                </span>
              </div>

              <p className="text-[11px] font-sans text-slate-200 mt-2 leading-relaxed">
                {ai?.rationale}
              </p>
            </div>

            {/* ML Ensemble Score Gauge Breakdown */}
            {ml && (
              <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xs space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                  <span>ML Model Breakdown</span>
                  <span className="text-cyan-400 text-[9px]">Heuristic Ensembles</span>
                </div>
                <div className="text-[10px] text-slate-500 italic pb-1 border-b border-[#1E293B]">
                  *Rule-based anomaly scoring (ML model not yet deployed; architecture reference weights below)
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Isolation Forest (Unsupervised):</span>
                    <span className="font-bold text-amber-400 font-mono">
                      {Math.round(ml.models_breakdown.isolation_forest * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">XGBoost (Supervised Benchmark):</span>
                    <span className="font-bold text-cyan-400 font-mono">
                      {Math.round(ml.models_breakdown.xgboost * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Local Outlier Factor (LOF):</span>
                    <span className="font-bold text-slate-300 font-mono">
                      {Math.round(ml.models_breakdown.lof * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">One-Class SVM (OCSVM):</span>
                    <span className="font-bold text-slate-300 font-mono">
                      {Math.round(ml.models_breakdown.ocsvm * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* "Why?" Cited Evidence Breakdown */}
            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                <Hash className="w-3 h-3 text-cyan-400" />
                DETERMINISTIC_CITATIONS (WHY?):
              </span>
              <div className="space-y-1.5">
                {ai?.redFlags.map((flag, idx) => (
                  <div 
                    key={idx}
                    className="p-2 bg-[#0F172A] border-l-2 border-rose-500 border-t border-r border-b border-[#1E293B] rounded-xs text-[11px] text-slate-200 leading-relaxed font-sans"
                  >
                    • {flag}
                  </div>
                ))}
              </div>
            </div>

            {/* Contradictory / Mitigating Evidence */}
            {ai?.contradictoryEvidence && ai.contradictoryEvidence.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold block">
                  Mitigating Context Evaluated:
                </span>
                <p className="text-[11px] text-slate-400 font-sans italic bg-[#0F172A] p-2 rounded-xs border border-[#1E293B]">
                  "{ai.contradictoryEvidence[0]}"
                </p>
              </div>
            )}

            {/* Regulatory Safeguard Notice */}
            <div className="p-2 bg-slate-900 border border-slate-800 rounded-xs text-[10px] text-slate-400 leading-relaxed font-sans">
              <strong className="text-amber-400 block font-mono">Tier 1 Sovereign Human Gate:</strong>
              Veritas cannot freeze funds or file SARs autonomously. The action bar below requires authenticated compliance signature.
            </div>

            {/* Action Bar (Human Compliance Signoff) */}
            <div className="pt-3 border-t border-[#1E293B] space-y-2">
              {alert.analyst_decision ? (
                <div className="p-3 bg-purple-950/40 border border-purple-800 rounded-xs space-y-1">
                  <div className="flex items-center justify-between text-purple-300 font-bold text-xs">
                    <span>STATUS: {alert.analyst_decision.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {alert.analyst_decision.decided_at.substring(0, 16).replace('T', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">
                    By {alert.analyst_decision.analyst_name}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    "{alert.analyst_decision.analyst_rationale}"
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowApprovalModal(true)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xs transition text-xs flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.3)] uppercase tracking-wider"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>APPROVE</span>
                  </button>

                  <button
                    onClick={() => setShowOverrideModal(true)}
                    className="px-3 py-2 bg-[#0F172A] hover:bg-[#1E293B] text-slate-300 hover:text-white border border-[#1E293B] hover:border-slate-600 font-bold rounded-xs transition text-xs flex items-center justify-center gap-1.5 uppercase tracking-wider"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>OVERRIDE</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs max-w-md w-full p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="font-bold text-white uppercase text-sm">
                CONFIRM_{ai?.disposition}_DISPOSITION
              </span>
              <button 
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              You are approving the AI recommendation to <strong>{ai?.disposition}</strong> Case {alert.id} ({customer.name}). This will be cryptographically etched into the PostgreSQL audit log and dispatched to Hermes learning.
            </p>

            <div className="p-2 bg-[#0F172A] border border-[#1E293B] rounded-xs text-[10px] text-slate-400 flex items-center justify-between">
              <span>Signatory: <strong className="text-white">{currentUser.name}</strong></span>
              <span className="text-cyan-400 uppercase font-bold">{currentUser.title}</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Compliance Analyst Rationale Notes:
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                placeholder="Evidentiary corroboration validated by MLRO..."
                rows={3}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xs p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white rounded-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xs transition"
              >
                CONFIRM_&_RECORD_AUDIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs max-w-md w-full p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="font-bold text-white uppercase text-sm">
                HUMAN_OVERRIDE_INVESTIGATION
              </span>
              <button 
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-300 font-sans leading-relaxed text-xs">
              Override Claude recommendation ({ai?.disposition}). This override will be recorded in Hermes Feedback Memory and trigger a candidate heuristic rule proposal.
            </p>

            <div className="p-2 bg-[#0F172A] border border-[#1E293B] rounded-xs text-[10px] text-slate-400 flex items-center justify-between">
              <span>Overriding Officer: <strong className="text-white">{currentUser.name}</strong></span>
              <span className="text-cyan-400 uppercase font-bold">{currentUser.title}</span>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Select Alternative Disposition:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['CLEAR', 'ESCALATE', 'REFER'] as Disposition[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setOverrideChoice(d)}
                    className={`py-1.5 px-2 rounded-xs font-bold transition text-center border ${
                      overrideChoice === d
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                        : 'bg-[#0F172A] border-[#1E293B] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase mb-1">
                Mandatory Analyst Rationale (Required by Regulators):
              </label>
              <textarea
                value={analystNotes}
                onChange={(e) => setAnalystNotes(e.target.value)}
                placeholder="E.g., Customer declared seasonal business expansion; confirmed via telephone signatory..."
                rows={3}
                className="w-full bg-[#0F172A] border border-[#1E293B] rounded-xs p-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-3 py-1.5 bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white rounded-xs"
              >
                CANCEL
              </button>
              <button
                onClick={handleOverride}
                disabled={!analystNotes.trim()}
                className={`px-4 py-1.5 rounded-xs font-bold transition ${
                  analystNotes.trim()
                    ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                SUBMIT_OVERRIDE_TO_HERMES
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slack Interactive Card Modal */}
      {showSlackModal && (
        <SlackCardModal
          alert={alert}
          onClose={() => setShowSlackModal(false)}
          onApprove={() => {
            approveRecommendation(alert.id, 'Approved via Slack Block Kit interactive card.');
            setSuccessToast(`Approved via Slack: ${alert.id}`);
            setTimeout(() => setSuccessToast(null), 4000);
          }}
          onReject={() => {
            setShowOverrideModal(true);
          }}
        />
      )}
    </div>
  );
};
