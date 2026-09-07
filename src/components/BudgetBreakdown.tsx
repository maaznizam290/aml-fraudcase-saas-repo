import React from 'react';
import { DollarSign, CheckCircle2, TrendingUp, AlertCircle } from 'lucide-react';
import { BUDGET_MODEL } from '../data/architectureData';

export const BudgetBreakdown: React.FC = () => {
  const totalMonthlyCost = BUDGET_MODEL.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="space-y-4">
      {/* Overview Card in Geometric Balance */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rotate-45"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                [ UNIT_ECONOMICS // LEAN_OPERATING_MODEL ]
              </span>
            </div>
            <h3 className="text-xl font-light text-white mt-1 font-mono">
              $250 – $300 / Month SaaS Prototype Operating Model
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Strictly engineered to keep cloud burn under $300/month during pre-seed and investor demonstrations. Bypasses multi-thousand dollar enterprise AWS bloat while preserving 100% architectural modularity for future scale.
            </p>
          </div>

          <div className="px-5 py-3 rounded-xs bg-[#0A0C10] border border-[#1E293B] text-right shrink-0">
            <span className="text-[10px] text-slate-500 uppercase font-mono block tracking-wider">ESTIMATED_MONTHLY_BURN</span>
            <span className="text-2xl font-light font-mono text-cyan-400">
              ${totalMonthlyCost} <span className="text-xs text-slate-500 font-sans font-normal">/ mo</span>
            </span>
          </div>
        </div>
      </div>

      {/* Line Item Table */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0F172A] border-b border-[#1E293B] text-slate-400 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3">INFRASTRUCTURE_SERVICE</th>
                <th className="px-4 py-3">MONTHLY_COST</th>
                <th className="px-5 py-3">OPERATIONAL_ROLE & CAPACITY</th>
                <th className="px-4 py-3 text-right">PRODUCTION_STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {BUDGET_MODEL.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#0F172A]/50 transition">
                  <td className="px-5 py-3.5 font-semibold text-white font-mono">
                    {item.item}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-cyan-400 font-bold">
                    ${item.cost}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400 leading-relaxed font-sans">
                    {item.description}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      <span>ALLOCATED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Investor Takeaway */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs font-mono">
            <TrendingUp className="w-4 h-4" />
            <span className="tracking-wider uppercase">[ WHY_THIS_WINS_PRE_SEED ]</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Many AI startups burn $10k/month on premature Kubernetes clusters and idle GPU instances before customer discovery. This stack proves capital efficiency: your burn rate is negligible, extending your runway to 24+ months on a modest angel check.
          </p>
        </div>

        <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs font-mono">
            <AlertCircle className="w-4 h-4" />
            <span className="tracking-wider uppercase">[ POST_FUNDING_ENTERPRISE_UPGRADE ]</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            All services use clean provider abstractions (<code className="text-cyan-300 font-mono px-1 py-0.5 bg-[#0F172A] border border-[#1E293B] rounded-xs">MLProvider</code>, <code className="text-cyan-300 font-mono px-1 py-0.5 bg-[#0F172A] border border-[#1E293B] rounded-xs">KYCProvider</code>). Once institutional banks sign pilots, the architecture effortlessly swaps into AWS GovCloud, private SageMaker endpoints, and enterprise Kafka streams.
          </p>
        </div>
      </div>
    </div>
  );
};
