import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Hash, Database, CheckCircle2, AlertTriangle, RefreshCw, Link2 } from 'lucide-react';

interface AuditLogModalProps {
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ onClose }) => {
  const { auditLogs, auditChainVerification, refreshAuditLogs } = useApp();
  const [isVerifying, setIsVerifying] = useState(false);

  const handleReverify = async () => {
    setIsVerifying(true);
    await refreshAuditLogs();
    setTimeout(() => setIsVerifying(false), 400);
  };

  const isChainValid = auditChainVerification?.isValid !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4">
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs max-w-4xl w-full text-white shadow-2xl overflow-hidden font-mono text-xs flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-[#0F172A] px-5 py-3.5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              [ IMMUTABLE_AUDIT_LOGS // CRYPTOGRAPHIC_SHA-256_LEDGER ]
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-3.5 border-b border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] ${
          isChainValid ? 'bg-emerald-950/30' : 'bg-rose-950/30'
        }`}>
          <div className="flex items-center gap-2">
            {isChainValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <div>
              <div className="font-bold text-slate-200">
                {isChainValid ? 'CRYPTOGRAPHIC CHAIN VERIFIED' : 'TAMPER DETECTED IN CHAIN'}
              </div>
              <div className="text-slate-400 text-[10px]">
                {auditChainVerification?.message || `Evaluated ${auditLogs.length} chained blocks from genesis hash.`}
              </div>
            </div>
          </div>
          <button
            onClick={handleReverify}
            disabled={isVerifying}
            className="px-3 py-1 bg-[#0A0C10] hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 rounded-xs flex items-center gap-1.5 transition self-start sm:self-auto"
          >
            <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'VERIFYING...' : 'RE-VERIFY LEDGER'}</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-y-auto p-4 space-y-2.5">
          {auditLogs.map((log) => (
            <div 
              key={log.id}
              className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xs space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-xs text-[10px] font-bold">
                    #{log.sequence_number || 1}
                  </span>
                  <span className="font-bold text-white">{log.id}</span>
                  <span className="text-slate-600">|</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#0A0C10] text-emerald-300 rounded-xs border border-emerald-900 font-bold">
                    {log.action}
                  </span>
                  <span className="text-slate-400">by {log.actor}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {log.timestamp.replace('T', ' ').substring(0, 19)}
                </div>
              </div>

              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                {log.details}
              </p>

              {/* Cryptographic Hash Chaining Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] pt-1.5 border-t border-[#1E293B]/80 font-mono">
                <div className="flex items-center gap-1 text-slate-400 truncate">
                  <Link2 className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="text-slate-500">PREV:</span>
                  <span className="truncate text-slate-400">{log.previous_hash || '0000000000000000000000000000000000000000...'}</span>
                </div>
                <div className="flex items-center gap-1 text-cyan-400 truncate">
                  <Hash className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span className="text-slate-500">HASH:</span>
                  <span className="truncate font-bold text-cyan-300">{log.evidence_hash}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-[#0F172A] px-5 py-3 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            Total Blocks: <strong className="text-white">{auditLogs.length}</strong> | Append-Only Statutory Ledger
          </span>
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
