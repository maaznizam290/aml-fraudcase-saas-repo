export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type KYCStatus = 'VERIFIED' | 'PENDING' | 'ENHANCED_DUE_DILIGENCE' | 'FLAGGED';
export type AlertType = 
  | 'RAPID_VELOCITY'
  | 'HIGH_VALUE_WIRE'
  | 'GEOLOCATION_JUMP'
  | 'STRUCTURING_SMURFING'
  | 'NEW_DEVICE_SPIKE'
  | 'SANCTION_WATCHLIST'
  | 'UNUSUAL_COUNTERPARTY';

export type CaseStatus = 
  | 'NEW'
  | 'INVESTIGATING'
  | 'AI_REVIEWED'
  | 'HUMAN_REVIEW'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'FALSE_POSITIVE';

export type Disposition = 'ESCALATE' | 'CLEAR' | 'REFER';

export interface Customer {
  id: string;
  external_id: string;
  name: string;
  email: string;
  country: string;
  city: string;
  risk_tier: RiskTier;
  kyc_status: KYCStatus;
  account_age_days: number;
  occupation: string;
  monthly_income_usd: number;
  device_fingerprint: string;
  linked_accounts_count: number;
  total_historical_alerts: number;
  avatar_seed: string;
}

export interface Transaction {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  timestamp: string;
  sender: string;
  recipient: string;
  recipient_bank: string;
  recipient_country: string;
  channel: 'ACH' | 'WIRE' | 'FASTER_PAYMENTS' | 'CARD' | 'CRYPTO_OFFRAMP';
  device_id: string;
  ip_address: string;
  location_country: string;
  location_city: string;
  status: 'SETTLED' | 'PENDING' | 'BLOCKED' | 'FLAGGED';
  is_trigger: boolean;
}

export interface MLModelBreakdown {
  isolation_forest: number; // 0 - 1
  lof: number; // Local Outlier Factor 0 - 1
  ocsvm: number; // One-Class SVM 0 - 1
  kmeans: number; // Cluster distance 0 - 1
  xgboost: number; // Supervised classifier 0 - 1
}

export interface MLPrediction {
  id: string;
  alert_id: string;
  fraud_probability: number; // 0 - 1
  anomaly_score: number; // 0 - 1
  risk_band: RiskTier;
  model_version: string;
  models_breakdown: MLModelBreakdown;
  velocity_90d_ratio: number; // e.g. 8.4x baseline
  signals: string[];
  explanation: string;
}

export interface AIRecommendation {
  id: string;
  case_id: string;
  disposition: Disposition;
  confidence: number; // 0 - 100
  riskLevel: RiskTier;
  rationale: string;
  redFlags: string[];
  supportingEvidence: string[];
  contradictoryEvidence: string[];
  recommendedNextSteps: string[];
  mlScoreAssessment: string;
  investigationSummary: string;
  generated_at: string;
  model_used: string;
}

export interface AnalystDecision {
  id: string;
  case_id: string;
  analyst_id: string;
  analyst_name: string;
  action: 'APPROVED' | 'REJECTED' | 'OVERRIDDEN';
  override_disposition?: Disposition;
  analyst_rationale: string;
  decided_at: string;
}

export interface Alert {
  id: string;
  customer_id: string;
  transaction_id: string;
  alert_type: AlertType;
  risk_score: number; // 0 - 100
  triggered_rule: string;
  status: CaseStatus;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
  created_at: string;
  customer: Customer;
  transaction: Transaction;
  ml_prediction?: MLPrediction;
  ai_recommendation?: AIRecommendation;
  analyst_decision?: AnalystDecision;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity_type: string;
  entity_id: string;
  evidence_hash: string;
  details: string;
}

export type HermesMemoryType = 'EPISODIC' | 'SEMANTIC' | 'SKILL' | 'FEEDBACK';

export interface NodeMapping {
  id: string;
  name: string;
  type: string;
  role: string;
  guardrailNote?: string;
}

export interface MLModelSpec {
  model: string;
  algorithm: string;
  role: string;
  inputFeatures: string;
  outputScore: string;
  originInRepo: string;
}

export interface HermesMemory {
  id: string;
  memory_type: HermesMemoryType;
  title: string;
  content: string;
  confidence: number;
  tags: string[];
  created_at: string;
  case_reference?: string;
}

export interface HermesCandidateRule {
  id: string;
  title: string;
  description: string;
  rule_logic: string;
  status: 'PROPOSED' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'DEPLOYED';
  impact_cases_count: number;
  proposed_at: string;
  reviewed_by?: string;
  rationale: string;
}

export interface ModelRegistryItem {
  id: string;
  model_name: string;
  version: string;
  algorithm: string;
  pr_auc: number;
  precision_score: number;
  recall_score: number;
  anomaly_threshold: number;
  latency_ms: number;
  status: 'PRODUCTION' | 'EXPERIMENTAL';
  feature_importance_top: string[];
}

export interface ScenarioDefinition {
  id: string;
  title: string;
  badge: string;
  description: string;
  alert_type: AlertType;
  customer_name: string;
  amount: number;
  expected_disposition: Disposition;
  expected_confidence: number;
  key_evidence: string;
  pitch_note: string;
}

export type MainNavTab = 
  | 'overview'
  | 'inbox'
  | 'investigate'
  | 'wallet_interceptor'
  | 'fintech_api'
  | 'hermes'
  | 'ml_registry'
  | 'simulator'
  | 'blueprints'
  | 'prompt'
  | 'budget';

export type FintechPartnerId = 'jazzcash' | 'easypaisa' | 'nayapay' | 'sadapay' | 'raast_sbp';

export type PaymentRail = 
  | 'IBFT' 
  | 'RAAST' 
  | 'WALLET_P2P' 
  | 'AGENT_CASHOUT' 
  | 'DEBIT_CARD' 
  | 'QR_MERCHANT';

export type InterceptionDecision = 'ALLOW' | 'CHALLENGE_USER' | 'BLOCK_IMMEDIATE';

export type ChallengeType = 
  | 'BIOMETRIC_NADRA' 
  | 'PIN_OTP_STEPUP' 
  | 'SCAM_WARNING_CONFIRMATION' 
  | 'COOLING_OFF_DELAY';

export interface DeveloperPratikModelResult {
  risk_tier: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  fraud_probability: number; // 0 - 100%
  inference_latency_ms: number; // e.g. 3.4ms (sub-5ms)
  random_forest_trees_flagged: number; // e.g. 94 / 100
  feature_attributions: {
    feature: string;
    value: string | number;
    contribution_weight: number;
    anomaly_status: 'NORMAL' | 'ELEVATED' | 'CRITICAL';
  }[];
}

export interface JubeAMLRuleTrigger {
  rule_id: string;
  scenario_name: string;
  category: 'VELOCITY' | 'STRUCTURING' | 'MULE_NETWORK' | 'SANCTIONS' | 'SIM_SWAP_ATO' | 'CASHOUT_SPIKE';
  threshold_condition: string;
  actual_value: string;
  severity: 'WARNING' | 'VIOLATION' | 'BLOCKING';
  sbp_regulatory_code?: string;
}

export interface FinRobotCoTTrace {
  data_cot_agent: {
    profile_retrieved: string;
    cnic_kyc_tier: string;
    baseline_velocity_daily: string;
    device_health_score: number;
  };
  concept_cot_agent: {
    peer_group_deviation: string;
    rapid_cashout_factor: string;
    mule_clustering_probability: number;
    social_engineering_pattern: string;
  };
  thesis_cot_agent: {
    executive_disposition: InterceptionDecision;
    recommended_challenge: ChallengeType | 'NONE';
    plain_english_user_warning: string;
    analyst_investigation_brief: string;
    statutory_citations: string[];
  };
}

export interface UserInterceptionEvent {
  id: string;
  timestamp: string;
  partner: FintechPartnerId;
  partner_name: string;
  user_phone: string;
  user_cnic_masked: string;
  recipient_title: string;
  recipient_identifier: string;
  recipient_bank: string;
  amount_pkr: number;
  payment_rail: PaymentRail;
  decision: InterceptionDecision;
  challenge_type?: ChallengeType;
  developer_pratik_ml: DeveloperPratikModelResult;
  jube_rules: JubeAMLRuleTrigger[];
  finrobot_cot: FinRobotCoTTrace;
  status: 'PENDING_USER_ACTION' | 'USER_CHALLENGED_SUCCESS' | 'USER_ABORTED_SCAM' | 'SYSTEM_BLOCKED';
  user_reaction_time_seconds?: number;
}

export interface EvaluateTransactionRequest {
  partner_id: FintechPartnerId;
  source_wallet: {
    account_number: string;
    cnic_masked: string;
    kyc_level: 'LEVEL_0' | 'LEVEL_1' | 'LEVEL_2_BIOMETRIC';
    device_imei: string;
    device_model: string;
    ip_address: string;
    city: string;
    sim_serial_changed_last_72h: boolean;
  };
  destination_account: {
    bank_code: string;
    account_or_iban: string;
    account_title: string;
    account_age_days: number;
    known_mule_cluster_flag: boolean;
  };
  transaction_details: {
    amount: number;
    currency: 'PKR' | 'USD';
    rail: PaymentRail;
    purpose_of_payment: string;
    timestamp?: string;
  };
}

export interface EvaluateTransactionResponse {
  transaction_id: string;
  status: 'PROCESSED';
  decision: InterceptionDecision;
  risk_score: number; // 0 - 100
  risk_tier: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  latency_ms: number;
  model_source: 'developerPratik/credit-card-fraud-detector (RandomForest)' | string;
  jube_aml_engine: {
    rules_evaluated: number;
    rules_triggered: JubeAMLRuleTrigger[];
    smurfing_score: number;
    velocity_spike_ratio: number;
  };
  finrobot_agent_trace: FinRobotCoTTrace;
  user_interception_payload: {
    must_notify_user_first: boolean;
    suggested_challenge: ChallengeType | 'NONE';
    in_app_warning_title: string;
    in_app_warning_body: string;
    victim_prevention_checklist: string[];
  };
  audit_evidence_hash: string;
}

export interface PromptConfig {
  includeDemoMode: boolean;
  includeHermes: boolean;
  includeN8n: boolean;
  includeDuckDbMl: boolean;
  includeSlackResend: boolean;
  budgetCap: number;
  targetModel: 'claude-3-7-sonnet' | 'claude-3-5-sonnet';
}

export interface DemoStep {
  step: number;
  title: string;
  actor: 'Investor' | 'System' | 'ML Service' | 'Claude AI' | 'Compliance Analyst' | 'Hermes Agent';
  action: string;
  output: string;
  metric?: string;
  investorNarration: string;
}
