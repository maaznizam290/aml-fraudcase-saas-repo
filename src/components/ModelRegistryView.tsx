import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ModelRegistryItem } from '../types';
import { 
  Cpu, 
  Database, 
  ExternalLink, 
  BarChart2, 
  CheckCircle2, 
  Sliders, 
  Activity,
  Layers,
  Code
} from 'lucide-react';

export const ModelRegistryView: React.FC = () => {
  const { modelRegistry } = useApp();
  const [selectedModelId, setSelectedModelId] = useState<string>('mod_iso_forest');

  const selectedModel = modelRegistry.find(m => m.id === selectedModelId) || modelRegistry[0];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 font-bold">
              [ ML_BENCHMARK_REGISTRY // PYTHON_DUCKDB_ENGINE ]
            </span>
          </div>
          <h2 className="text-xl font-light text-white mt-1 tracking-tight">
            Algorithmic Benchmark & Latent Space Explorer
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed font-sans">
            Reference implementation grounded in the <code className="text-cyan-300 font-mono">Claude-Fraud-Detection</code> benchmark suite. Comparing unsupervised isolation estimators against gradient boosted supervision on European cardholder dataset (284,807 transactions).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://github.com/abhinayasridharrajaram/Claude-Fraud-Detection"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-[#0A0C10] border border-[#1E293B] hover:border-cyan-400 text-cyan-300 rounded-xs transition flex items-center gap-1.5"
          >
            <Code className="w-3.5 h-3.5" />
            <span>GITHUB_SOURCE_REPO</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* Model Benchmark Comparative Matrix */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs overflow-hidden shadow-xl">
        <div className="p-3 bg-[#0F172A] border-b border-[#1E293B] flex items-center justify-between">
          <span className="font-bold text-white uppercase text-xs flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            COMPARATIVE MODEL BENCHMARKS (KAGGLE CREDIT CARD FRAUD SUITE)
          </span>
          <span className="text-[10px] text-slate-400">DATASET: 284,807 ROWS // 492 FRAUDS (0.172%)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0A0C10] border-b border-[#1E293B] text-[10px] uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">MODEL_ALGORITHM</th>
                <th className="px-4 py-3">ARCHITECTURE_TYPE</th>
                <th className="px-4 py-3 text-center">PRECISION</th>
                <th className="px-4 py-3 text-center">RECALL</th>
                <th className="px-4 py-3 text-center">PR_AUC</th>
                <th className="px-4 py-3 text-center">INFERENCE_LATENCY</th>
                <th className="px-4 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {modelRegistry.map((model) => {
                const isSelected = model.id === selectedModelId;
                return (
                  <tr
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    className={`cursor-pointer transition ${
                      isSelected
                        ? 'bg-cyan-950/40 text-cyan-300 font-semibold'
                        : 'hover:bg-[#0F172A]/70 text-slate-300'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rotate-45 ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                        {model.name}
                      </div>
                      <div className="text-[10px] text-slate-500">{model.version}</div>
                    </td>

                    <td className="px-4 py-3 text-[11px] text-slate-400">
                      {model.type}
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-emerald-400">
                      {(model.metrics.precision * 100).toFixed(1)}%
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-cyan-400">
                      {(model.metrics.recall * 100).toFixed(1)}%
                    </td>

                    <td className="px-4 py-3 text-center font-bold text-purple-400">
                      {(model.metrics.pr_auc * 100).toFixed(1)}%
                    </td>

                    <td className="px-4 py-3 text-center text-slate-400">
                      {model.metrics.latency_ms} ms
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-xs text-[9px] font-bold ${
                        model.status === 'PRODUCTION_ENSEMBLE'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : model.status === 'BENCHMARK_CHAMPION'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {model.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 cols): Model Details & PCA Weights */}
        <div className="lg:col-span-7 bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              INSPECTION: {selectedModel.name}
            </span>
            <span className="text-[10px] text-slate-500">{selectedModel.framework}</span>
          </div>

          <p className="text-slate-300 font-sans text-xs leading-relaxed">
            {selectedModel.description}
          </p>

          {/* Hyperparameters */}
          <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xs space-y-1.5">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">
              Trained Hyperparameters:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {Object.entries(selectedModel.hyperparameters).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-slate-400">{key}:</span>
                  <span className="text-cyan-300 font-bold">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PCA Top Feature Weights */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">
              Top Ranked PCA Anomaly Contributors (Latent Space V1-V28):
            </span>
            <div className="space-y-1.5">
              {selectedModel.top_features.map((feat, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">{feat.feature} ({feat.name})</span>
                    <span className="text-amber-400 font-bold">{(feat.weight * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0F172A] rounded-none overflow-hidden">
                    <div 
                      className="h-full bg-cyan-400" 
                      style={{ width: `${feat.weight * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (5 cols): DuckDB In-Memory Execution Architecture */}
        <div className="lg:col-span-5 bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                DUCKDB_PIPELINE_ENGINE
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">SUB-MILLISECOND</span>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              Veritas leverages in-process columnar DuckDB to calculate rolling 90-day velocity aggregations and customer baseline deviations in &lt;18 milliseconds.
            </p>

            <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xs space-y-2 text-[11px]">
              <div className="text-slate-400 font-bold uppercase text-[10px]">
                Active Aggregation SQL:
              </div>
              <code className="text-cyan-300 block text-[10px] leading-relaxed break-all">
                SELECT count(*) as velocity_90d, sum(amount) as sum_90d, stddev_pop(amount) as std_amount FROM transactions WHERE customer_id = $1 AND timestamp &gt;= NOW() - INTERVAL '90 days';
              </code>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cold Start Latency:</span>
                <span className="text-emerald-400 font-bold">0.02 sec</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Memory Footprint:</span>
                <span className="text-white font-bold">&lt; 48 MB RAM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Hosting Cost:</span>
                <span className="text-emerald-400 font-bold">$0 / mo (embedded in Node/Python container)</span>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-[#0F172A] border border-cyan-800/60 rounded-xs text-[10px] text-cyan-300 leading-relaxed font-sans">
            <strong>Production Ensemble Strategy:</strong> In production, DuckDB feature extraction feeds an ensemble combining Isolation Forest (unsupervised novel anomaly detection) with calibrated XGBoost (pattern classification) before dispatching to Claude.
          </div>
        </div>
      </div>
    </div>
  );
};
