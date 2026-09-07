import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AlertType, RiskTier, Disposition } from '../types';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldAlert, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export const AlertInbox: React.FC = () => {
  const { alerts, selectAlert } = useApp();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('ALL');
  const [selectedDisposition, setSelectedDisposition] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Search match
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = alert.customer.name.toLowerCase().includes(q);
        const matchId = alert.id.toLowerCase().includes(q);
        const matchRecipient = alert.transaction.recipient.toLowerCase().includes(q);
        const matchExtId = alert.customer.external_id.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchRecipient && !matchExtId) return false;
      }

      // Risk tier match
      if (selectedRiskTier !== 'ALL' && alert.customer.risk_tier !== selectedRiskTier) {
        return false;
      }

      // Disposition match
      if (selectedDisposition !== 'ALL') {
        if (alert.ai_recommendation?.disposition !== selectedDisposition) return false;
      }

      // Alert Type match
      if (selectedType !== 'ALL' && alert.alert_type !== selectedType) {
        return false;
      }

      return true;
    });
  }, [alerts, searchTerm, selectedRiskTier, selectedDisposition, selectedType]);

  return (
    <div className="space-y-4">
      {/* Top Controls Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              [ AML_ALERT_INBOX // DENSITY_OPTIMIZED_TRIAGE ]
            </span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 font-mono tracking-tight">
            Case Management & Active Investigation Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time compliance triage queue. Filter by ML anomaly probability, regulatory risk tier, or counterparty velocity.
          </p>
        </div>

        {/* Count Badge */}
        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <span className="px-3 py-1.5 bg-[#0A0C10] border border-[#1E293B] rounded-xs text-slate-300">
            SHOWING <strong className="text-cyan-400">{filteredAlerts.length}</strong> / {alerts.length} ALERTS
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer, case ID, counterparty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xs text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Tier Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase">RISK:</span>
            <select
              value={selectedRiskTier}
              onChange={(e) => setSelectedRiskTier(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] text-slate-300 text-xs rounded-xs px-2 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL TIERS</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Disposition Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase">DISPOSITION:</span>
            <select
              value={selectedDisposition}
              onChange={(e) => setSelectedDisposition(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] text-slate-300 text-xs rounded-xs px-2 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL RECOMMENDATIONS</option>
              <option value="ESCALATE">ESCALATE</option>
              <option value="CLEAR">CLEAR</option>
              <option value="REFER">REFER</option>
            </select>
          </div>

          {/* Alert Type Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 uppercase">TYPOLOGY:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-[#0F172A] border border-[#1E293B] text-slate-300 text-xs rounded-xs px-2 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">ALL TYPOLOGIES</option>
              <option value="RAPID_VELOCITY">RAPID VELOCITY</option>
              <option value="HIGH_VALUE_WIRE">HIGH VALUE WIRE</option>
              <option value="GEOLOCATION_JUMP">GEOLOCATION JUMP</option>
              <option value="STRUCTURING_SMURFING">STRUCTURING / CTR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">ALERT_ID // TIMESTAMP</th>
                <th className="px-4 py-3">CUSTOMER // KYC DOSSIER</th>
                <th className="px-4 py-3">TRANSACTION_TRIGGER</th>
                <th className="px-4 py-3">TYPOLOGY // TRIGGERED_RULE</th>
                <th className="px-4 py-3 text-center">ML_ANOMALY</th>
                <th className="px-4 py-3 text-center">AI_RECOMMENDATION</th>
                <th className="px-4 py-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {filteredAlerts.map((alert) => {
                const isEscalate = alert.ai_recommendation?.disposition === 'ESCALATE';
                const isClear = alert.ai_recommendation?.disposition === 'CLEAR';

                return (
                  <tr 
                    key={alert.id}
                    onClick={() => selectAlert(alert.id)}
                    className="hover:bg-[#0F172A]/70 transition cursor-pointer group"
                  >
                    {/* ID & Time */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white group-hover:text-cyan-400 transition">
                        {alert.id}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {alert.created_at.replace('T', ' ').replace('Z', '')}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-white">
                        {alert.customer.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-slate-400">{alert.customer.country}</span>
                        <span className="text-slate-600">|</span>
                        <span className={`text-[9px] px-1 py-0.2 rounded-xs font-bold ${
                          alert.customer.risk_tier === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : alert.customer.risk_tier === 'HIGH'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {alert.customer.risk_tier}
                        </span>
                      </div>
                    </td>

                    {/* Transaction Trigger */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-200">
                        {alert.transaction.currency} {alert.transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[180px] mt-0.5">
                        → {alert.transaction.recipient}
                      </div>
                    </td>

                    {/* Typology */}
                    <td className="px-4 py-3.5">
                      <div className="text-cyan-300 font-semibold text-[11px]">
                        {alert.alert_type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[220px] mt-0.5">
                        {alert.triggered_rule}
                      </div>
                    </td>

                    {/* ML Score */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="text-xs font-bold text-amber-400">
                          {Math.round((alert.ml_prediction?.anomaly_score || 0) * 100)}%
                        </span>
                        <span className="text-[9px] text-slate-500">
                          P(fraud): {alert.ml_prediction?.fraud_probability}
                        </span>
                      </div>
                    </td>

                    {/* AI Recommendation */}
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xs text-[10px] font-bold ${
                        isEscalate
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-700/80'
                          : isClear
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                      }`}>
                        {isEscalate && <ShieldAlert className="w-3 h-3 text-rose-400" />}
                        {isClear && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        <span>{alert.ai_recommendation?.disposition || 'PENDING'}</span>
                        <span className="text-[9px] opacity-75">({alert.ai_recommendation?.confidence}%)</span>
                      </span>
                    </td>

                    {/* Action Button */}
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectAlert(alert.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0F172A] hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 border border-[#1E293B] hover:border-cyan-400 rounded-xs transition text-[10px] font-bold"
                      >
                        <span>INVESTIGATE</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
