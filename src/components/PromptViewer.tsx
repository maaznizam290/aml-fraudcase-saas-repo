import React, { useState } from 'react';
import { Copy, Check, Download, Search, Settings2, ShieldAlert } from 'lucide-react';
import { PromptConfig } from '../types';
import { generateClaudeCodePrompt } from '../data/masterPrompt';

interface PromptViewerProps {
  onCopyPrompt: () => void;
  copied: boolean;
  config: PromptConfig;
  setConfig: React.Dispatch<React.SetStateAction<PromptConfig>>;
}

export const PromptViewer: React.FC<PromptViewerProps> = ({
  onCopyPrompt,
  copied,
  config,
  setConfig
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const promptText = generateClaudeCodePrompt(config);

  const wordCount = promptText.split(/\s+/).length;
  const approxTokens = Math.round(wordCount * 1.35);

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CLAUDE_CODE_AML_FRAUD_MVP_PROMPT.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Geometric Balance Top Section: Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 p-1 bg-[#1E293B] rounded-sm">
        {/* Left Col: Executive Directive */}
        <div className="lg:col-span-8 bg-[#0A0C10] p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45"></div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 font-bold">
                [ INVESTOR_DIRECTIVE // MASTER_PROMPT ]
              </span>
            </div>
            <h1 className="text-2xl font-light text-white tracking-tight">
              Production-Grade Claude Code Blueprint
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Consolidated from your <strong className="text-slate-200">FinTech Regulatory Research Brief</strong>, the <strong className="text-slate-200">16-node n8n workflow</strong>, the <strong className="text-slate-200">GitHub Claude-Fraud-Detection ML pipeline</strong>, and <strong className="text-slate-200">Nous Research Hermes Self-Learning Agent</strong>. Feed directly to Claude Code to build your investor demo.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6 pt-4 border-t border-[#1E293B] text-[11px] font-mono">
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              <span className="text-slate-300">Tier 1 Human Sign-Off</span>
            </div>
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-slate-300">n8n 16-Node Pipeline</span>
            </div>
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
              <span className="text-slate-300">DuckDB + IsoForest</span>
            </div>
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></span>
              <span className="text-slate-300">Hermes Memory Loop</span>
            </div>
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              <span className="text-slate-300">Supabase RLS Migrations</span>
            </div>
            <div className="p-2 border border-[#1E293B] bg-[#0F172A]/50 rounded-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
              <span className="text-slate-300">14-Step Pitch Script</span>
            </div>
          </div>
        </div>

        {/* Right Col: Active Tech Stack & Metric Box */}
        <div className="lg:col-span-4 bg-[#0A0C10] p-6 flex flex-col justify-between gap-4">
          <div className="p-4 bg-cyan-950/20 border border-cyan-900/50 rounded-xs">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rotate-45"></span>
              Active Tech Stack
            </h3>
            <ul className="text-[11px] font-mono space-y-1.5 text-cyan-200/80">
              <li>&gt; Next.js 14 + Tailwind CSS</li>
              <li>&gt; n8n Webhook Workflow Engine</li>
              <li>&gt; Anthropic Claude Sonnet</li>
              <li>&gt; Supabase PostgreSQL + RLS</li>
              <li>&gt; DuckDB + Isolation Forest ML</li>
              <li>&gt; Nous Research Hermes Agent</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 h-9 bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-[#1E293B] text-xs font-mono font-semibold flex items-center justify-center gap-1.5 rounded-xs transition"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>EXPORT .MD</span>
            </button>
            <button
              onClick={onCopyPrompt}
              className={`flex-1 h-9 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 rounded-xs transition shadow-sm ${
                copied
                  ? 'bg-emerald-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY PROMPT</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Customization & Search */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search prompt (e.g. 'Hermes', 'Isolation Forest', 'n8n', 'disposition')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0A0C10] border border-[#1E293B] rounded-xs pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Model & Config Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-500 uppercase text-[10px]">Model:</span>
            <select
              value={config.targetModel}
              onChange={(e) =>
                setConfig({ ...config, targetModel: e.target.value as any })
              }
              className="bg-[#0A0C10] border border-[#1E293B] rounded-xs px-2 py-1 text-xs text-cyan-400 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="claude-3-7-sonnet">Claude 3.7 Sonnet</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div className="flex items-center gap-4 border-l border-[#1E293B] pl-4 text-xs font-mono">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.includeHermes}
                onChange={(e) =>
                  setConfig({ ...config, includeHermes: e.target.checked })
                }
                className="rounded-xs border-[#1E293B] text-cyan-500 focus:ring-0 bg-[#0A0C10]"
              />
              <span>Hermes</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.includeDuckDbMl}
                onChange={(e) =>
                  setConfig({ ...config, includeDuckDbMl: e.target.checked })
                }
                className="rounded-xs border-[#1E293B] text-cyan-500 focus:ring-0 bg-[#0A0C10]"
              />
              <span>DuckDB</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
              <input
                type="checkbox"
                checked={config.includeDemoMode}
                onChange={(e) =>
                  setConfig({ ...config, includeDemoMode: e.target.checked })
                }
                className="rounded-xs border-[#1E293B] text-cyan-500 focus:ring-0 bg-[#0A0C10]"
              />
              <span>Demo Mode</span>
            </label>
          </div>

          <div className="text-xs text-cyan-400 font-mono bg-[#0A0C10] px-2.5 py-1 rounded-xs border border-[#1E293B]">
            ~{approxTokens.toLocaleString()} TOKENS
          </div>
        </div>
      </div>

      {/* Main Prompt Code Block with Geometric Terminal Style */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#0F172A] px-4 py-2 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45"></div>
            <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wider">
              [ MASTER_PROMPT_FILE: CLAUDE_CODE_AML_FRAUD_MVP.md ]
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 text-[11px]">
              <ShieldAlert className="w-3 h-3" />
              <span>TIER_1_GUARDRAILS_ACTIVE</span>
            </span>
            <button
              onClick={onCopyPrompt}
              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 font-mono text-xs text-slate-300 overflow-x-auto max-h-[640px] overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-cyan-950 selection:text-cyan-200">
          {promptText}
        </div>
      </div>
    </div>
  );
};
