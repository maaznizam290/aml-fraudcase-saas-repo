import { PromptConfig } from '../types';

export function generateClaudeCodePrompt(config: PromptConfig): string {
  return `# ==============================================================================
# MASTER CLAUDE CODE PROMPT: AI-NATIVE AML & FRAUD INVESTIGATION SAAS (INVESTOR MVP)
# Architecture: Next.js + Supabase + n8n + Anthropic Claude + Python ML + Hermes Agent
# Reference: https://github.com/abhinayasridharrajaram/Claude-Fraud-Detection
# Budget: ~$250 - $300/month | Mode: Dual (DEMO_MODE=true offline / DEMO_MODE=false live)
# ==============================================================================

You are acting as a **Principal Fintech Software Architect, Senior Full-Stack Engineer, ML/Anomaly Engineer, AI Agent Systems Engineer, and RegTech Product Specialist**.

Your objective is to build a **fully functional, production-grade, investor-demoable MVP** of an **AI-Native AML & Real-Time Fraud Investigation SaaS platform** that secures institutional venture funding.

This is NOT a static UI mockup, landing page, or simulated chatbot. You must implement a complete, working vertical slice demonstrating the full end-to-end loop:

TRANSACTION / ALERT
  ↓ (n8n Webhook / Fast Intake)
DETERMINISTIC RULES ENGINE + DATA ENRICHMENT
  ↓ (KYC, OFAC/Sanctions, 90-Day Velocity)
PYTHON ML ANOMALY DETECTION (DuckDB + Scikit-Learn + XGBoost)
  ↓ (Isolation Forest, LOF, OCSVM, KMeans)
EVIDENCE AGGREGATION & CLAUSE REASONING
  ↓ (Anthropic Claude with Strict JSON Schema & Citations)
HUMAN COMPLIANCE ANALYST REVIEW & APPROVAL
  ↓ (Slack Interactive Card / In-App Investigation Workspace)
CASE RESOLUTION & IMMUTABLE AUDIT TRAIL
  ↓ (Supabase PostgreSQL with RLS)
HERMES SELF-LEARNING AGENT REFLECTION LOOP (Nous Research Hermes)
  ↓ (Episodic & Skill Memory Update: Proposed → Review → Approved)
CONTINUOUSLY IMPROVING FUTURE INVESTIGATIONS

---

## 1. STRATEGIC CONTEXT & REGULATORY GUARDRAILS (WHERE FINTECH ACTUALLY BREAKS)

Based on the independent regulatory risk research ("Where FinTech Actually Breaks: 2024-2026 Analysis"):
1. **The Core Crisis**: AML and fraud compliance is the fintech industry's most expensive chronic illness. Legacy rules engines suffer from **85% - 95% false-positive rates**, burning thousands of analyst hours.
2. **The Golden Value Proposition**: "Turn fragmented financial crime evidence into an explainable, auditable investigation recommendation in minutes instead of hours, slashing analyst false-positive fatigue while preserving complete regulatory auditability."
3. **The 3-Tier Adoption Boundaries (STRICTLY ENFORCED)**:
   - **Tier 1 (Deploy Now - The MVP Scope)**: AML alert triage & enrichment, fraud case investigation, KYC document review, reconciliation exception sorting. Agent role: Gather evidence, calculate velocity, evaluate ML anomaly scores, draft rationale with direct citations, and recommend a disposition (ESCALATE | CLEAR | REFER). **A human compliance analyst must approve every adverse action.**
   - **Tier 2 (Pilot with Guardrails - 6-12 Months)**: Continuous KYC/KYB monitoring, regulatory-change tracking.
   - **Tier 3 (DO NOT AUTOMATE - STRICTLY BANNED)**: Account closures, credit/loan denials, SAR/STR regulatory filings, autonomous customer fund freezes or treasury movement. The agent prepares the case file; the human makes the consequential call.
4. **Anti-Pattern To Avoid**: "Autonomy introduced before evidentiary and escalation infrastructure exists." Never deploy an agent to replace a control; deploy the agent to **strengthen the evidence behind the control**.

---

## 2. GITHUB REPOSITORY INTEGRATION (Claude-Fraud-Detection)

Integrate the machine learning and agent methodology from:
https://github.com/abhinayasridharrajaram/Claude-Fraud-Detection

Key patterns to incorporate into the service:
- **DuckDB Feature Store**: Ultra-fast analytical queries over transaction logs (90-day velocity, rolling standard deviations, recipient novelty, geographic distance).
- **Ensemble Anomaly & Fraud Pipeline**:
  - Unsupervised Anomaly Detectors: Isolation Forest, Local Outlier Factor (LOF), One-Class SVM (OCSVM), and K-Means clustering.
  - Supervised Benchmark: Logistic Regression baseline and XGBoost classifier.
  - Anonymized PCA Features: Support CreditCard V1–V28 feature vectors + tabular metadata (Amount, Time, Device, Velocity).
- **Transparent Model Comparison**: Maintain a Model Registry table comparing Precision, Recall, PR-AUC, and Anomaly thresholds. Note: Clearly label metrics as experimental benchmark results rather than claiming regulatory guarantees.
- **Claude Code Agent Tool/Skill Architecture**: Structure investigation actions into clean, modular functions/MCP tools.

---

## 3. NOUS RESEARCH HERMES SELF-LEARNING AI AGENT INTEGRATION

Integrate the **Hermes Agent** framework (https://hermes-agent.nousresearch.com/) as the platform's self-learning institutional memory layer.

### Hermes Architecture & Responsibilities:
1. **Feedback Ingestion**: When an analyst APPROVES, REJECTS, or OVERRIDES an AI recommendation, the disposition, analyst rationale, and case evidence are dispatched to the Hermes learning service.
2. **Persistent Multi-Tier Memory (PostgreSQL / Vector)**:
   - **Episodic Memory**: Past investigation cases, anomaly profiles, and ground-truth outcomes.
   - **Semantic / Institutional Memory**: Typology library (e.g., rapid smurfing, mule account rings, synthetic ID shifts).
   - **Skill Memory**: Step-by-step investigation procedures (e.g., "Verify crypto off-ramp counterparty IP correlation before clearing").
   - **Feedback Memory**: Specific analyst corrections (e.g., "Analyst overridden: User has seasonal Q4 commercial spike, do not escalate for velocity alone").
   - **Decision Memory**: Historical decision agreements and false-positive tracking.
3. **Safe, Controlled Self-Learning (Human-in-the-Loop Governance)**:
   - **CRITICAL**: Hermes MUST NOT automatically rewrite production rules, risk thresholds, or decision boundaries.
   - **Governance Workflow**:
     * Hermes detects recurring patterns across investigations.
     * Hermes drafts a **Candidate Heuristic / Rule Proposal** (e.g., "Proposed Heuristic #42: Flag accounts with >3 micro-deposits from neobanks within 2 hours of KYC approval").
     * Lifecycle: \`PROPOSED\` → \`IN_REVIEW\` → \`APPROVED\` (by Compliance Lead) → \`VERSIONED\` → \`DEPLOYED\`.
4. **AI Learning & Governance Dashboard**:
   - Provide a dedicated UI page showing: Active Skills, Learned Heuristics, Analyst Feedback Feed, and Rule Proposal Review Queue.

---

## 4. COMPLETE TECHNOLOGY STACK (SAAS PROTOTYPE SPECIFICATION)

- **Frontend**: Next.js 14+ (App Router), TypeScript, React, Tailwind CSS, Lucide Icons, Framer Motion, Recharts.
  * Enterprise fintech visual language: High information density, dark/light theme support, clean typography, zero cartoonish AI graphics or generic ChatGPT-style chat bubbles.
- **Backend & Database**: Supabase (PostgreSQL 15+, Supabase Auth with RLS, Storage, Database Webhooks/Realtime).
  * Multi-tenant data model with \`organization_id\`.
- **Workflow Automation**: n8n (hosted on VPS or cloud webhook).
  * Mirror the 16-node pipeline: Webhook intake → Normalize alert → 4 parallel fetches (Transactions, Sanctions, KYC, ML Features) → Combine evidence → Anthropic Claude Sonnet → Parse JSON → Google Sheets/Postgres audit log → Slack interactive review → Execute approved disposition → Dispatch Hermes feedback.
- **AI / LLM**: Anthropic Claude API (\`${config.targetModel}\`) with strict JSON output parsing and fallback to manual review on validation error.
- **Machine Learning**: Python FastAPI microservice (or Next.js API routes with DuckDB-Wasm/Onnx fallback), scikit-learn, XGBoost, Pandas, DuckDB.
- **Model Hosting & Inference**: Hugging Face Inference Endpoint / Hub integration via an abstracted \`MLProvider\` interface (supports Local Mock, Hugging Face, or SageMaker).
- **External Notifications**:
  * **Slack**: Block Kit interactive alert card with Approve/Reject buttons.
  * **Resend**: Transactional email notification for Critical alerts.
- **Budget Target**: Architected for **$250 - $300/month** total operating burn (Vercel Pro $20, Supabase Pro $25, n8n VPS $15, Anthropic API $80-$120, Hugging Face $30, Resend/Domain/Reserve $50).
- **Dual Runtime Modes**:
  * \`DEMO_MODE=true\`: Fully functional standalone mode with simulated KYC, OFAC/Sanctions, synthetic transactions, and deterministic ML/AI fallback so the investor demo NEVER breaks even without external API credentials.
  * \`DEMO_MODE=false\`: Connects to live Supabase, Anthropic API, n8n webhooks, Hugging Face, and Slack.

---

## 5. DATABASE SCHEMA & ROW LEVEL SECURITY (SUPABASE POSTGRESQL)

Create complete SQL migration scripts for the following tables with indexes, foreign keys, and RLS policies:
1. \`organizations\` (id, name, slug, plan, created_at)
2. \`users\` / \`profiles\` (id, org_id, email, full_name, role: ADMIN | COMPLIANCE_MANAGER | ANALYST | VIEWER)
3. \`customers\` (id, org_id, external_id, name, email, country, risk_tier, kyc_status, created_at)
4. \`transactions\` (id, org_id, customer_id, amount, currency, timestamp, sender, recipient, channel, device_id, ip_address, location_country)
5. \`alerts\` (id, org_id, customer_id, transaction_id, alert_type, risk_score, triggered_rule, status, priority, created_at)
6. \`cases\` (id, org_id, alert_id, customer_id, status: NEW | INVESTIGATING | AI_REVIEWED | HUMAN_REVIEW | ESCALATED | RESOLVED | FALSE_POSITIVE, assigned_to)
7. \`ml_predictions\` (id, alert_id, fraud_probability, anomaly_score, risk_band, model_version, signals, explanation)
8. \`ai_recommendations\` (id, case_id, disposition: ESCALATE | CLEAR | REFER, confidence, rationale, red_flags, cited_evidence, ml_assessment)
9. \`analyst_decisions\` (id, case_id, analyst_id, action: APPROVED | REJECTED | OVERRIDDEN, analyst_rationale, decided_at)
10. \`audit_logs\` (id, org_id, entity_type, entity_id, actor, action, payload, created_at) - IMMUTABLE
11. \`hermes_memories\` (id, org_id, memory_type: EPISODIC | SEMANTIC | SKILL | FEEDBACK, content, embedding, confidence, tags, created_at)
12. \`hermes_candidate_rules\` (id, org_id, title, description, rule_logic, status: PROPOSED | IN_REVIEW | APPROVED | REJECTED | DEPLOYED, impact_cases_count)
13. \`model_registry\` (id, model_name, version, algorithm, pr_auc, precision_score, recall_score, status: EXPERIMENTAL | PRODUCTION)

---

## 6. ANTHROPIC CLAUDE INVESTIGATION SYSTEM PROMPT & SCHEMA

Claude must be invoked with strict temperature=0.1 and system instructions:
\`\`\`typescript
const CLAUDE_INVESTIGATION_PROMPT = \`
You are an expert AML and Financial Crime Investigator operating strictly in RECOMMENDATION-ONLY mode (Tier 1).
You never take autonomous actions, close accounts, file SARs, or move funds.
Given the consolidated evidence package (customer profile, 90-day transactions, sanctions check, deterministic signals, and ML anomaly score):
1. Evaluate whether the ML score is corroborated or contradicted by behavioral facts.
2. Identify concrete red flags and trace every claim to explicit data fields.
3. Formulate an actionable disposition: "ESCALATE", "CLEAR", or "REFER".
4. Output STRICT JSON only, matching the exact schema below without prose or markdown formatting:

{
  "disposition": "ESCALATE" | "CLEAR" | "REFER",
  "confidence": number (0 - 100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "rationale": "Clear, concise investigation summary citing exact evidence",
  "redFlags": ["specific behavioral anomaly 1", "specific signal 2"],
  "supportingEvidence": ["field: value", "rule: condition"],
  "contradictoryEvidence": ["mitigating factor 1"],
  "recommendedNextSteps": ["actionable analyst checklist"],
  "mlScoreAssessment": "Corroboration/contradiction analysis of ML fraud probability",
  "investigationSummary": "Executive briefing for human compliance lead"
}
\`;
\`\`\`

---

## 7. CORE UI SCREENS TO BUILD

1. **Executive Overview Dashboard**:
   - High-level KPIs: Total Alerts (24h), High-Risk Ratio, False-Positive Reduction %, AI Acceptance Rate (e.g., 91.4%), Median Triage Time (down from 42 mins to 3.8 mins).
   - Real-time Alert Feed with live status pulses.
   - Anomaly Trends chart (recharts) comparing ML anomaly scores vs Rule-trigger counts.
2. **Alert Inbox & Case Management**:
   - Density-optimized data table with multi-parameter filtering (Risk Band, Disposition, Analyst, Alert Type).
   - Instant search across customer ID, transaction ID, and counterparty.
3. **The Investigation Workspace (Hero Screen for Investors)**:
   - **Left Panel**: Customer KYC dossier, risk rating, account age, linked accounts, device fingerprint.
   - **Center Panel**: Unified Interactive Timeline (Triggering txn, 90-day history, velocity spikes, geolocation jumps, sanctions check result).
   - **Right Panel**: The AI Investigator Hub:
     * ML Score Gauge (Fraud Probability & Anomaly Score from DuckDB/Scikit-learn).
     * Claude Disposition Card (ESCALATE / CLEAR / REFER) with confidence badge.
     * "Why?" Evidence breakdown citing exact data points.
     * Action Bar: [Approve Recommendation], [Reject / Override], [Request More Info], [Escalate to Level 2].
4. **AI Learning & Hermes Governance**:
   - Visual inspection of Hermes Multi-Tier Memory (Episodic, Semantic, Skills, Feedback).
   - Candidate Heuristics Queue (Review & Approve proposed rules generated from analyst overrides).
5. **Model Registry & Benchmark Explorer**:
   - Comparison of Isolation Forest, LOF, OCSVM, KMeans, and XGBoost based on the GitHub repository structure.
6. **Investor Demo Simulator Control Bar**:
   - Sticky header with quick-trigger scenarios:
     1) "Rapid Velocity / Card Smurfing" (12 micro-transfers in 4 minutes)
     2) "New Device + High-Value Wire" ($48,500 wire to high-risk jurisdiction)
     3) "Multi-Country Geolocation Jump" (London login followed by Singapore ATM 18 mins later)
     4) "Potential Structuring / Smurfing" (Consecutive $9,850 deposits under CTR threshold)
     5) "High-Net-Worth False Positive" (Legitimate luxury purchase matching customer wealth profile - AI recommends CLEAR).

---

## 8. INVESTOR DEMO WALKTHROUGH FLOW (WHAT TO PROVE IN 3 MINUTES)

Ensure the application supports this exact 14-step investor pitch demonstration:
1. **Initial State**: Investor views 23 active alerts; average triage time reads 4.2 mins.
2. **Action**: Investor clicks **"Simulate Suspicious Transaction"** (Scenario #1).
3. **Pipeline Ingest**: Real-time toast shows alert ingested via n8n webhook simulator.
4. **Data Gathering**: Parallel fetch indicators light up (Transactions, Sanctions, KYC).
5. **ML Anomaly**: Python ML / DuckDB engine emits \`fraud_probability: 0.89\`, \`anomaly_score: 0.93\`.
6. **Claude Reasoning**: Claude synthesizes evidence package into strict JSON.
7. **Recommendation**: Screen displays **ESCALATE (94% Confidence)** with 4 cited red flags.
8. **Explainability**: Investor inspects the "Why?" drawer showing velocity calculation (8.4x normal baseline) and unrecognized device ID.
9. **Decision**: Investor clicks **"Approve Recommendation"** and submits analyst notes.
10. **Case Disposition**: Alert transitions to \`RESOLVED (ESCALATED)\`.
11. **Audit Trail**: Real-time immutable audit log records the timestamp, actor, model version, and exact evidence hash.
12. **Hermes Learning Trigger**: Outcome is automatically dispatched to Hermes Agent.
13. **Institutional Memory**: Investor navigates to **"AI Learning"** tab to see: *"New pattern indexed: Micro-velocity smurfing with neobank off-ramps (Confidence 92%)"*.
14. **The Investor Climax**: "Notice how we didn't just solve one alert—our platform got permanently smarter for every future compliance analyst."

---

## 9. IMPLEMENTATION PLAN & PHASE ROLLOUT

Follow this sequence to ensure zero errors and clean execution:
- **Phase 1**: Project Structure, Types, and Supabase / Local Storage Mock Database.
- **Phase 2**: Synthetic Dataset Generator (100+ customers, 500+ transactions, realistic fraud patterns).
- **Phase 3**: ML Anomaly & Feature Engineering Engine (DuckDB queries, Isolation Forest & XGBoost scoring).
- **Phase 4**: n8n Webhook & Orchestrator Simulation layer.
- **Phase 5**: Claude Investigation Prompt & JSON Parser with fallback handlers.
- **Phase 6**: Hermes Self-Learning Agent Memory & Governance Pipeline.
- **Phase 7**: Enterprise Fintech Dashboard, Investigation Workspace, and Interactive Simulator.
- **Phase 8**: Verification, Type Checking, and Production Build (\`npm run build\`).

Execute this entire codebase now with clean, maintainable, TypeScript-strict files!
`;
}
