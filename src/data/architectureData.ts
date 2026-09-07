import { DemoStep, MLModelSpec, NodeMapping } from '../types';

export const RESEARCH_FINDINGS = {
  title: "Where FinTech Actually Breaks: 2024–2026 Analysis",
  sourceCount: "4 Cross-Referenced Industry & Academic Studies (FATF, Alloy, CBUAE, World Journal)",
  consensusProblem: "Financial Crime & AML/KYC Controls are the industry's most expensive chronic illness.",
  falsePositiveRate: "85% – 95% of rule-based alerts are false positives",
  keyWarning: "Never deploy an agent to replace a control. Deploy the agent to strengthen the evidence behind a control.",
  tiers: [
    {
      tier: "Tier 1 — Deploy Now (MVP Core)",
      status: "ACTIVE_IN_MVP",
      color: "emerald",
      badge: "Approved for Production",
      workflows: "AML alert triage & enrichment, fraud case investigation, KYC document cross-matching, transaction velocity calculation.",
      agentRole: "Gathers evidence across 4 siloed sources, computes ML anomaly scores, drafts disposition (ESCALATE | CLEAR | REFER) with exact field citations.",
      humanControl: "MANDATORY: Human compliance analyst approves or overrides every adverse action. Agent output is recommendation-only."
    },
    {
      tier: "Tier 2 — Pilot With Guardrails (6–12 Mo)",
      status: "ROADMAP",
      color: "blue",
      badge: "Controlled Pilot",
      workflows: "Continuous KYC/KYB monitoring, counterparty risk graph expansion, regulatory-change tracking.",
      agentRole: "Monitors transaction feeds 24/7, flags anomalous behavior drifts, prepares periodic re-certification dossiers.",
      humanControl: "Human reviews before any external customer communication or risk profile reclassification."
    },
    {
      tier: "Tier 3 — Do Not Automate Yet",
      status: "RESTRICTED",
      color: "rose",
      badge: "Strictly Prohibited",
      workflows: "Autonomous account closures, credit/loan denials, SAR/STR regulatory filings, fund freezes, automated fund movement.",
      agentRole: "STRICTLY BANNED from taking unilateral action. Tooling is strictly limited to assembling evidentiary case files.",
      humanControl: "100% human discretion required by global regulators (FinCEN, FCA, CBUAE, FATF)."
    }
  ]
};

export const N8N_NODES: NodeMapping[] = [
  { id: "1", name: "Alert Intake (Webhook)", type: "n8n Webhook POST", role: "Ingests transaction alerts from Core Banking / Payment Gateway in real time.", guardrailNote: "Validates HMAC signature and payload schema." },
  { id: "2", name: "Normalize Alert Data", type: "n8n Set Node", role: "Extracts standardized alertId, customerId, amount, ruleId, and timestamp.", guardrailNote: "Sanitizes fields, strips PII before log propagation." },
  { id: "3", name: "Fetch Transaction History", type: "HTTP Request", role: "Pulls 90-day transaction history, baseline velocities, and previous peer transfers.", guardrailNote: "Read-only query to internal Core Banking / Ledger." },
  { id: "4", name: "Fetch Sanctions & Watchlists", type: "HTTP Request", role: "Screens customer and counterparties against OFAC, FATF, and PEP databases.", guardrailNote: "Returns exact match score or clean token." },
  { id: "5", name: "Fetch Customer KYC Profile", type: "HTTP Request", role: "Retrieves verified identity, declared occupation, expected monthly volume, and risk tier.", guardrailNote: "Access restricted via tokenized internal endpoint." },
  { id: "6", name: "Prepare ML Features", type: "Code Node (JS)", role: "Constructs feature vector (Amount, Velocity ratio, Geo-delta, V1–V28 PCA factors).", guardrailNote: "Fails gracefully with zero-padded vector if fields missing." },
  { id: "7", name: "ML Fraud Score (Inference)", type: "HTTP Request", role: "Calls Hugging Face / Python ML microservice for anomaly score and fraud probability.", guardrailNote: "Score is treated as ONE piece of evidence, NEVER a final verdict." },
  { id: "8", name: "Combine Evidence", type: "n8n Merge Node", role: "Synchronizes the 4 asynchronous data branches into a single consolidated payload.", guardrailNote: "Enforces timeout protection (max 2500ms)." },
  { id: "9", name: "Build Evidence Package", type: "Code Node (JS)", role: "Synthesizes data into structured JSON with explicit citation IDs.", guardrailNote: "Formats prompt for Anthropic Claude Sonnet." },
  { id: "10", name: "Claude — Draft Recommendation", type: "HTTP Request (Anthropic)", role: "Generates cited disposition (ESCALATE | CLEAR | REFER) with confidence score.", guardrailNote: "Strict JSON response mode, temperature 0.1." },
  { id: "11", name: "Parse AI Recommendation", type: "Code Node (JS)", role: "Validates JSON schema; maps confidence, red flags, and corroboration.", guardrailNote: "If JSON fails parsing, automatically defaults to REFER/MANUAL_REVIEW." },
  { id: "12", name: "Log Audit Trail (Initial)", type: "Postgres / Sheets", role: "Records immutable snapshot of evidence and Claude's recommendation before human view.", guardrailNote: "Append-only table; cannot be modified." },
  { id: "13", name: "Human Review & Approval (Slack / UI)", type: "Slack Interactive / UI", role: "Presents decision card with buttons: [Approve], [Reject / Override], [Request Info].", guardrailNote: "PAUSES WORKFLOW until authenticated human responds." },
  { id: "14", name: "Check Human Decision", type: "n8n IF Node", role: "Branches execution based on whether analyst accepted or rejected the recommendation.", guardrailNote: "Captures mandatory analyst override reason." },
  { id: "15", name: "Execute Approved Disposition", type: "HTTP Request", role: "Updates Case Management status and triggers operational alerts.", guardrailNote: "Only triggers AFTER human authentication." },
  { id: "16", name: "Hermes Feedback Dispatch", type: "HTTP Request", role: "Dispatches case outcome, evidence vector, and analyst override rationale to Hermes agent.", guardrailNote: "Feeds Hermes self-learning memory loop." }
];

export const ML_MODELS: MLModelSpec[] = [
  {
    model: "Isolation Forest",
    algorithm: "Tree-based Ensemble Anomaly Isolation",
    role: "Unsupervised outlier detection for high-dimensional transaction bursts.",
    inputFeatures: "Amount, Time-delta, 24h Velocity, Geo-distance, V1-V28 PCA",
    outputScore: "Anomaly Score (-1.0 to +1.0 normalized to 0–100%)",
    originInRepo: "Claude-Fraud-Detection / models/unsupervised/isolation_forest.py"
  },
  {
    model: "Local Outlier Factor (LOF)",
    algorithm: "Density-based Local Anomaly Scoring",
    role: "Identifies transactions isolated from the customer's typical behavioral cluster.",
    inputFeatures: "Rolling 30-day mean, standard deviation deviation, merchant category",
    outputScore: "Local outlier factor ratio",
    originInRepo: "Claude-Fraud-Detection / models/unsupervised/lof_model.py"
  },
  {
    model: "One-Class SVM (OCSVM)",
    algorithm: "Support Vector Kernel Boundary",
    role: "Separates legitimate transaction manifold from rare extreme edge cases.",
    inputFeatures: "Normalized multi-factor transaction vectors",
    outputScore: "Distance from boundary hyperplane",
    originInRepo: "Claude-Fraud-Detection / models/unsupervised/one_class_svm.py"
  },
  {
    model: "XGBoost Supervised Baseline",
    algorithm: "Gradient Boosted Decision Trees",
    role: "Calibrated fraud probability prediction using historical labeled fraud runs.",
    inputFeatures: "14 tabular features + 28 PCA components + DuckDB aggregates",
    outputScore: "Fraud Probability (0.00 to 1.00)",
    originInRepo: "Claude-Fraud-Detection / models/supervised/xgboost_pipeline.py"
  },
  {
    model: "DuckDB Analytical Engine",
    algorithm: "In-Memory Columnar Vectorized SQL",
    role: "Sub-millisecond sliding-window feature aggregation over 500k+ transactions.",
    inputFeatures: "Raw transaction stream, customer device tables",
    outputScore: "Engineered feature tables (Velocity, Ratios, Spikes)",
    originInRepo: "Claude-Fraud-Detection / data_pipeline/duckdb_feature_store.py"
  }
];

export const HERMES_AGENT_ARCHITECTURE = {
  framework: "Hermes Agent by Nous Research",
  url: "https://hermes-agent.nousresearch.com/",
  corePrinciple: "Continuous Institutional Learning with Human Governance",
  memoryTiers: [
    {
      type: "Episodic Memory",
      storage: "PostgreSQL (Supabase) + Vector Embeddings",
      content: "Complete investigation case histories, alert context, ML signals, Claude reasoning, and final analyst disposition.",
      useCase: "Finds similar historical investigations when evaluating novel transaction patterns."
    },
    {
      type: "Semantic & Typology Memory",
      storage: "Structured Knowledge Graph / Catalog",
      content: "Known financial crime topologies (e.g., 'Mule Account Funneling', 'Cross-Border Smurfing', 'Synthetic Identity Flip').",
      useCase: "Supplies contextual fraud typologies to Claude's system prompt to ground reasoning."
    },
    {
      type: "Skill Memory (Reusable Procedures)",
      storage: "Executable Workflow & Heuristic Registry",
      content: "Step-by-step investigation procedures refined over time (e.g., 'If high-value wire to UAE within 2h of password reset, inspect device carrier').",
      useCase: "Provides structured analytical checklists to junior compliance analysts."
    },
    {
      type: "Feedback & Correction Memory",
      storage: "Analyst Decision Log & Override Reasons",
      content: "Structured log of every instance where an analyst rejected or modified Claude's recommendation.",
      useCase: "Prevents repeating false-positive classifications on verified benign corporate accounts."
    }
  ],
  governancePipeline: [
    { stage: "1. Reflection Trigger", desc: "Triggered on case resolution; Hermes compares initial AI recommendation against final human analyst action." },
    { stage: "2. Pattern Detection", desc: "Identifies recurrent themes across 5+ similar decisions (e.g., 'Corporate accounts with holiday sales spikes are being over-flagged')." },
    { stage: "3. Heuristic Proposal (PROPOSED)", desc: "Hermes formulates a concrete candidate heuristic without altering production rules." },
    { stage: "4. Human Review (IN_REVIEW)", desc: "Compliance Officer evaluates the candidate rule in the AI Learning Dashboard with backtested impact." },
    { stage: "5. Versioned Deployment (APPROVED)", desc: "Approved heuristics are version-tagged, cryptographically hashed, and merged into production prompts." }
  ]
};

export const INVESTOR_DEMO_STEPS: DemoStep[] = [
  {
    step: 1,
    title: "Executive Cockpit & Alert Baseline",
    actor: "Investor",
    action: "Opens SaaS Dashboard. Observes 23 pending alerts, 91.4% AI recommendation acceptance rate, and 3.8 min median triage time.",
    output: "Clean enterprise fintech dashboard with live alert feeds and risk distribution charts.",
    metric: "42 min -> 3.8 min triage time reduction",
    investorNarration: "'Notice the density and restrained enterprise aesthetic. This isn't a toy chatbot—it's an operational mission control for Tier 1 compliance teams.'"
  },
  {
    step: 2,
    title: "Live Suspicious Transaction Ingestion",
    actor: "Investor",
    action: "Clicks 'Simulate Suspicious Transaction' in the demo control bar (Scenario: Rapid Velocity / Card Smurfing).",
    output: "System dispatches webhook payload containing 8 micro-transfers totaling $14,200 in 11 minutes.",
    metric: "Instant webhook trigger (<150ms)",
    investorNarration: "'We just simulated a live transaction alert hitting our n8n orchestration webhook from core banking.'"
  },
  {
    step: 3,
    title: "Automated Evidence Sourcing",
    actor: "System",
    action: "Parallel workers query 90-day ledger, KYC profile, and OFAC/Sanctions database simultaneously.",
    output: "Sanctions: Clear | KYC: Retail tier ($5k expected/mo) | 90d Baseline: 1.8 txns/week.",
    metric: "4 parallel API queries executed in 320ms",
    investorNarration: "'In legacy banks, an analyst opens 4 separate browser tabs and takes 25 minutes just to copy-paste this evidence.'"
  },
  {
    step: 4,
    title: "Python ML Anomaly & Fraud Scoring",
    actor: "ML Service",
    action: "DuckDB calculates rolling velocity spike; Isolation Forest & XGBoost compute anomaly confidence.",
    output: "Fraud Probability: 89.2% | Anomaly Score: 93.5% | Velocity Spike: 7.8x normal baseline.",
    metric: "DuckDB sub-millisecond calculation",
    investorNarration: "'Our ML pipeline isn't a random fake number. It calculates true isolation forest outliers and velocity standard deviations.'"
  },
  {
    step: 5,
    title: "Anthropic Claude Evidence Synthesis",
    actor: "Claude AI",
    action: "Claude processes the evidence package and outputs strict JSON with cited red flags.",
    output: "Recommendation: ESCALATE (92% Confidence) | 3 explicit red flags with line-item citations.",
    metric: "100% structured JSON compliance",
    investorNarration: "'Claude functions as our senior triage copilot. Notice it does not make the final call—it prepares an airtight evidence brief.'"
  },
  {
    step: 6,
    title: "Interactive Investigation Workspace",
    actor: "Compliance Analyst",
    action: "Investigates the case timeline: maps geolocation jump, counterparty neobank off-ramps, and device changes.",
    output: "Interactive chronological timeline with color-coded risk markers and evidence drawer.",
    metric: "Zero vague statements ('Why?' breakdown)",
    investorNarration: "'Every claim is cited. If Claude says 'unrecognized device', it points directly to Device_ID #90214.'"
  },
  {
    step: 7,
    title: "Human-in-the-Loop Disposition",
    actor: "Investor",
    action: "Clicks 'Approve Recommendation' and adds note: 'Confirmed velocity smurfing with offshore neobank recipient.'",
    output: "Case status transitions to RESOLVED (ESCALATED). Webhook dispatches action to case management.",
    metric: "Tier 1 Regulatory Compliance (Full Human Sign-off)",
    investorNarration: "'Here is the critical regulatory boundary: a human signed off. We comply with FinCEN, FCA, and CBUAE guidance from day one.'"
  },
  {
    step: 8,
    title: "Cryptographic Immutable Audit Logging",
    actor: "System",
    action: "Appends complete execution record (alert, evidence hash, ML score, prompt, analyst ID, timestamp) to Postgres.",
    output: "Audit Log entry created: #AUD-2026-90412.",
    metric: "100% auditable record for bank regulators",
    investorNarration: "'Regulators love this: any auditor can reconstruct exactly what the AI saw and what the human decided.'"
  },
  {
    step: 9,
    title: "Hermes Agent Self-Learning Ingestion",
    actor: "Hermes Agent",
    action: "Hermes ingests case resolution, extracts behavioral signature, and indexes pattern into Episodic Memory.",
    output: "New pattern logged: 'Rapid micro-velocity with newly created recipient accounts.'",
    metric: "Continuous learning loop without model retraining",
    investorNarration: "'Now watch what makes this a 10x company: Nous Research Hermes Agent just recorded the outcome into institutional memory.'"
  },
  {
    step: 10,
    title: "AI Learning & Governance Promotion",
    actor: "Investor",
    action: "Navigates to 'AI Learning' tab. Views Hermes-generated Candidate Heuristic #38 with status 'PROPOSED'.",
    output: "Candidate Rule #38: 'Elevate initial risk weighting by 25% for accounts with >5 micro-transfers within 15 min.'",
    metric: "Safe, auditable self-improvement",
    investorNarration: "'Instead of uncontrolled AI drift, Hermes proposes rules for compliance officer approval. The platform gets permanently smarter every week.'"
  }
];

export const BUDGET_MODEL = [
  { item: "Vercel Pro (Next.js hosting & edge functions)", cost: 20, description: "Production frontend deployment with instant global CDN" },
  { item: "Supabase Pro (PostgreSQL, Auth, RLS, Storage)", cost: 25, description: "Managed DB with row-level security and automated daily backups" },
  { item: "Hetzner / DigitalOcean VPS (n8n & DuckDB ML microservice)", cost: 15, description: "Self-hosted Dockerized n8n workflow engine and Python FastAPI" },
  { item: "Anthropic Claude API (Sonnet 3.7 / 3.5)", cost: 95, description: "Covers ~10,000 deep investigation syntheses at ~$0.009/call" },
  { item: "Hugging Face Inference Endpoint (ML Anomaly models)", cost: 30, description: "Dedicated serverless CPU inference for Isolation Forest / XGBoost" },
  { item: "Resend (Email notifications for Critical alerts)", cost: 10, description: "Transactional email alerts for compliance supervisors" },
  { item: "Domain & SSL / Cloudflare Reserve", cost: 10, description: "Custom domain with enterprise WAF and DDoS mitigation" },
  { item: "Buffer & Contingency Reserve", cost: 45, description: "Covers demo load spikes and additional API bursts during investor demos" }
];
