import React, { createContext, useContext, useState, useMemo } from 'react';
import { 
  Alert, 
  Customer, 
  Transaction, 
  HermesMemory, 
  HermesCandidateRule, 
  ModelRegistryItem, 
  AuditLog,
  MainNavTab,
  Disposition,
  CaseStatus,
  ScenarioDefinition,
  UserInterceptionEvent,
  EvaluateTransactionRequest,
  EvaluateTransactionResponse,
  FintechPartnerId
} from '../types';
import { 
  INITIAL_ALERTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_HERMES_MEMORIES, 
  INITIAL_CANDIDATE_RULES, 
  INITIAL_MODEL_REGISTRY, 
  INITIAL_AUDIT_LOGS,
  SCENARIOS
} from '../data/syntheticData';
import { 
  INITIAL_USER_INTERCEPTIONS, 
  evaluateTransactionEngine, 
  FINTECH_PARTNERS 
} from '../data/fintechEngine';

interface AppContextType {
  // State
  alerts: Alert[];
  customers: Customer[];
  transactions: Transaction[];
  memories: HermesMemory[];
  candidateRules: HermesCandidateRule[];
  modelRegistry: ModelRegistryItem[];
  auditLogs: AuditLog[];
  userInterceptions: UserInterceptionEvent[];
  selectedInterceptionId: string;
  selectedInterception: UserInterceptionEvent | undefined;
  activeFintechPartner: FintechPartnerId;
  selectedAlertId: string;
  selectedAlert: Alert | undefined;
  activeNav: MainNavTab;
  demoMode: boolean;
  activeScenarioId: string | null;
  isSimulating: boolean;
  simulationStep: number; // 0 to 14

  // Actions
  setActiveNav: (nav: MainNavTab) => void;
  setDemoMode: (mode: boolean) => void;
  setActiveFintechPartner: (partner: FintechPartnerId) => void;
  selectInterception: (id: string) => void;
  selectAlert: (id: string) => void;
  triggerScenario: (scenarioId: string) => void;
  runSimulationStep: () => void;
  resetSimulation: () => void;
  evaluateAndInterceptTransaction: (req: EvaluateTransactionRequest) => EvaluateTransactionResponse;
  resolveUserInterceptionAction: (interceptionId: string, action: 'USER_CHALLENGED_SUCCESS' | 'USER_ABORTED_SCAM') => void;
  approveRecommendation: (alertId: string, analystNotes: string) => void;
  overrideRecommendation: (alertId: string, overrideDisposition: Disposition, analystRationale: string) => void;
  updateCandidateRuleStatus: (ruleId: string, status: HermesCandidateRule['status']) => void;
  filterAlerts: (status?: CaseStatus, riskBand?: string, search?: string) => Alert[];
  kpis: {
    totalAlerts24h: number;
    highRiskRatio: number;
    falsePositiveReductionPct: number;
    aiAcceptanceRatePct: number;
    medianTriageTimeMinutes: number;
    pendingReviewCount: number;
    preTransactionInterceptionsCount: number;
    scamLossesPreventedPkr: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [customers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [transactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [memories, setMemories] = useState<HermesMemory[]>(INITIAL_HERMES_MEMORIES);
  const [candidateRules, setCandidateRules] = useState<HermesCandidateRule[]>(INITIAL_CANDIDATE_RULES);
  const [modelRegistry] = useState<ModelRegistryItem[]>(INITIAL_MODEL_REGISTRY);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  
  // Fintech & User Pre-Transaction Interception State
  const [userInterceptions, setUserInterceptions] = useState<UserInterceptionEvent[]>(INITIAL_USER_INTERCEPTIONS);
  const [selectedInterceptionId, setSelectedInterceptionId] = useState<string>('INT-901');
  const [activeFintechPartner, setActiveFintechPartner] = useState<FintechPartnerId>('jazzcash');

  const [selectedAlertId, setSelectedAlertId] = useState<string>('ALT-2026-0901');
  const [activeNav, setActiveNav] = useState<MainNavTab>('overview');
  const [demoMode, setDemoMode] = useState<boolean>(true);
  
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>('smurfing');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const selectedInterception = useMemo(() => {
    return userInterceptions.find(i => i.id === selectedInterceptionId) || userInterceptions[0];
  }, [userInterceptions, selectedInterceptionId]);

  const selectInterception = (id: string) => {
    setSelectedInterceptionId(id);
  };

  const selectedAlert = useMemo(() => {
    return alerts.find(a => a.id === selectedAlertId) || alerts[0];
  }, [alerts, selectedAlertId]);

  const selectAlert = (id: string) => {
    setSelectedAlertId(id);
    setActiveNav('investigate');
  };

  const triggerScenario = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    setSimulationStep(0);
    setIsSimulating(true);

    // Map scenario to corresponding alert
    let targetAlertId = 'ALT-2026-0901';
    if (scenarioId === 'smurfing') targetAlertId = 'ALT-2026-0901';
    if (scenarioId === 'wire') targetAlertId = 'ALT-2026-0902';
    if (scenarioId === 'geo_jump') targetAlertId = 'ALT-2026-0903';
    if (scenarioId === 'structuring') targetAlertId = 'ALT-2026-0904';
    if (scenarioId === 'hnw_clear') targetAlertId = 'ALT-2026-0905';

    setSelectedAlertId(targetAlertId);

    // Add log entry
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    const newLog: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      actor: 'investor:live_session',
      action: 'SCENARIO_TRIGGERED',
      entity_type: 'SCENARIO',
      entity_id: scenarioId,
      evidence_hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      details: `Triggered investor scenario: ${scenario?.title || scenarioId}. Dispatched to n8n webhook intake.`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const runSimulationStep = () => {
    if (simulationStep < 13) {
      setSimulationStep(prev => prev + 1);
    }
  };

  const resetSimulation = () => {
    setSimulationStep(0);
    setIsSimulating(false);
  };

  const approveRecommendation = (alertId: string, analystNotes: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    const disposition = alert.ai_recommendation?.disposition || 'ESCALATE';
    const nextStatus: CaseStatus = disposition === 'CLEAR' ? 'RESOLVED' : 'ESCALATED';

    // 1. Update alert
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: nextStatus,
          analyst_decision: {
            id: `dec_${Date.now()}`,
            case_id: alertId,
            analyst_id: 'usr_sarah_jenkins_mlro',
            analyst_name: 'Sarah Jenkins (Compliance Lead)',
            action: 'APPROVED',
            analyst_rationale: analystNotes || 'Approved AI recommendation based on cited evidentiary corroboration.',
            decided_at: new Date().toISOString()
          }
        };
      }
      return a;
    }));

    // 2. Append to immutable audit log
    const auditEntry: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      actor: 'analyst:sarah_jenkins',
      action: 'RECOMMENDATION_APPROVED',
      entity_type: 'CASE',
      entity_id: alertId,
      evidence_hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      details: `Human analyst approved ${disposition} recommendation. Rationale: ${analystNotes || 'Evidentiary corroboration validated.'}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    // 3. Trigger Hermes Reflection Loop
    const hermesEntry: HermesMemory = {
      id: `mem_${Date.now()}`,
      memory_type: 'EPISODIC',
      title: `Resolved Investigation: ${alert.customer.name} (${alert.alert_type})`,
      content: `Disposition ${disposition} approved with confidence ${alert.ai_recommendation?.confidence}%. Key cited red flags: ${alert.ai_recommendation?.redFlags.slice(0, 2).join('; ')}. Analyst noted: "${analystNotes || 'Approved'}".`,
      confidence: 0.95,
      tags: [alert.alert_type, disposition, 'APPROVED_OUTCOME', alert.customer.risk_tier],
      created_at: new Date().toISOString(),
      case_reference: alertId
    };
    setMemories(prev => [hermesEntry, ...prev]);
  };

  const overrideRecommendation = (alertId: string, overrideDisposition: Disposition, analystRationale: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    // 1. Update alert
    const nextStatus: CaseStatus = overrideDisposition === 'CLEAR' ? 'FALSE_POSITIVE' : 'ESCALATED';

    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: nextStatus,
          analyst_decision: {
            id: `dec_${Date.now()}`,
            case_id: alertId,
            analyst_id: 'usr_sarah_jenkins_mlro',
            analyst_name: 'Sarah Jenkins (Compliance Lead)',
            action: 'OVERRIDDEN',
            override_disposition: overrideDisposition,
            analyst_rationale: analystRationale,
            decided_at: new Date().toISOString()
          }
        };
      }
      return a;
    }));

    // 2. Append to immutable audit log
    const auditEntry: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      actor: 'analyst:sarah_jenkins',
      action: 'RECOMMENDATION_OVERRIDDEN',
      entity_type: 'CASE',
      entity_id: alertId,
      evidence_hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      details: `Analyst overrode AI recommendation (${alert.ai_recommendation?.disposition} → ${overrideDisposition}). Reason: ${analystRationale}`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    // 3. Dispatch to Hermes Feedback Memory
    const feedbackMemory: HermesMemory = {
      id: `mem_${Date.now()}`,
      memory_type: 'FEEDBACK',
      title: `Analyst Override on ${alert.customer.name} (${alert.alert_type})`,
      content: `AI originally recommended ${alert.ai_recommendation?.disposition}; human compliance lead overridden to ${overrideDisposition}. Reason: "${analystRationale}". Pattern flagged for heuristic proposal generation.`,
      confidence: 0.92,
      tags: ['ANALYST_OVERRIDE', alert.alert_type, overrideDisposition],
      created_at: new Date().toISOString(),
      case_reference: alertId
    };
    setMemories(prev => [feedbackMemory, ...prev]);

    // 4. Hermes automatically synthesizes a Candidate Heuristic
    const candidateRule: HermesCandidateRule = {
      id: `rule_cand_${Math.floor(45 + Math.random() * 50)}`,
      title: `Heuristic Proposal: Adapt for ${alert.alert_type} Context`,
      description: `Generated from analyst override on ${alert.customer.name}: "${analystRationale}". Prevents recurring false positive / miss in identical operational conditions.`,
      rule_logic: `IF customer.occupation == "${alert.customer.occupation}" AND transaction.amount <= ${alert.transaction.amount} THEN adjust_score(-20) AND require_manual_review()`,
      status: 'PROPOSED',
      impact_cases_count: 3,
      proposed_at: new Date().toISOString(),
      rationale: `Direct distillation of override on case ${alertId}.`
    };
    setCandidateRules(prev => [candidateRule, ...prev]);
  };

  const updateCandidateRuleStatus = (ruleId: string, status: HermesCandidateRule['status']) => {
    setCandidateRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          status,
          reviewed_by: status === 'APPROVED' || status === 'REJECTED' ? 'Sarah Jenkins (MLRO Lead)' : r.reviewed_by
        };
      }
      return r;
    }));

    // Audit log
    const auditEntry: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString(),
      actor: 'compliance_lead:sarah_jenkins',
      action: `RULE_${status}`,
      entity_type: 'HERMES_CANDIDATE_RULE',
      entity_id: ruleId,
      evidence_hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
      details: `Hermes Candidate Rule ${ruleId} lifecycle transitioned to ${status}.`
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  const filterAlerts = (status?: CaseStatus, riskBand?: string, search?: string) => {
    return alerts.filter(alert => {
      if (status && alert.status !== status) return false;
      if (riskBand && alert.customer.risk_tier !== riskBand) return false;
      if (search) {
        const q = search.toLowerCase();
        const matchName = alert.customer.name.toLowerCase().includes(q);
        const matchId = alert.id.toLowerCase().includes(q);
        const matchType = alert.alert_type.toLowerCase().includes(q);
        const matchRecipient = alert.transaction.recipient.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchType && !matchRecipient) return false;
      }
      return true;
    });
  };

  const evaluateAndInterceptTransaction = (req: EvaluateTransactionRequest): EvaluateTransactionResponse => {
    const res = evaluateTransactionEngine(req);
    const partner = FINTECH_PARTNERS[req.partner_id] || FINTECH_PARTNERS.jazzcash;

    // If transaction requires user notification/interception or is high risk, create an in-flight interception event
    if (res.user_interception_payload.must_notify_user_first || res.risk_score >= 40) {
      const newInterception: UserInterceptionEvent = {
        id: `INT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now (live in-flight)',
        partner: req.partner_id,
        partner_name: partner.name,
        user_phone: req.source_wallet.account_number,
        user_cnic_masked: req.source_wallet.cnic_masked,
        recipient_title: req.destination_account.account_title,
        recipient_identifier: req.destination_account.account_or_iban,
        recipient_bank: req.destination_account.bank_code,
        amount_pkr: req.transaction_details.amount,
        payment_rail: req.transaction_details.rail,
        decision: res.decision,
        challenge_type: res.user_interception_payload.suggested_challenge !== 'NONE' ? res.user_interception_payload.suggested_challenge : undefined,
        developer_pratik_ml: {
          risk_tier: res.risk_tier,
          fraud_probability: res.risk_score,
          inference_latency_ms: res.latency_ms,
          random_forest_trees_flagged: Math.round(res.risk_score * 0.96),
          feature_attributions: [
            { feature: 'Mule_Cluster_Closeness', value: req.destination_account.known_mule_cluster_flag ? '0.94' : '0.03', contribution_weight: 38, anomaly_status: req.destination_account.known_mule_cluster_flag ? 'CRITICAL' : 'NORMAL' },
            { feature: 'SIM_Swap_72h', value: req.source_wallet.sim_serial_changed_last_72h ? 'TRUE' : 'FALSE', contribution_weight: 32, anomaly_status: req.source_wallet.sim_serial_changed_last_72h ? 'CRITICAL' : 'NORMAL' }
          ]
        },
        jube_rules: res.jube_aml_engine.rules_triggered,
        finrobot_cot: res.finrobot_agent_trace,
        status: res.decision === 'BLOCK_IMMEDIATE' ? 'SYSTEM_BLOCKED' : 'PENDING_USER_ACTION'
      };

      setUserInterceptions(prev => [newInterception, ...prev]);
      setSelectedInterceptionId(newInterception.id);

      // Also create an immutable audit log
      const auditEntry: AuditLog = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: `api_gateway:${req.partner_id}`,
        action: res.decision === 'BLOCK_IMMEDIATE' ? 'TRANSACTION_BLOCKED' : 'USER_PRE_TX_INTERCEPTED',
        entity_type: 'PRE_TRANSACTION_INTERCEPTION',
        entity_id: newInterception.id,
        evidence_hash: res.audit_evidence_hash,
        details: `Live evaluation on ${partner.name} [${req.transaction_details.rail}] PKR ${req.transaction_details.amount.toLocaleString()}. Risk: ${res.risk_score}% (${res.risk_tier}). Decision: ${res.decision}.`
      };
      setAuditLogs(prev => [auditEntry, ...prev]);
    }

    return res;
  };

  const resolveUserInterceptionAction = (
    interceptionId: string, 
    action: 'USER_CHALLENGED_SUCCESS' | 'USER_ABORTED_SCAM'
  ) => {
    setUserInterceptions(prev => prev.map(item => {
      if (item.id === interceptionId) {
        return {
          ...item,
          status: action,
          user_reaction_time_seconds: Math.floor(8 + Math.random() * 12)
        };
      }
      return item;
    }));

    const target = userInterceptions.find(i => i.id === interceptionId);
    if (target) {
      const auditEntry: AuditLog = {
        id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
        timestamp: new Date().toISOString(),
        actor: 'user_wallet_client',
        action: action,
        entity_type: 'USER_INTERCEPTION_RESPONSE',
        entity_id: interceptionId,
        evidence_hash: `sha256:${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}`,
        details: action === 'USER_ABORTED_SCAM'
          ? `User acknowledged in-app warning on ${target.partner_name} and ABORTED scam transfer of PKR ${target.amount_pkr.toLocaleString()}. Funds preserved.`
          : `User successfully completed NADRA biometric / step-up challenge on ${target.partner_name} for PKR ${target.amount_pkr.toLocaleString()}. Transaction authorized.`
      };
      setAuditLogs(prev => [auditEntry, ...prev]);
    }
  };

  const kpis = useMemo(() => {
    const total = alerts.length;
    const highRisk = alerts.filter(a => a.customer.risk_tier === 'HIGH' || a.customer.risk_tier === 'CRITICAL').length;
    const pending = alerts.filter(a => a.status === 'NEW' || a.status === 'AI_REVIEWED' || a.status === 'HUMAN_REVIEW').length;
    
    return {
      totalAlerts24h: 35,
      highRiskRatio: Math.round((highRisk / Math.max(1, total)) * 100),
      falsePositiveReductionPct: 87.4,
      aiAcceptanceRatePct: 91.4,
      medianTriageTimeMinutes: 3.8, // down from 42 mins
      pendingReviewCount: pending,
      preTransactionInterceptionsCount: userInterceptions.length,
      scamLossesPreventedPkr: userInterceptions.reduce((sum, item) => sum + item.amount_pkr, 240000)
    };
  }, [alerts, userInterceptions]);

  return (
    <AppContext.Provider
      value={{
        alerts,
        customers,
        transactions,
        memories,
        candidateRules,
        modelRegistry,
        auditLogs,
        userInterceptions,
        selectedInterceptionId,
        selectedInterception,
        activeFintechPartner,
        selectedAlertId,
        selectedAlert,
        activeNav,
        demoMode,
        activeScenarioId,
        isSimulating,
        simulationStep,
        setActiveNav,
        setDemoMode,
        setActiveFintechPartner,
        selectInterception,
        selectAlert,
        triggerScenario,
        runSimulationStep,
        resetSimulation,
        evaluateAndInterceptTransaction,
        resolveUserInterceptionAction,
        approveRecommendation,
        overrideRecommendation,
        updateCandidateRuleStatus,
        filterAlerts,
        kpis
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
