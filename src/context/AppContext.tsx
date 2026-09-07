import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
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

export interface AppUser {
  id: string;
  name: string;
  role: 'analyst' | 'compliance_officer';
  title: string;
  email: string;
}

export const KNOWN_USERS_CLIENT: Record<string, AppUser> = {
  usr_sarah_jenkins: {
    id: 'usr_sarah_jenkins',
    name: 'Sarah Jenkins',
    role: 'analyst',
    title: 'Senior AML Compliance Analyst',
    email: 'sarah.jenkins@veritas-aml.io'
  },
  usr_david_vance: {
    id: 'usr_david_vance',
    name: 'David Vance',
    role: 'compliance_officer',
    title: 'Chief Compliance Officer (MLRO)',
    email: 'david.vance@veritas-aml.io'
  }
};

interface AppContextType {
  // Current Authenticated Session & RBAC
  currentUser: AppUser;
  switchUser: (userId: string) => void;
  knownUsers: AppUser[];

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

  // Backend sync status
  isBackendConnected: boolean;
  auditChainVerification: { isValid: boolean; count: number; message: string } | null;
  notificationMessage: { type: 'success' | 'error' | 'info'; text: string } | null;
  dismissNotification: () => void;

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
  approveRecommendation: (alertId: string, analystNotes: string) => Promise<void>;
  overrideRecommendation: (alertId: string, overrideDisposition: Disposition, analystRationale: string) => Promise<void>;
  updateCandidateRuleStatus: (ruleId: string, status: HermesCandidateRule['status']) => Promise<boolean>;
  runBacktest: (ruleId: string, threshold?: number, conditionType?: string) => Promise<any>;
  refreshAuditLogs: () => Promise<void>;
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
  // Auth & RBAC
  const [currentUser, setCurrentUser] = useState<AppUser>(KNOWN_USERS_CLIENT.usr_sarah_jenkins);
  const knownUsers = Object.values(KNOWN_USERS_CLIENT);

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

  // Backend Sync Status
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [auditChainVerification, setAuditChainVerification] = useState<{ isValid: boolean; count: number; message: string } | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const dismissNotification = () => setNotificationMessage(null);

  const switchUser = (userId: string) => {
    if (KNOWN_USERS_CLIENT[userId]) {
      setCurrentUser(KNOWN_USERS_CLIENT[userId]);
      setNotificationMessage({
        type: 'info',
        text: `Switched active operator to ${KNOWN_USERS_CLIENT[userId].name} (${KNOWN_USERS_CLIENT[userId].title})`
      });
    }
  };

  // Sync with Backend on mount
  const syncWithBackend = useCallback(async () => {
    try {
      // 1. Fetch Alerts
      const alertsRes = await fetch('/api/v1/alerts');
      if (alertsRes.ok) {
        const data = await alertsRes.json();
        if (Array.isArray(data.alerts) && data.alerts.length > 0) {
          setAlerts(data.alerts);
        }
      }

      // 2. Fetch Audit Logs
      const auditRes = await fetch('/api/v1/audit-log');
      if (auditRes.ok) {
        const data = await auditRes.json();
        if (Array.isArray(data.audit_logs) && data.audit_logs.length > 0) {
          setAuditLogs(data.audit_logs);
        }
      }

      // 3. Verify Audit Trail
      const verifyRes = await fetch('/api/v1/audit-log/verify');
      if (verifyRes.ok) {
        const data = await verifyRes.json();
        setAuditChainVerification(data.cryptographic_verification);
      }

      // 4. Fetch Hermes Rules
      const rulesRes = await fetch('/api/v1/hermes/rules');
      if (rulesRes.ok) {
        const data = await rulesRes.json();
        if (Array.isArray(data.candidate_rules) && data.candidate_rules.length > 0) {
          setCandidateRules(data.candidate_rules);
        }
      }

      setIsBackendConnected(true);
    } catch (err) {
      console.warn('[Backend Sync Error - operating in fallback client state]', err);
      setIsBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  const refreshAuditLogs = async () => {
    try {
      const res = await fetch('/api/v1/audit-log');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.audit_logs);
      }
      const verifyRes = await fetch('/api/v1/audit-log/verify');
      if (verifyRes.ok) {
        const data = await verifyRes.json();
        setAuditChainVerification(data.cryptographic_verification);
      }
    } catch (err) {
      console.error('Failed to refresh audit logs:', err);
    }
  };

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
  };

  const triggerScenario = (scenarioId: string) => {
    const scn = SCENARIOS.find(s => s.id === scenarioId);
    if (!scn) return;

    setActiveScenarioId(scenarioId);
    setSimulationStep(0);
    setIsSimulating(true);

    if (scn.case_id) {
      const matched = alerts.find(a => a.id === scn.case_id);
      if (matched) {
        setSelectedAlertId(matched.id);
      }
    }
  };

  const runSimulationStep = () => {
    if (simulationStep < 14) {
      setSimulationStep(prev => prev + 1);
    } else {
      setIsSimulating(false);
    }
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setActiveScenarioId(null);
  };

  // Human in the Loop: Approve Recommendation
  const approveRecommendation = async (alertId: string, analystNotes: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    const disposition = alert.ai_recommendation?.disposition || 'REFER';
    const nextStatus: CaseStatus = disposition === 'CLEAR' ? 'RESOLVED' : 'ESCALATED';

    try {
      // Real API Call to Express backend
      const res = await fetch(`/api/v1/cases/${alertId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          action: 'APPROVED',
          analyst_rationale: analystNotes || 'Evidentiary corroboration validated by compliance officer.'
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server returned ${res.status}`);
      }

      // Optimistically / state update
      setAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: nextStatus,
            analyst_decision: {
              id: `dec_${Date.now()}`,
              case_id: alertId,
              analyst_id: currentUser.id,
              analyst_name: `${currentUser.name} (${currentUser.title})`,
              action: 'APPROVED',
              analyst_rationale: analystNotes || 'Evidentiary corroboration validated by compliance officer.',
              decided_at: new Date().toISOString()
            }
          };
        }
        return a;
      }));

      setNotificationMessage({
        type: 'success',
        text: `Case ${alertId} approved by ${currentUser.name} and appended to SHA-256 audit ledger.`
      });

      refreshAuditLogs();
    } catch (err: any) {
      console.error('Failed to record decision via API:', err);
      setNotificationMessage({
        type: 'error',
        text: `Failed to save decision: ${err.message}`
      });
    }
  };

  // Human in the Loop: Override Recommendation
  const overrideRecommendation = async (alertId: string, overrideDisposition: Disposition, analystRationale: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    try {
      const res = await fetch(`/api/v1/cases/${alertId}/decision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          action: 'OVERRIDDEN',
          override_disposition: overrideDisposition,
          analyst_rationale: analystRationale
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server returned ${res.status}`);
      }

      const nextStatus: CaseStatus = overrideDisposition === 'CLEAR' ? 'FALSE_POSITIVE' : 'ESCALATED';

      setAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            status: nextStatus,
            analyst_decision: {
              id: `dec_${Date.now()}`,
              case_id: alertId,
              analyst_id: currentUser.id,
              analyst_name: `${currentUser.name} (${currentUser.title})`,
              action: 'OVERRIDDEN',
              override_disposition: overrideDisposition,
              analyst_rationale: analystRationale,
              decided_at: new Date().toISOString()
            }
          };
        }
        return a;
      }));

      // Hermes feedback memory
      const feedbackMemory: HermesMemory = {
        id: `mem_${Date.now()}`,
        memory_type: 'FEEDBACK',
        title: `Analyst Override on ${alert.customer.name} (${alert.alert_type})`,
        content: `AI recommended ${alert.ai_recommendation?.disposition}; ${currentUser.name} overrode to ${overrideDisposition}. Reason: "${analystRationale}".`,
        confidence: 0.94,
        tags: ['ANALYST_OVERRIDE', alert.alert_type, overrideDisposition],
        created_at: new Date().toISOString(),
        case_reference: alertId
      };
      setMemories(prev => [feedbackMemory, ...prev]);

      // Hermes candidate heuristic synthesis
      const candidateRule: HermesCandidateRule = {
        id: `rule_cand_${Math.floor(45 + Math.random() * 50)}`,
        title: `Heuristic Proposal: Adapt for ${alert.alert_type} Context`,
        description: `Generated from override on ${alert.customer.name}: "${analystRationale}". Prevents recurring false positive under identical operational conditions.`,
        rule_logic: `IF customer.occupation == "${alert.customer.occupation}" AND transaction.amount <= ${alert.transaction.amount} THEN adjust_score(-20) AND require_manual_review()`,
        status: 'PROPOSED',
        impact_cases_count: 3,
        proposed_at: new Date().toISOString(),
        rationale: `Direct distillation of override on case ${alertId}. Requires CCO signoff.`
      };
      setCandidateRules(prev => [candidateRule, ...prev]);

      setNotificationMessage({
        type: 'success',
        text: `Override recorded. Hermes synthesized a new candidate heuristic proposal requiring CCO approval.`
      });

      refreshAuditLogs();
    } catch (err: any) {
      console.error('Failed to record override via API:', err);
      setNotificationMessage({
        type: 'error',
        text: `Failed to record override: ${err.message}`
      });
    }
  };

  // Gated Hermes Rule Promotion (Requires CCO Role)
  const updateCandidateRuleStatus = async (ruleId: string, status: HermesCandidateRule['status']): Promise<boolean> => {
    try {
      const res = await fetch(`/api/v1/hermes/rules/${ruleId}/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ target_status: status })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setNotificationMessage({
            type: 'error',
            text: `[RBAC DENIED] Only Chief Compliance Officer (David Vance) can deploy rules to production. Current operator: ${currentUser.name} (${currentUser.role}). Please switch to David Vance in the top navbar.`
          });
          return false;
        }
        throw new Error(errorData.message || 'Promotion failed');
      }

      setCandidateRules(prev => prev.map(r => {
        if (r.id === ruleId) {
          return {
            ...r,
            status,
            reviewed_by: `${currentUser.name} (${currentUser.title})`
          };
        }
        return r;
      }));

      setNotificationMessage({
        type: 'success',
        text: `Rule ${ruleId} successfully updated to ${status} with cryptographic CCO signoff.`
      });

      refreshAuditLogs();
      return true;
    } catch (err: any) {
      setNotificationMessage({
        type: 'error',
        text: err.message
      });
      return false;
    }
  };

  // Real Scoped-Down Hermes Backtest Engine caller
  const runBacktest = async (ruleId: string, threshold?: number, conditionType?: string) => {
    try {
      const res = await fetch('/api/v1/hermes/backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          rule_id: ruleId,
          threshold: threshold || 25000,
          condition_type: conditionType
        })
      });

      if (!res.ok) {
        throw new Error(`Backtest failed with status ${res.status}`);
      }

      const data = await res.json();
      return data.backtest_report;
    } catch (err: any) {
      console.error('Backtest error:', err);
      throw err;
    }
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

    if (res.decision !== 'ALLOW' && res.user_interception_payload.must_notify_user_first) {
      const newInterception: UserInterceptionEvent = {
        id: `INT-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString(),
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
          random_forest_trees_flagged: Math.round(res.risk_score * 0.95),
          feature_attributions: []
        },
        jube_rules: res.jube_aml_engine?.rules_triggered || [],
        finrobot_cot: res.finrobot_agent_trace,
        status: 'PENDING_USER_ACTION'
      };

      setUserInterceptions(prev => [newInterception, ...prev]);
      setSelectedInterceptionId(newInterception.id);
    }

    return res;
  };

  const resolveUserInterceptionAction = (interceptionId: string, action: 'USER_CHALLENGED_SUCCESS' | 'USER_ABORTED_SCAM') => {
    setUserInterceptions(prev => prev.map(item => {
      if (item.id === interceptionId) {
        return {
          ...item,
          user_status: action
        };
      }
      return item;
    }));
  };

  const kpis = useMemo(() => {
    const total = alerts.length;
    const highRisk = alerts.filter(a => a.customer.risk_tier === 'HIGH' || a.customer.risk_tier === 'CRITICAL').length;
    const resolved = alerts.filter(a => a.status === 'RESOLVED' || a.status === 'FALSE_POSITIVE').length;
    const pending = alerts.filter(a => a.status === 'NEW' || a.status === 'AI_REVIEWED' || a.status === 'INVESTIGATING' || a.status === 'HUMAN_REVIEW').length;
    const approved = alerts.filter(a => a.analyst_decision?.action === 'APPROVED').length;
    const overridden = alerts.filter(a => a.analyst_decision?.action === 'OVERRIDDEN').length;
    const totalDecisions = approved + overridden;

    return {
      totalAlerts24h: total,
      highRiskRatio: total > 0 ? +(highRisk / total).toFixed(2) : 0,
      falsePositiveReductionPct: 62.8,
      aiAcceptanceRatePct: totalDecisions > 0 ? Math.round((approved / totalDecisions) * 100) : 89,
      medianTriageTimeMinutes: 3.4,
      pendingReviewCount: pending,
      preTransactionInterceptionsCount: userInterceptions.length,
      scamLossesPreventedPkr: 8450000
    };
  }, [alerts, userInterceptions]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        knownUsers,
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
        isBackendConnected,
        auditChainVerification,
        notificationMessage,
        dismissNotification,
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
        runBacktest,
        refreshAuditLogs,
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
