import React from 'react';
import { Alert } from '../types';
import { X, ShieldAlert, CheckCircle2, MessageSquare, ExternalLink, Bot } from 'lucide-react';

interface SlackCardModalProps {
  alert: Alert;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export const SlackCardModal: React.FC<SlackCardModalProps> = ({
  alert,
  onClose,
  onApprove,
  onReject
}) => {
  const isEscalate = alert.ai_recommendation?.disposition === 'ESCALATE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
      <div className="bg-[#1A1D21] border border-[#2C3136] rounded-xs max-w-xl w-full text-white shadow-2xl overflow-hidden font-sans">
        {/* Slack Window Top Header */}
        <div className="bg-[#222529] px-4 py-3 border-b border-[#2C3136] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-xs bg-[#E01E5A] flex items-center justify-center font-bold text-xs text-white">
              #
            </div>
            <span className="font-bold text-sm text-slate-200">
              #compliance-alerts-p1
            </span>
            <span className="text-xs text-slate-500 font-mono">
              [SLACK_BLOCK_KIT_PREVIEW]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slack Card Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Bot Avatar & Name */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded bg-cyan-600 flex items-center justify-center shrink-0 text-slate-950 font-bold font-mono text-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Veritas Compliance Bot</span>
                <span className="bg-[#2C3136] text-[10px] text-slate-400 px-1 py-0.5 rounded font-mono uppercase">
                  APP
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Just now</span>
              </div>

              {/* Slack Card Block */}
              <div className="border-l-4 border-rose-500 bg-[#222529] p-4 rounded-r space-y-3 font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    P1 CRITICAL ALERT: {alert.alert_type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded font-bold">
                    RECOMMENDATION: {alert.ai_recommendation?.disposition} ({alert.ai_recommendation?.confidence}%)
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
                  {alert.ai_recommendation?.rationale}
                </p>

                {/* Grid Fields */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#1A1D21] p-2.5 rounded border border-[#2C3136]">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Customer:</span>
                    <strong className="text-white">{alert.customer.name}</strong> ({alert.customer.country})
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Transaction Amount:</span>
                    <strong className="text-amber-400 font-mono">
                      {alert.transaction.currency} {alert.transaction.amount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">ML Fraud Probability:</span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {Math.round((alert.ml_prediction?.fraud_probability || 0) * 100)}%
                    </span> (DuckDB XGBoost)
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Regulatory Boundary:</span>
                    <span className="text-emerald-400 font-mono">Tier 1 Human Review Required</span>
                  </div>
                </div>

                {/* Key Red Flags */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    Primary Cited Red Flags:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-300 text-[11px]">
                    {alert.ai_recommendation?.redFlags.slice(0, 3).map((rf, idx) => (
                      <li key={idx}>{rf}</li>
                    ))}
                  </ul>
                </div>

                {/* Interactive Slack Block Kit Action Buttons */}
                <div className="pt-3 border-t border-[#2C3136] flex items-center gap-2">
                  <button
                    onClick={() => {
                      onApprove();
                      onClose();
                    }}
                    className="px-3.5 py-1.5 bg-[#007A5A] hover:bg-[#148567] text-white font-bold rounded text-xs transition flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve {alert.ai_recommendation?.disposition}</span>
                  </button>

                  <button
                    onClick={() => {
                      onReject();
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#2C3136] hover:bg-[#383F45] text-slate-300 hover:text-white font-semibold rounded text-xs transition"
                  >
                    <span>Override / Escalate L2</span>
                  </button>

                  <span className="text-[10px] text-slate-500 font-mono ml-auto">
                    Action dispatches to Hermes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
