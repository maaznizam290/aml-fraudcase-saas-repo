import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Hash, Database } from 'lucide-react';

interface AuditLogModalProps {
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ onClose }) => {
  const { auditLogs } = useApp();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs max-w-4xl w-full text-white shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0F172A] px-5 py-3.5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              [ IMMUTABLE_AUDIT_LOGS // SUPABASE_POSTGRESQL ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-3 bg-[#080A0E] border-b border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
          <span>
            Cryptographic SHA-256 evidence hashes for regulatory OCC / FinCEN examination.
          </span>
          <span className="text-emerald-400 font-bold">
            POSTGRESQL RLS ENFORCED
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-4 space-y-2">
          {auditLogs.map((log) => (
            <div 
              key={log.id}
              className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xs space-y-1.5 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400">{log.id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#0A0C10] text-emerald-300 rounded-xs border border-emerald-900 font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-400">by {log.actor}</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  {log.timestamp.replace('T', ' ').substring(0, 19)}
                </div>
              </div>

              <p className="text-slate-300 font-sans text-xs">
                {log.details}
              </p>

              <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1 border-t border-[#1E293B]/60">
                <Hash className="w-3 h-3 text-cyan-500" />
                <span className="font-mono text-cyan-400/80">{log.evidence_hash}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#0F172A] px-5 py-3 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Total Entries: {auditLogs.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0A0C10] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] rounded-xs"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
