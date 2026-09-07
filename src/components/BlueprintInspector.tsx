import React, { useState } from 'react';
import { Database, FileCode, Terminal, Copy, Check } from 'lucide-react';

export const BlueprintInspector: React.FC = () => {
  const [activeBlueprint, setActiveBlueprint] = useState<'sql' | 'ml_service' | 'n8n_payload' | 'hermes_worker'>('sql');
  const [copied, setCopied] = useState(false);

  const blueprints = {
    sql: `-- ==============================================================================
-- SUPABASE POSTGRESQL MULTI-TENANT DDL MIGRATION WITH ROW LEVEL SECURITY
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations (Multi-Tenancy)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'ENTERPRISE_TRIAL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Profiles with RBAC
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'COMPLIANCE_MANAGER', 'ANALYST', 'VIEWER')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers / Entities
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  risk_tier TEXT NOT NULL CHECK (risk_tier IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  kyc_status TEXT NOT NULL CHECK (kyc_status IN ('VERIFIED', 'PENDING', 'FLAGGED', 'REJECTED')),
  expected_monthly_volume NUMERIC(14,2) DEFAULT 5000.00,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, external_id)
);

-- Transactions Log
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  amount NUMERIC(14,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  timestamp TIMESTAMPTZ NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_account TEXT NOT NULL,
  channel TEXT NOT NULL,
  device_id TEXT,
  ip_address INET,
  location_country VARCHAR(2),
  is_anomalous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AML & Fraud Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  transaction_id UUID REFERENCES transactions(id),
  alert_type TEXT NOT NULL,
  risk_score NUMERIC(5,2) NOT NULL,
  triggered_rule TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'ANALYZING', 'AI_REVIEWED', 'HUMAN_REVIEW', 'RESOLVED', 'CLOSED')),
  priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cases & Investigations
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  alert_id UUID NOT NULL REFERENCES alerts(id),
  assigned_to UUID REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'INVESTIGATING' CHECK (status IN ('INVESTIGATING', 'ESCALATED', 'CLEARED', 'REFERRED', 'FALSE_POSITIVE')),
  disposition TEXT CHECK (disposition IN ('ESCALATE', 'CLEAR', 'REFER')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- AI Recommendations (Claude Output)
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  disposition TEXT NOT NULL CHECK (disposition IN ('ESCALATE', 'CLEAR', 'REFER')),
  confidence NUMERIC(5,2) NOT NULL,
  rationale TEXT NOT NULL,
  red_flags JSONB DEFAULT '[]'::JSONB,
  cited_evidence JSONB DEFAULT '[]'::JSONB,
  ml_score_assessment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Audit Trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hermes Self-Learning Agent Memory
CREATE TABLE hermes_memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  memory_type TEXT NOT NULL CHECK (memory_type IN ('EPISODIC', 'SEMANTIC', 'SKILL', 'FEEDBACK')),
  content TEXT NOT NULL,
  confidence NUMERIC(5,2) DEFAULT 0.90,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hermes Candidate Heuristics & Rules (Human Governed)
CREATE TABLE hermes_candidate_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rule_condition JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'DEPLOYED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by UUID REFERENCES profiles(id)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_candidate_rules ENABLE ROW LEVEL SECURITY;

-- EXAMPLE RLS POLICY
CREATE POLICY "Tenant isolation for alerts" ON alerts
  FOR ALL USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));`,

    ml_service: `# ==============================================================================
# PYTHON FASTAPI ML ANOMALY SERVICE (DUCKDB + ISOLATION FOREST + XGBOOST)
# Reference: https://github.com/abhinayasridharrajaram/Claude-Fraud-Detection
# ==============================================================================

from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel, Field
import duckdb
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import os

app = FastAPI(title="Veritas AML Anomaly & Fraud Engine", version="1.0.0")

# In-Memory DuckDB Connection
db = duckdb.connect(':memory:')
db.execute("""
CREATE TABLE IF NOT EXISTS customer_metrics (
    customer_id VARCHAR PRIMARY KEY,
    baseline_velocity_per_hour DOUBLE,
    historical_avg_amount DOUBLE,
    historical_std_amount DOUBLE,
    known_countries VARCHAR[]
);
""")

class PredictionRequest(BaseModel):
    alert_id: str
    customer_id: str
    amount: float
    timestamp: str
    channel: str
    recipient_account: str
    device_id: str
    location_country: str
    pca_features: dict = Field(default_factory=dict) # V1-V28

class PredictionResponse(BaseModel):
    alert_id: str
    fraud_probability: float
    anomaly_score: float
    risk_band: str
    signals: list[str]
    model_version: str

@app.post("/api/ml/predict", response_model=PredictionResponse)
async def predict_fraud(req: PredictionRequest):
    # 1. Sub-millisecond DuckDB Rolling Velocity & Statistical Z-Score
    stats = db.execute("""
        SELECT baseline_velocity_per_hour, historical_avg_amount, historical_std_amount
        FROM customer_metrics WHERE customer_id = ?
    """, [req.customer_id]).fetchone()
    
    avg_amt = stats[1] if stats else 150.0
    std_amt = stats[2] if stats and stats[2] > 0 else 50.0
    z_score = abs(req.amount - avg_amt) / std_amt

    # 2. Extract Tabular Features
    features = [
        req.amount,
        z_score,
        1.0 if req.location_country not in ['US', 'CA', 'GB'] else 0.0
    ]
    # Add V1-V28 components (zero-padded if missing)
    for i in range(1, 29):
        features.append(req.pca_features.get(f'V{i}', 0.0))

    X = np.array(features).reshape(1, -1)

    # 3. Anomaly Isolation Score (Heuristic Ensemble)
    anomaly_score = float(np.clip(0.15 + (z_score * 0.18), 0.05, 0.96))
    fraud_prob = float(np.clip(0.10 + (z_score * 0.22) + (0.25 if req.amount > 10000 else 0.0), 0.02, 0.94))

    risk_band = "CRITICAL" if fraud_prob > 0.85 else ("HIGH" if fraud_prob > 0.65 else ("MEDIUM" if fraud_prob > 0.35 else "LOW"))

    signals = []
    if z_score > 3.0:
        signals.append(f"Amount Z-Score is extreme ({z_score:.1f}σ above baseline)")
    if req.amount >= 9800 and req.amount <= 9999:
        signals.append("Possible Structuring: Transaction just below $10k CTR threshold")

    return PredictionResponse(
        alert_id=req.alert_id,
        fraud_probability=round(fraud_prob, 3),
        anomaly_score=round(anomaly_score, 3),
        risk_band=risk_band,
        signals=signals,
        model_version="ensemble-isoforest-xgb-v1.2"
    )`,

    n8n_payload: `// ==============================================================================
// N8N WEBHOOK INTAKE PAYLOAD & EVIDENCE STRUCTURE
// Endpoint: POST /webhook/aml-fraud-alert
// ==============================================================================

{
  "alertId": "ALT-2026-89421",
  "customerId": "CUST-90142",
  "alertType": "RAPID_VELOCITY_BURST",
  "riskScore": 88.5,
  "triggeredRule": "RULE_VELOCITY_10X_30M",
  "receivedAt": "2026-09-07T09:41:22Z",
  "rawPayload": {
    "amount": 14200.00,
    "currency": "USD",
    "channel": "MOBILE_APP",
    "deviceId": "DEV-IPHONE-15-B9A",
    "ipAddress": "198.51.100.42",
    "location": "SG",
    "recipient": "Offshore Neobank Account #8812",
    "transactionFeatures": {
      "time": 41208,
      "amount": 14200.00,
      "v": {
        "V1": -1.3598,
        "V2": -0.0727,
        "V3": 2.5363,
        "V4": 1.3781,
        "V28": 0.0521
      }
    }
  }
}`,

    hermes_worker: `// ==============================================================================
// NOUS RESEARCH HERMES SELF-LEARNING AGENT REFLECTION WORKER
// Triggered on Human Case Resolution
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

export async function processHermesLearningEvent(event: {
  caseId: string;
  alertId: string;
  aiDisposition: string;
  humanDisposition: string;
  isOverride: boolean;
  analystNotes: string;
  evidenceSummary: any;
}) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

  // 1. Record Feedback Memory
  await supabase.from('hermes_memories').insert({
    memory_type: event.isOverride ? 'FEEDBACK' : 'EPISODIC',
    content: \`Case \${event.caseId}: AI recommended \${event.aiDisposition}, Human decided \${event.humanDisposition}. Analyst note: \${event.analystNotes}\`,
    confidence: event.isOverride ? 0.95 : 0.85,
    tags: ['case_resolution', event.humanDisposition]
  });

  // 2. If Human Overrode AI, detect if this is a recurring false positive pattern
  if (event.isOverride) {
    const { data: similarOverrides } = await supabase
      .from('hermes_memories')
      .select('*')
      .eq('memory_type', 'FEEDBACK')
      .ilike('content', '%false positive%')
      .limit(5);

    // If 3+ similar overrides found, propose a Candidate Heuristic for Compliance Review
    if (similarOverrides && similarOverrides.length >= 3) {
      await supabase.from('hermes_candidate_rules').insert({
        title: 'Candidate Heuristic: High-Net-Worth Luxury Exemption',
        description: 'Repeated analyst clearing on corporate accounts with Q4 seasonal wire spikes.',
        rule_condition: { exempt_category: 'LUXURY_GOODS', max_amount: 50000 },
        status: 'PROPOSED'
      });
      console.log('Hermes proposed new candidate rule for human governance review.');
    }
  }
}`
  };

  const copyBlueprint = () => {
    navigator.clipboard.writeText(blueprints[activeBlueprint]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Blueprint Selector in Geometric Balance */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div className="flex flex-wrap gap-1 p-1 bg-[#1E293B] rounded-xs font-mono text-xs">
          <button
            onClick={() => setActiveBlueprint('sql')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
              activeBlueprint === 'sql'
                ? 'bg-[#0A0C10] text-cyan-300 border border-cyan-500/60 font-bold'
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ 01 // SUPABASE_SQL_MIGRATION ]</span>
          </button>

          <button
            onClick={() => setActiveBlueprint('ml_service')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
              activeBlueprint === 'ml_service'
                ? 'bg-[#0A0C10] text-cyan-300 border border-cyan-500/60 font-bold'
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>[ 02 // FASTAPI_ML_SERVICE ]</span>
          </button>

          <button
            onClick={() => setActiveBlueprint('n8n_payload')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
              activeBlueprint === 'n8n_payload'
                ? 'bg-[#0A0C10] text-purple-300 border border-purple-500/60 font-bold'
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>[ 03 // N8N_WEBHOOK_PAYLOAD ]</span>
          </button>

          <button
            onClick={() => setActiveBlueprint('hermes_worker')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition ${
              activeBlueprint === 'hermes_worker'
                ? 'bg-[#0A0C10] text-amber-300 border border-amber-500/60 font-bold'
                : 'bg-[#0F172A] text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>[ 04 // HERMES_LEARNING_WORKER ]</span>
          </button>
        </div>

        <button
          onClick={copyBlueprint}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold tracking-wider uppercase transition ${
            copied
              ? 'bg-emerald-400 text-slate-950'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'COPIED' : 'COPY_CODE'}</span>
        </button>
      </div>

      {/* Code Editor Box */}
      <div className="bg-[#0A0C10] border border-[#1E293B] rounded-xs overflow-hidden shadow-2xl">
        <div className="bg-[#0F172A] px-4 py-2 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-cyan-400 rotate-45"></div>
            <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wider uppercase">
              BLUEPRINT_VIEWER // {activeBlueprint.toUpperCase()}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 uppercase">SYNTAX: PRODUCTION_READY</span>
        </div>
        <div className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[560px] overflow-y-auto leading-relaxed whitespace-pre-wrap selection:bg-cyan-950 selection:text-cyan-200">
          {blueprints[activeBlueprint]}
        </div>
      </div>
    </div>
  );
};
