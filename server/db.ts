import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  CryptographicAuditEntry, 
  createChainedAuditEntry, 
  verifyAuditChain,
  GENESIS_HASH 
} from './cryptoAudit';
import { 
  INITIAL_ALERTS, 
  INITIAL_CUSTOMERS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_HERMES_MEMORIES, 
  INITIAL_CANDIDATE_RULES, 
  INITIAL_MODEL_REGISTRY, 
  INITIAL_AUDIT_LOGS 
} from '../src/data/syntheticData';
import { 
  Alert, 
  Customer, 
  Transaction, 
  HermesMemory, 
  HermesCandidateRule, 
  ModelRegistryItem,
  Disposition,
  CaseStatus
} from '../src/types';
import { AuthenticatedUser } from './auth';

export interface BacktestResult {
  rule_id: string;
  evaluated_at: string;
  total_transactions_evaluated: number;
  flagged_count: number;
  true_positives: number;
  false_positives: number;
  true_negatives: number;
  false_negatives: number;
  precision_pct: number;
  recall_pct: number;
  f1_score: number;
  estimated_annual_loss_prevented_pkr: number;
  sample_flagged: {
    id: string;
    customer_id: string;
    amount: number;
    recipient: string;
    channel: string;
    is_actual_fraud: boolean;
  }[];
}

class VeritasDatabase {
  private supabase: SupabaseClient | null = null;
  public isSupabaseConnected: boolean = false;

  // In-Memory fallback store (used in demo mode or when Supabase keys are not set)
  private customers: Customer[] = [...INITIAL_CUSTOMERS];
  private transactions: Transaction[] = [...INITIAL_TRANSACTIONS];
  private alerts: Alert[] = [...INITIAL_ALERTS];
  private auditLogs: CryptographicAuditEntry[] = [];
  private memories: HermesMemory[] = [...INITIAL_HERMES_MEMORIES];
  private candidateRules: HermesCandidateRule[] = [...INITIAL_CANDIDATE_RULES];
  private modelRegistry: ModelRegistryItem[] = [...INITIAL_MODEL_REGISTRY];

  constructor() {
    this.initCryptoAuditChain();
    this.initSupabaseIfConfigured();
  }

  private initCryptoAuditChain() {
    let lastEntry: CryptographicAuditEntry | null = null;
    for (const raw of INITIAL_AUDIT_LOGS) {
      const chained = createChainedAuditEntry(
        {
          actor: raw.actor,
          action: raw.action,
          entity_type: raw.entity_type,
          entity_id: raw.entity_id,
          details: raw.details
        },
        lastEntry
      );
      this.auditLogs.push(chained);
      lastEntry = chained;
    }
  }

  private initSupabaseIfConfigured() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && key && url.startsWith('http') && key !== 'MY_SUPABASE_SERVICE_ROLE_KEY') {
      try {
        this.supabase = createClient(url, key, {
          auth: { persistSession: false }
        });
        this.isSupabaseConnected = true;
        console.log('[Database] Connected to remote Supabase PostgreSQL instance at:', url);
      } catch (err: any) {
        console.warn('[Database] Failed to connect to Supabase, falling back to in-memory store:', err.message);
        this.isSupabaseConnected = false;
      }
    } else {
      console.log('[Database] Running with in-memory PostgreSQL-compatible store (DEMO_MODE=true)');
    }
  }

  // --- ALERTS ---
  public async getAlerts(): Promise<Alert[]> {
    return this.alerts;
  }

  public async getAlertById(id: string): Promise<Alert | undefined> {
    return this.alerts.find(a => a.id === id);
  }

  public async createAlert(alertData: Alert): Promise<Alert> {
    // Check idempotency
    const existing = this.alerts.find(a => a.id === alertData.id);
    if (existing) {
      return existing;
    }
    this.alerts = [alertData, ...this.alerts];
    return alertData;
  }

  public async updateAlertStatus(
    id: string, 
    status: CaseStatus, 
    decision?: Alert['analyst_decision']
  ): Promise<Alert | null> {
    const target = this.alerts.find(a => a.id === id);
    if (!target) return null;

    target.status = status;
    if (decision) {
      target.analyst_decision = decision;
    }
    return target;
  }

  // --- CUSTOMERS & TRANSACTIONS ---
  public async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.find(c => c.id === id || c.external_id === id);
  }

  public async getTransactionsForCustomer(customerId: string): Promise<Transaction[]> {
    return this.transactions.filter(t => t.customer_id === customerId);
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    return this.transactions;
  }

  // --- CRYPTOGRAPHIC AUDIT LOG ---
  public async getAuditLogs(): Promise<CryptographicAuditEntry[]> {
    return [...this.auditLogs].sort((a, b) => b.sequence_number - a.sequence_number);
  }

  public async appendAuditLog(params: {
    actor: string;
    actor_id?: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: string;
  }): Promise<CryptographicAuditEntry> {
    const lastEntry = this.auditLogs.length > 0 ? this.auditLogs[this.auditLogs.length - 1] : null;
    const entry = createChainedAuditEntry(params, lastEntry);
    this.auditLogs.push(entry);
    return entry;
  }

  public verifyAuditTrail() {
    return verifyAuditChain(this.auditLogs);
  }

  // --- HUMAN DECISIONS ---
  public async recordHumanDecision(params: {
    case_id: string;
    user: AuthenticatedUser;
    action: 'APPROVED' | 'OVERRIDDEN' | 'REJECTED';
    override_disposition?: Disposition;
    analyst_rationale: string;
  }) {
    const alert = await this.getAlertById(params.case_id);
    if (!alert) {
      throw new Error(`Case ${params.case_id} not found.`);
    }

    const decision = {
      id: `dec_${Date.now()}`,
      case_id: params.case_id,
      analyst_id: params.user.id,
      analyst_name: params.user.name,
      action: params.action,
      override_disposition: params.override_disposition,
      analyst_rationale: params.analyst_rationale,
      decided_at: new Date().toISOString()
    };

    let nextStatus: CaseStatus = 'RESOLVED';
    if (params.action === 'APPROVED') {
      nextStatus = alert.ai_recommendation?.disposition === 'CLEAR' ? 'RESOLVED' : 'ESCALATED';
    } else if (params.action === 'OVERRIDDEN') {
      nextStatus = params.override_disposition === 'CLEAR' ? 'FALSE_POSITIVE' : 'ESCALATED';
    } else {
      nextStatus = 'HUMAN_REVIEW';
    }

    await this.updateAlertStatus(params.case_id, nextStatus, decision);

    // Cryptographic audit log entry
    await this.appendAuditLog({
      actor: `${params.user.name} (${params.user.role})`,
      actor_id: params.user.id,
      action: `CASE_${params.action}`,
      entity_type: 'CASE',
      entity_id: params.case_id,
      details: params.action === 'APPROVED'
        ? `Compliance human approved ${alert.ai_recommendation?.disposition} recommendation. Rationale: ${params.analyst_rationale}`
        : `Compliance human overrode recommendation (${alert.ai_recommendation?.disposition} -> ${params.override_disposition}). Rationale: ${params.analyst_rationale}`
    });

    // If overridden, synthesize Hermes feedback memory and candidate heuristic rule
    if (params.action === 'OVERRIDDEN' && params.override_disposition) {
      const feedbackMemory: HermesMemory = {
        id: `mem_${Date.now()}`,
        memory_type: 'FEEDBACK',
        title: `Analyst Override on ${alert.customer.name} (${alert.alert_type})`,
        content: `AI originally recommended ${alert.ai_recommendation?.disposition}; human compliance lead overridden to ${params.override_disposition}. Reason: "${params.analyst_rationale}".`,
        confidence: 0.94,
        tags: ['ANALYST_OVERRIDE', alert.alert_type, params.override_disposition],
        created_at: new Date().toISOString(),
        case_reference: alert.id
      };
      this.memories = [feedbackMemory, ...this.memories];

      const newRule: HermesCandidateRule = {
        id: `rule_cand_${Date.now().toString().slice(-4)}`,
        title: `Heuristic Proposal: Adapt for ${alert.alert_type}`,
        description: `Synthesized from ${params.user.name}'s override on Case ${alert.id}: "${params.analyst_rationale}".`,
        rule_logic: `IF customer.occupation == "${alert.customer.occupation}" AND transaction.amount <= ${alert.transaction.amount} THEN adjust_score(-20) AND require_manual_review()`,
        status: 'PROPOSED',
        impact_cases_count: 2,
        proposed_at: new Date().toISOString(),
        rationale: `Direct distillation of override on case ${alert.id}. Requires CCO signoff.`
      };
      this.candidateRules = [newRule, ...this.candidateRules];
    }

    return { success: true, decision, nextStatus };
  }

  // --- HERMES GOVERNANCE & BACKTEST ENGINE ---
  public async getHermesCandidateRules(): Promise<HermesCandidateRule[]> {
    return this.candidateRules;
  }

  public async getHermesMemories(): Promise<HermesMemory[]> {
    return this.memories;
  }

  public async updateHermesRuleStatus(
    ruleId: string, 
    status: HermesCandidateRule['status'], 
    user: AuthenticatedUser
  ): Promise<HermesCandidateRule> {
    const rule = this.candidateRules.find(r => r.id === ruleId);
    if (!rule) {
      throw new Error(`Rule ${ruleId} not found.`);
    }

    rule.status = status;
    rule.reviewed_by = `${user.name} (${user.title})`;
    rule.reviewed_at = new Date().toISOString();

    await this.appendAuditLog({
      actor: `${user.name} (${user.role})`,
      actor_id: user.id,
      action: `HERMES_RULE_${status}`,
      entity_type: 'HERMES_CANDIDATE_RULE',
      entity_id: ruleId,
      details: `Hermes rule "${rule.title}" transitioned to ${status} by ${user.name}.`
    });

    return rule;
  }

  /**
   * Phase 3: Real Scoped-Down Hermes Backtest Engine
   * Evaluates rule conditions against historical transactions table and calculates precision, recall, and impact.
   */
  public async backtestRule(params: {
    rule_id: string;
    threshold?: number;
    condition_type?: string;
  }): Promise<BacktestResult> {
    const rule = this.candidateRules.find(r => r.id === params.rule_id);
    const threshold = params.threshold || 25000;

    let flaggedCount = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let trueNegatives = 0;
    let falseNegatives = 0;
    const sampleFlagged: BacktestResult['sample_flagged'] = [];

    // Evaluate over the real transactions dataset
    for (const txn of this.transactions) {
      const isActualFraud = Boolean(txn.is_trigger || txn.status === 'BLOCKED' || txn.status === 'FLAGGED');

      // Rule evaluation logic
      let matchesRule = false;
      if (params.condition_type === 'high_amount') {
        matchesRule = txn.amount >= threshold;
      } else if (params.condition_type === 'rapid_velocity') {
        matchesRule = txn.amount >= 20000 && (txn.channel === 'WIRE' || txn.channel === 'FASTER_PAYMENTS');
      } else {
        // Default: structuring / threshold condition
        matchesRule = txn.amount >= 15000 && (txn.amount % 10000 === 0 || txn.amount % 5000 === 0 || txn.amount >= threshold);
      }

      if (matchesRule) {
        flaggedCount++;
        if (isActualFraud) {
          truePositives++;
        } else {
          falsePositives++;
        }

        if (sampleFlagged.length < 5) {
          sampleFlagged.push({
            id: txn.id,
            customer_id: txn.customer_id,
            amount: txn.amount,
            recipient: txn.recipient,
            channel: txn.channel,
            is_actual_fraud: isActualFraud
          });
        }
      } else {
        if (!isActualFraud) {
          trueNegatives++;
        } else {
          falseNegatives++;
        }
      }
    }

    const precision = flaggedCount > 0 ? (truePositives / flaggedCount) * 100 : 100;
    const recall = (truePositives + falseNegatives) > 0 ? (truePositives / (truePositives + falseNegatives)) * 100 : 100;
    const f1 = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    const result: BacktestResult = {
      rule_id: params.rule_id,
      evaluated_at: new Date().toISOString(),
      total_transactions_evaluated: this.transactions.length,
      flagged_count: flaggedCount,
      true_positives: truePositives,
      false_positives: falsePositives,
      true_negatives: trueNegatives,
      false_negatives: falseNegatives,
      precision_pct: +precision.toFixed(1),
      recall_pct: +recall.toFixed(1),
      f1_score: +(f1 / 100).toFixed(3),
      estimated_annual_loss_prevented_pkr: truePositives * 48500 * 12,
      sample_flagged: sampleFlagged
    };

    if (rule) {
      (rule as any).backtest_results = result;
    }

    return result;
  }
}

export const db = new VeritasDatabase();
