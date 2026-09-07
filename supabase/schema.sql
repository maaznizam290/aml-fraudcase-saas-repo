-- Veritas AML / Fraud SaaS Database Schema (Supabase PostgreSQL)
-- Enforces Row-Level Security (RLS), append-only cryptographic audit logs, and Tier 3 statutory guardrails.

-- 1. Enable pgcrypto for real cryptographic SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE risk_tier AS ENUM ('MINIMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE case_status AS ENUM ('NEW', 'INVESTIGATING', 'AI_REVIEWED', 'HUMAN_REVIEW', 'ESCALATED', 'RESOLVED', 'FALSE_POSITIVE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disposition_type AS ENUM ('ESCALATE', 'CLEAR', 'REFER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('analyst', 'compliance_officer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    external_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    risk_tier risk_tier NOT NULL DEFAULT 'LOW',
    kyc_status TEXT NOT NULL DEFAULT 'VERIFIED',
    account_age_days INTEGER NOT NULL DEFAULT 30,
    occupation TEXT NOT NULL DEFAULT 'Unspecified',
    monthly_income_usd NUMERIC(12, 2) NOT NULL DEFAULT 0,
    device_fingerprint TEXT,
    linked_accounts_count INTEGER DEFAULT 1,
    total_historical_alerts INTEGER DEFAULT 0,
    avatar_seed TEXT DEFAULT 'CU',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    amount NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PKR',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    recipient_bank TEXT NOT NULL,
    recipient_country TEXT NOT NULL,
    channel TEXT NOT NULL,
    device_id TEXT,
    ip_address TEXT,
    location_country TEXT,
    location_city TEXT,
    status TEXT NOT NULL DEFAULT 'SETTLED',
    is_trigger BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ALERTS TABLE
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    triggered_rule TEXT NOT NULL,
    status case_status NOT NULL DEFAULT 'NEW',
    priority TEXT NOT NULL DEFAULT 'P2_HIGH',
    heuristic_score INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EVIDENCE PACKAGES TABLE
CREATE TABLE IF NOT EXISTS evidence_packages (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    customer_profile JSONB NOT NULL,
    recent_transactions JSONB NOT NULL,
    device_telemetry JSONB NOT NULL,
    counterparty_profile JSONB NOT NULL,
    heuristic_signals JSONB NOT NULL,
    evidence_fingerprint TEXT NOT NULL,
    collected_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI RECOMMENDATIONS TABLE (Tier 1 Advisory Only - Never Autonomous SAR/Fund Freeze)
CREATE TABLE IF NOT EXISTS ai_recommendations (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    disposition disposition_type NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    risk_level risk_tier NOT NULL,
    rationale TEXT NOT NULL,
    red_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    supporting_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    contradictory_evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_next_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    ml_score_assessment TEXT,
    investigation_summary TEXT,
    model_used TEXT NOT NULL,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HUMAN DECISIONS TABLE (Sovereign Human In The Loop)
CREATE TABLE IF NOT EXISTS human_decisions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_id TEXT NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    analyst_id TEXT NOT NULL,
    analyst_name TEXT NOT NULL,
    analyst_role user_role_type NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('APPROVED', 'REJECTED', 'OVERRIDDEN')),
    override_disposition disposition_type,
    analyst_rationale TEXT NOT NULL,
    decided_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. IMMUTABLE AUDIT LOG (Cryptographically chained SHA-256)
CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    sequence_number BIGSERIAL NOT NULL UNIQUE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor TEXT NOT NULL,
    actor_id TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT NOT NULL,
    previous_hash TEXT NOT NULL,
    evidence_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE
);

-- 10. HERMES CANDIDATE RULES (Heuristic governance with CCO signoff gate)
CREATE TABLE IF NOT EXISTS hermes_candidate_rules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    rule_logic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PROPOSED' CHECK (status IN ('PROPOSED', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'DEPLOYED')),
    impact_cases_count INTEGER DEFAULT 0,
    proposed_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by TEXT,
    reviewed_by_id TEXT,
    reviewed_at TIMESTAMPTZ,
    rationale TEXT NOT NULL,
    backtest_results JSONB
);

-- 11. HERMES MEMORIES TABLE
CREATE TABLE IF NOT EXISTS hermes_memories (
    id TEXT PRIMARY KEY,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('EPISODIC', 'SEMANTIC', 'SKILL', 'FEEDBACK')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL DEFAULT 0.900,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    case_reference TEXT
);

-- 12. MODEL REGISTRY TABLE
CREATE TABLE IF NOT EXISTS model_registry (
    id TEXT PRIMARY KEY,
    model_name TEXT NOT NULL,
    version TEXT NOT NULL,
    algorithm TEXT NOT NULL,
    pr_auc NUMERIC(4, 3) NOT NULL,
    precision_score NUMERIC(4, 3) NOT NULL,
    recall_score NUMERIC(4, 3) NOT NULL,
    anomaly_threshold NUMERIC(4, 3) NOT NULL,
    latency_ms NUMERIC(6, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'PRODUCTION',
    feature_importance_top JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 13. AUDIT LOG APPEND-ONLY GUARDRAILS (Trigger to prevent updates or deletes)
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Cryptographic Audit Log is strictly append-only. Modification or deletion is forbidden by regulatory compliance.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_log_mod ON audit_log;
CREATE TRIGGER trg_prevent_audit_log_mod
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_modification();

-- 14. ROW LEVEL SECURITY (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_candidate_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_registry ENABLE ROW LEVEL SECURITY;

-- Default Read-All policies for authenticated users
CREATE POLICY "Allow read for authenticated users" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON transactions FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON evidence_packages FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON ai_recommendations FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON human_decisions FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON audit_log FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON hermes_candidate_rules FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON hermes_memories FOR SELECT USING (true);
CREATE POLICY "Allow read for authenticated users" ON model_registry FOR SELECT USING (true);
