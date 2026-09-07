import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  Ban, 
  ArrowRight, 
  RefreshCw, 
  Cpu, 
  GitPullRequest, 
  Bot, 
  Clock, 
  Lock, 
  Send,
  Zap,
  Building2,
  PhoneCall,
  UserCheck,
  Flame,
  Check
} from 'lucide-react';
import { FINTECH_PARTNERS, FINTECH_PRESET_PAYLOADS } from '../data/fintechEngine';
import { FintechPartnerId, PaymentRail, EvaluateTransactionRequest } from '../types';

export const WalletInterceptorView: React.FC = () => {
  const { 
    userInterceptions, 
    selectedInterceptionId, 
    selectInterception, 
    selectedInterception,
    activeFintechPartner, 
    setActiveFintechPartner,
    evaluateAndInterceptTransaction,
    resolveUserInterceptionAction,
    kpis
  } = useApp();

  // Mobile Wallet Simulation Form State
  const [selectedPresetId, setSelectedPresetId] = useState<string>('jazzcash_scam_call');
  const [amountInput, setAmountInput] = useState<number>(48500);
  const [recipientInput, setRecipientInput] = useState<string>('0308-7712399');
  const [recipientTitleInput, setRecipientTitleInput] = useState<string>('Muhammad Asif (Mule Ring Flagged)');
  const [railInput, setRailInput] = useState<PaymentRail>('WALLET_P2P');
  const [simSwapSimulated, setSimSwapSimulated] = useState<boolean>(false);
  const [muleFlagSimulated, setMuleFlagSimulated] = useState<boolean>(true);

  // In-Phone Simulated Screen State
  const [phoneScreen, setPhoneScreen] = useState<'TRANSFER_FORM' | 'PRE_TX_INTERCEPTED' | 'TRANSFER_SUCCESS' | 'SCAM_ABORTED'>('TRANSFER_FORM');
  const [activeInterceptionResult, setActiveInterceptionResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [biometricVerifying, setBiometricVerifying] = useState<boolean>(false);

  const currentPartnerConfig = FINTECH_PARTNERS[activeFintechPartner] || FINTECH_PARTNERS.jazzcash;

  // Handle Preset Selection
  const handleApplyPreset = (presetId: string) => {
    const preset = FINTECH_PRESET_PAYLOADS.find(p => p.id === presetId);
    if (!preset) return;

    setSelectedPresetId(presetId);
    setActiveFintechPartner(preset.partner);
    setAmountInput(preset.request.transaction_details.amount);
    setRecipientInput(preset.request.destination_account.account_or_iban);
    setRecipientTitleInput(preset.request.destination_account.account_title);
    setRailInput(preset.request.transaction_details.rail);
    setSimSwapSimulated(preset.request.source_wallet.sim_serial_changed_last_72h);
    setMuleFlagSimulated(preset.request.destination_account.known_mule_cluster_flag);
    setPhoneScreen('TRANSFER_FORM');
  };

  // Submit in-flight transaction
  const handleExecuteTransfer = () => {
    setIsProcessing(true);

    const req: EvaluateTransactionRequest = {
      partner_id: activeFintechPartner,
      source_wallet: {
        account_number: activeFintechPartner === 'jazzcash' ? '0301-4491022' : '0345-5128901',
        cnic_masked: '35201-******-1',
        kyc_level: 'LEVEL_1',
        device_imei: simSwapSimulated ? '359182048102941 (New Emulator)' : '864201049281726',
        device_model: simSwapSimulated ? 'Rooted Android Emulator' : 'Samsung Galaxy A12',
        ip_address: '39.40.122.9',
        city: 'Faisalabad',
        sim_serial_changed_last_72h: simSwapSimulated
      },
      destination_account: {
        bank_code: activeFintechPartner.toUpperCase(),
        account_or_iban: recipientInput,
        account_title: recipientTitleInput,
        account_age_days: muleFlagSimulated ? 3 : 180,
        known_mule_cluster_flag: muleFlagSimulated
      },
      transaction_details: {
        amount: Number(amountInput),
        currency: 'PKR',
        rail: railInput,
        purpose_of_payment: 'Wallet Transfer'
      }
    };

    setTimeout(() => {
      const result = evaluateAndInterceptTransaction(req);
      setActiveInterceptionResult(result);
      setIsProcessing(false);

      if (result.user_interception_payload.must_notify_user_first) {
        setPhoneScreen('PRE_TX_INTERCEPTED');
      } else {
        setPhoneScreen('TRANSFER_SUCCESS');
      }
    }, 450); // fast sub-second simulated network roundtrip
  };

  // User decides to abort scam
  const handleUserAbortScam = () => {
    if (selectedInterception) {
      resolveUserInterceptionAction(selectedInterception.id, 'USER_ABORTED_SCAM');
    }
    setPhoneScreen('SCAM_ABORTED');
  };

  // User completes biometric step-up
  const handleUserBiometricChallenge = () => {
    setBiometricVerifying(true);
    setTimeout(() => {
      setBiometricVerifying(false);
      if (selectedInterception) {
        resolveUserInterceptionAction(selectedInterception.id, 'USER_CHALLENGED_SUCCESS');
      }
      setPhoneScreen('TRANSFER_SUCCESS');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Context Description */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-linear-to-l from-red-500/10 to-transparent pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 bg-red-400 rotate-45"></span>
              <h2 className="text-lg font-bold font-mono text-white tracking-wide">
                PRE-TRANSACTION FRAUD INTERCEPTION & USER NOTIFICATION ENGINE
              </h2>
              <span className="px-2 py-0.5 bg-red-950/60 text-red-400 border border-red-800/50 rounded-xs text-[10px] font-mono font-bold">
                PATENT-PENDING IN-FLIGHT GATEWAY
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans max-w-3xl leading-relaxed">
              When a normal mobile wallet customer (on <strong className="text-white">JazzCash, Easypaisa, NayaPay, or SadaPay</strong>) 
              attempts to send funds into a fraud scheme, <strong className="text-cyan-400">the transaction is intercepted before deduction</strong>. 
              Our ensemble combines the <strong className="text-amber-400">developerPratik Random Forest</strong> sub-5ms inference, 
              <strong className="text-emerald-400">Jube AML transaction rules</strong>, and <strong className="text-purple-400">FinRobot Financial CoT</strong> 
              to notify the user first with contextual anti-scam warnings and step-up biometric challenges.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Prevented Fraud Losses</span>
              <span className="text-emerald-400 font-bold text-base">
                PKR {kpis.scamLossesPreventedPkr.toLocaleString()}
              </span>
            </div>
            <div className="h-8 w-px bg-slate-800"></div>
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-400 uppercase block">Interceptions</span>
              <span className="text-cyan-400 font-bold text-base">
                {userInterceptions.length} Cases
              </span>
            </div>
          </div>
        </div>

        {/* Partner Selector Chips */}
        <div className="mt-4 pt-4 border-t border-[#1E293B] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 mr-2 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            TARGET FINTECH:
          </span>
          {(Object.keys(FINTECH_PARTNERS) as FintechPartnerId[]).map(partnerId => {
            const partner = FINTECH_PARTNERS[partnerId];
            const isSelected = activeFintechPartner === partnerId;
            return (
              <button
                key={partnerId}
                onClick={() => {
                  setActiveFintechPartner(partnerId);
                  setPhoneScreen('TRANSFER_FORM');
                }}
                className={`px-3 py-1 rounded-xs text-xs font-mono font-bold transition flex items-center gap-2 border ${
                  isSelected 
                    ? `${partner.badgeColor} border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]`
                    : 'bg-[#0A0C10] text-slate-400 border-[#1E293B] hover:text-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-600'}`}></span>
                {partner.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Mobile Phone Simulator vs Real-Time Veritas AML Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Mobile Wallet Simulator (Cols 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold font-mono text-white tracking-wider uppercase">
                  {currentPartnerConfig.name} Mobile App Simulator
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                CLIENT_RAIL: {railInput}
              </span>
            </div>

            {/* Presets Quick Load Bar */}
            <div className="mb-4">
              <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                Select Fraud or Legitimate Scenario:
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {FINTECH_PRESET_PAYLOADS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset.id)}
                    className={`p-2 text-left rounded-xs text-[11px] font-mono border transition ${
                      selectedPresetId === preset.id
                        ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-[#0A0C10] border-[#1E293B] text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="truncate font-bold">{preset.name.split(':')[0]}</div>
                    <div className="text-[9px] text-slate-500 truncate">{preset.name.split(':')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Photorealistic Mobile Smartphone Mockup Frame */}
            <div className="relative mx-auto max-w-[340px] bg-[#05070A] border-4 border-slate-800 rounded-[28px] p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Phone Speaker Notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-2 flex items-center justify-center gap-1.5">
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
              </div>

              {/* In-App Header */}
              <div className="flex items-center justify-between py-1.5 px-2 border-b border-slate-800/80 mb-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-bold text-white uppercase">{currentPartnerConfig.name}</span>
                </div>
                <div className="text-slate-400 text-[10px]">
                  BAL: PKR 148,200
                </div>
              </div>

              {/* Screen 1: Transfer Form */}
              {phoneScreen === 'TRANSFER_FORM' && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xs">
                    <span className="text-[9px] text-slate-500 block uppercase">Sender Wallet</span>
                    <div className="text-white font-bold text-[11px]">0301-4491022 (CNIC: 35201-******-1)</div>
                    <div className="text-[9px] text-emerald-400">Biometric Verified // Lahore</div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Recipient Number / IBAN</label>
                    <input 
                      type="text" 
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      className="w-full bg-[#0A0C10] border border-slate-700 rounded-xs px-2.5 py-1.5 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Recipient Title</label>
                    <input 
                      type="text" 
                      value={recipientTitleInput}
                      onChange={(e) => setRecipientTitleInput(e.target.value)}
                      className="w-full bg-[#0A0C10] border border-slate-700 rounded-xs px-2.5 py-1.5 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Amount (PKR)</label>
                      <input 
                        type="number" 
                        value={amountInput}
                        onChange={(e) => setAmountInput(Number(e.target.value))}
                        className="w-full bg-[#0A0C10] border border-slate-700 rounded-xs px-2.5 py-1.5 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Rail</label>
                      <select 
                        value={railInput}
                        onChange={(e) => setRailInput(e.target.value as PaymentRail)}
                        className="w-full bg-[#0A0C10] border border-slate-700 rounded-xs px-2 py-1.5 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                      >
                        <option value="WALLET_P2P">Wallet P2P</option>
                        <option value="IBFT">1LINK IBFT</option>
                        <option value="RAAST">Raast Instant</option>
                        <option value="AGENT_CASHOUT">Agent Cash-Out</option>
                        <option value="QR_MERCHANT">QR Merchant</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Simulation Flags Toggle */}
                  <div className="p-2 bg-slate-900/60 border border-slate-800 rounded-xs space-y-1.5 text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Simulate SIM Swap in 72h:</span>
                      <button 
                        type="button"
                        onClick={() => setSimSwapSimulated(!simSwapSimulated)}
                        className={`px-1.5 py-0.5 rounded-xs font-bold ${
                          simSwapSimulated ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {simSwapSimulated ? 'YES (ATO)' : 'NO'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Recipient in Mule Ring:</span>
                      <button 
                        type="button"
                        onClick={() => setMuleFlagSimulated(!muleFlagSimulated)}
                        className={`px-1.5 py-0.5 rounded-xs font-bold ${
                          muleFlagSimulated ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {muleFlagSimulated ? 'YES (Flagged)' : 'NO'}
                      </button>
                    </div>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleExecuteTransfer}
                    disabled={isProcessing}
                    className="w-full mt-2 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xs text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying with Veritas ML...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SEND PKR {Number(amountInput).toLocaleString()}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Screen 2: Pre-Transaction Interception Warning Modal (The Core User Experience) */}
              {phoneScreen === 'PRE_TX_INTERCEPTED' && (
                <div className="space-y-3 font-mono">
                  {/* Warning Header */}
                  <div className="p-3 bg-red-950/80 border border-red-600/80 rounded-xs text-center space-y-1">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto mb-1">
                      <ShieldAlert className="w-5 h-5 text-red-400" />
                    </div>
                    <h4 className="text-[11px] font-bold text-red-200 uppercase tracking-wide">
                      TRANSACTION INTERCEPTED
                    </h4>
                    <p className="text-[9px] text-red-300">
                      Funds have NOT left your account.
                    </p>
                  </div>

                  {/* Explanation for User */}
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xs space-y-2 text-[10px]">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>ANTI-FRAUD SHIELD TRIGGERED</span>
                    </div>
                    <p className="text-slate-300 text-[10px] leading-relaxed">
                      {activeInterceptionResult?.user_interception_payload?.in_app_warning_body || 
                        `The recipient account has been flagged for active fraud inquiries today. If someone is on a call with you claiming to represent JazzCash, Easypaisa, or Benazir Income Support, do not send funds.`}
                    </p>

                    <div className="pt-1.5 border-t border-slate-800 space-y-1 text-slate-400 text-[9px]">
                      <div className="flex items-start gap-1">
                        <span className="text-red-400 font-bold">•</span>
                        <span>Official staff never ask for prize transfer fees.</span>
                      </div>
                      <div className="flex items-start gap-1">
                        <span className="text-red-400 font-bold">•</span>
                        <span>Never share OTP or MPIN on a phone call.</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Choices for the Normal User */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handleUserAbortScam}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xs text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>CANCEL & SECURE MY MONEY</span>
                    </button>

                    {activeInterceptionResult?.decision !== 'BLOCK_IMMEDIATE' && (
                      <button
                        onClick={handleUserBiometricChallenge}
                        disabled={biometricVerifying}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xs text-[11px] font-mono flex items-center justify-center gap-1.5"
                      >
                        {biometricVerifying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                            <span>Scanning NADRA Fingerprint...</span>
                          </>
                        ) : (
                          <>
                            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Verify Identity with Biometrics</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="text-center">
                    <span className="text-[9px] text-slate-500">
                      SBP Circular No. 4 / Consumer Protection 2026
                    </span>
                  </div>
                </div>
              )}

              {/* Screen 3: Scam Aborted Screen */}
              {phoneScreen === 'SCAM_ABORTED' && (
                <div className="py-6 px-3 text-center font-mono space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    SCAM AVERTED!
                  </h4>
                  <p className="text-xs text-emerald-300 font-bold">
                    PKR {Number(amountInput).toLocaleString()} Preserved
                  </p>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    You chose to cancel this suspicious transfer. A report has been dispatched to the FIA Cybercrime Wing and {currentPartnerConfig.name} Security Operations.
                  </p>
                  <button
                    onClick={() => setPhoneScreen('TRANSFER_FORM')}
                    className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xs text-xs font-mono"
                  >
                    Return to Wallet
                  </button>
                </div>
              )}

              {/* Screen 4: Legitimate Transfer Completed */}
              {phoneScreen === 'TRANSFER_SUCCESS' && (
                <div className="py-6 px-3 text-center font-mono space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center mx-auto text-cyan-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase">
                    TRANSFER COMPLETED
                  </h4>
                  <p className="text-xs text-cyan-300 font-bold">
                    PKR {Number(amountInput).toLocaleString()} Sent
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Recipient: {recipientTitleInput}
                    <br />
                    Auth: Biometric Verified // Sub-5ms Clear
                  </p>
                  <button
                    onClick={() => setPhoneScreen('TRANSFER_FORM')}
                    className="mt-4 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xs text-xs font-mono"
                  >
                    New Transaction
                  </button>
                </div>
              )}

              {/* Phone Home Bar */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto mt-4"></div>
            </div>
          </div>
        </div>

        {/* Right Column: Veritas Real-Time AML Telemetry & Multi-Model Breakdown (Cols 7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Live Interception Status Card */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold font-mono text-white tracking-wider uppercase">
                  Active In-Flight Interception Telemetry
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                CASE: {selectedInterception?.id || 'INT-901'}
              </span>
            </div>

            {selectedInterception ? (
              <div className="mt-4 space-y-4 font-mono text-xs">
                {/* Meta details bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#0A0C10] border border-[#1E293B] rounded-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Fintech Wallet</span>
                    <span className="text-white font-bold">{selectedInterception.partner_name}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">Amount Intercepted</span>
                    <span className="text-red-400 font-bold">PKR {selectedInterception.amount_pkr.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">ML Risk Score</span>
                    <span className="text-amber-400 font-bold">{selectedInterception.developer_pratik_ml.fraud_probability}% ({selectedInterception.developer_pratik_ml.risk_tier})</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase block">User Interception Status</span>
                    <span className={`font-bold ${
                      selectedInterception.status === 'USER_ABORTED_SCAM' 
                        ? 'text-emerald-400' 
                        : selectedInterception.status === 'SYSTEM_BLOCKED'
                        ? 'text-red-400'
                        : 'text-amber-400'
                    }`}>
                      {selectedInterception.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Section 1: developerPratik/credit-card-fraud-detector Random Forest Breakdown */}
                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-bold text-amber-300 uppercase text-[11px]">
                        developerPratik / credit-card-fraud-detector (Random Forest)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      LATENCY: <strong className="text-emerald-400">{selectedInterception.developer_pratik_ml.inference_latency_ms} ms</strong> (sub-5ms SLA)
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-sans">
                    Utilizes a 100-tree Random Forest classifier trained on class-imbalanced fraud telemetry, 
                    evaluating velocity spikes, infant accounts, SIM swaps, and behavioral latent vectors.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                    {selectedInterception.developer_pratik_ml.feature_attributions.map((feat, idx) => (
                      <div key={idx} className="p-2 bg-[#0A0C10] border border-slate-800 rounded-xs flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-400 block truncate">{feat.feature}</span>
                          <span className="text-white font-bold">{feat.value}</span>
                        </div>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-xs ${
                          feat.anomaly_status === 'CRITICAL' 
                            ? 'bg-red-950 text-red-400 border border-red-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          +{feat.contribution_weight}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2: jube-home/aml-fraud-transaction-monitoring Rules */}
                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-bold text-cyan-300 uppercase text-[11px]">
                        Jube AML Real-Time Rule Scenarios Triggered
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {selectedInterception.jube_rules.length} SCENARIOS MATCHED
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedInterception.jube_rules.map((rule, idx) => (
                      <div key={idx} className="p-2 bg-[#0A0C10] border border-slate-800 rounded-xs text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{rule.scenario_name}</span>
                          <span className="text-red-400 font-bold text-[10px]">{rule.rule_id}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Condition: {rule.threshold_condition}
                        </div>
                        <div className="text-[10px] text-emerald-400 mt-0.5">
                          SBP Mandate: {rule.sbp_regulatory_code || 'SBP-BPRD-AML-REG-7.2'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: AI4Finance-Foundation/FinRobot Multi-Agent CoT */}
                <div className="p-3.5 bg-purple-950/20 border border-purple-800/60 rounded-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-purple-400" />
                      <span className="font-bold text-purple-300 uppercase text-[11px]">
                        FinRobot Multi-Agent Chain-of-Thought (AI4Finance)
                      </span>
                    </div>
                    <span className="text-[10px] text-purple-400">
                      LEAD AGENT: SYNTHESIS
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[10px]">
                    <div className="p-2 bg-[#0A0C10] border border-purple-900/50 rounded-xs">
                      <span className="text-slate-500 font-bold block mb-1">1. DATA-COT AGENT</span>
                      <p className="text-slate-300 leading-tight">
                        {selectedInterception.finrobot_cot.data_cot_agent.profile_retrieved}
                      </p>
                    </div>
                    <div className="p-2 bg-[#0A0C10] border border-purple-900/50 rounded-xs">
                      <span className="text-slate-500 font-bold block mb-1">2. CONCEPT-COT AGENT</span>
                      <p className="text-slate-300 leading-tight">
                        {selectedInterception.finrobot_cot.concept_cot_agent.peer_group_deviation}
                      </p>
                    </div>
                    <div className="p-2 bg-[#0A0C10] border border-purple-900/50 rounded-xs">
                      <span className="text-slate-500 font-bold block mb-1">3. THESIS-COT AGENT</span>
                      <p className="text-slate-300 leading-tight">
                        {selectedInterception.finrobot_cot.thesis_cot_agent.analyst_investigation_brief}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-6 text-center font-mono">
                No active interception selected. Use the mobile simulator to trigger a transfer.
              </p>
            )}
          </div>

          {/* Live Recent Interceptions Queue Table */}
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xs p-4">
            <h4 className="text-xs font-bold font-mono text-white tracking-wider uppercase mb-3 flex items-center justify-between">
              <span>Recent In-Flight Interception Audit Stream</span>
              <span className="text-slate-500 text-[10px] font-normal">Click to Inspect</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#1E293B] text-slate-400 text-[10px]">
                    <th className="pb-2">TIME</th>
                    <th className="pb-2">FINTECH</th>
                    <th className="pb-2">USER</th>
                    <th className="pb-2">AMOUNT</th>
                    <th className="pb-2">ML SCORE</th>
                    <th className="pb-2">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-[11px]">
                  {userInterceptions.map(item => (
                    <tr 
                      key={item.id}
                      onClick={() => selectInterception(item.id)}
                      className={`cursor-pointer hover:bg-slate-800/60 transition ${
                        selectedInterceptionId === item.id ? 'bg-cyan-950/40 text-cyan-300 font-bold' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 text-slate-400">{item.timestamp}</td>
                      <td className="py-2.5 font-bold">{item.partner_name}</td>
                      <td className="py-2.5">{item.user_phone}</td>
                      <td className="py-2.5 font-bold text-red-400">PKR {item.amount_pkr.toLocaleString()}</td>
                      <td className="py-2.5 text-amber-400">{item.developer_pratik_ml.fraud_probability}% ({item.developer_pratik_ml.risk_tier})</td>
                      <td className="py-2.5">
                        <span className={`px-1.5 py-0.5 rounded-xs text-[9px] font-bold ${
                          item.status === 'USER_ABORTED_SCAM'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.status === 'SYSTEM_BLOCKED'
                            ? 'bg-red-950 text-red-300 border border-red-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {item.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
