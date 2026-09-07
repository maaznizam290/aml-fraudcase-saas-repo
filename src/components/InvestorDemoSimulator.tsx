import React, { useState } from 'react';
import { RotateCcw, ChevronRight, MessageSquare } from 'lucide-react';
import { INVESTOR_DEMO_STEPS } from '../data/architectureData';

export const InvestorDemoSimulator: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeScenario, setActiveScenario] = useState('smurfing');

  const currentStep = INVESTOR_DEMO_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < INVESTOR_DEMO_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Pitch Strategy in Geometric Balance */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rotate-45"></div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                [ VC_DEMO_WALKTHROUGH // 10_STAGE_FLOW ]
              </span>
            </div>
            <h3 className="text-xl font-light text-white mt-1 font-mono">
              The 10-Stage "Zero to Funding" Live Demo Simulation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 max-w-3xl leading-relaxed">
              Walk investors through the complete loop in under 4 minutes. Shows how Veritas turns raw alerts into explainable, cited recommendations with permanent institutional learning via Hermes.
            </p>
          </div>

          {/* Scenario Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-mono text-slate-500 uppercase">Scenario:</span>
            <select
              value={activeScenario}
              onChange={(e) => {
                setActiveScenario(e.target.value);
                setCurrentStepIndex(0);
              }}
              className="bg-[#0A0C10] border border-[#1E293B] text-xs text-cyan-400 font-mono rounded-xs px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="smurfing">1. Rapid Velocity / Smurfing</option>
              <option value="wire">2. New Device + $48k Wire</option>
              <option value="crossborder">3. Geolocation Jump (London-SG)</option>
              <option value="structuring">4. Sub-$10k Structuring</option>
              <option value="falsepositive">5. HNW Legitimate False Positive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Progress Bar */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs p-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
          <span>
            STAGE {currentStepIndex + 1} / {INVESTOR_DEMO_STEPS.length}:{' '}
            <strong className="text-white">{currentStep.title}</strong>
          </span>
          <span className="text-cyan-400">
            {Math.round(((currentStepIndex + 1) / INVESTOR_DEMO_STEPS.length) * 100)}% COMPLETE
          </span>
        </div>

        {/* Step Blocks */}
        <div className="grid grid-cols-10 gap-1">
          {INVESTOR_DEMO_STEPS.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStepIndex(idx)}
              className={`h-2 transition-all rounded-none ${
                idx === currentStepIndex
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                  : idx < currentStepIndex
                  ? 'bg-cyan-800/80'
                  : 'bg-[#1E293B]'
              }`}
              title={step.title}
            />
          ))}
        </div>
      </div>

      {/* Main Active Step Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: What Happens (The System Reality) */}
        <div className="lg:col-span-7 bg-[#0A0C10] border border-[#1E293B] rounded-xs p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono">
              <span className="px-2 py-0.5 rounded-xs text-[10px] uppercase bg-[#0F172A] border border-[#1E293B] text-cyan-400">
                ACTOR: {currentStep.actor}
              </span>
              {currentStep.metric && (
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  LATENCY: {currentStep.metric}
                </span>
              )}
            </div>

            <h4 className="text-lg font-light text-white tracking-tight font-mono">
              {currentStep.title}
            </h4>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#0F172A] p-3.5 rounded-xs border border-[#1E293B]">
                <span className="text-slate-500 uppercase tracking-widest text-[10px] block mb-1">
                  [ TRIGGER_ACTION ]:
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {currentStep.action}
                </p>
              </div>

              <div className="bg-[#0F172A] p-3.5 rounded-xs border border-[#1E293B]">
                <span className="text-slate-500 uppercase tracking-widest text-[10px] block mb-1">
                  [ SYSTEM_OUTPUT_EVIDENTIARY_ARTIFACT ]:
                </span>
                <p className="text-cyan-300 leading-relaxed">
                  {currentStep.output}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between font-mono">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs text-slate-400 hover:text-white border border-[#1E293B] hover:bg-[#0F172A] transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET_FLOW</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === INVESTOR_DEMO_STEPS.length - 1}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xs text-xs font-bold tracking-wider uppercase transition ${
                currentStepIndex === INVESTOR_DEMO_STEPS.length - 1
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed border border-[#1E293B]'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              }`}
            >
              <span>NEXT_STAGE</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: What to Say to the Investor (Pitch Script) */}
        <div className="lg:col-span-5 bg-[#0F172A] border border-[#1E293B] rounded-xs p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                [ FOUNDER_PITCH_SCRIPT ]
              </span>
            </div>

            <div className="p-4 rounded-xs bg-[#0A0C10] border-l-2 border-cyan-400 border-t border-r border-b border-t-[#1E293B] border-r-[#1E293B] border-b-[#1E293B] text-slate-200 text-sm leading-relaxed font-sans">
              "{currentStep.investorNarration.replace(/^'|'$/g, '')}"
            </div>

            <div className="p-3.5 rounded-xs bg-[#0A0C10] border border-[#1E293B] text-xs text-slate-400 space-y-1 font-mono">
              <strong className="text-cyan-400 block text-[10px] uppercase tracking-wider">Why Investors Care:</strong>
              <p className="leading-relaxed text-[11px]">
                Demonstrates that your team understands compliance risk: you are not building an uncontrolled toy that regulators will shut down. You are building an enterprise force-multiplier that compliance officers will champion.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#1E293B] text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>ENTERPRISE AML TIER 1 COMPLIANT</span>
            <span className="text-cyan-400">100% DETERMINISTIC TRAIL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
