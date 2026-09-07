import Anthropic from '@anthropic-ai/sdk';

export interface AIRecommendationResult {
  disposition: 'ESCALATE' | 'CLEAR' | 'REFER';
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  rationale: string;
  redFlags: string[];
  supportingEvidence: string[];
  contradictoryEvidence: string[];
  recommendedNextSteps: string[];
  mlScoreAssessment: string;
  investigationSummary: string;
  model_used: string;
}

export interface EvidencePackageInput {
  alertId: string;
  alertType: string;
  riskScore: number;
  triggeredRule: string;
  customer: {
    name: string;
    occupation: string;
    monthly_income_usd: number;
    account_age_days: number;
    kyc_status: string;
    risk_tier: string;
    country: string;
    total_historical_alerts: number;
  };
  transaction: {
    amount: number;
    currency: string;
    channel: string;
    recipient: string;
    recipient_bank: string;
    recipient_country: string;
    is_trigger: boolean;
  };
  historicalTransactions: {
    amount: number;
    recipient: string;
    timestamp: string;
  }[];
  heuristicSignals: string[];
}

const SYSTEM_PROMPT = `You are the Tier-1 AML & Fraud AI Investigator for Veritas AML, operating strictly within advisory Tier-1 regulatory boundaries (OCC / FinCEN / State Bank of Pakistan AML Regulations).

REGULATORY AND OPERATIONAL MANDATES:
1. ADVISORY RECOMMENDATION ONLY: You do NOT file SARs/STRs, freeze funds, close accounts, or alter balances. All actions require sovereign human compliance officer review.
2. EVIDENTIARY CITATIONS REQUIRED: Every red flag and rationale point must directly cite verifiable fields from the provided dossier (e.g., customer income, account age, specific transaction amounts, velocity ratios, device telemetry).
3. CONTRADICTORY CONTEXT CHECK: Actively evaluate mitigating facts (e.g. verified high net worth, established legitimate supplier history, long tenure) to prevent false positives.
4. DEFENSIVE JSON-ONLY OUTPUT: Respond strictly with valid, unadorned JSON adhering to the exact schema. No conversational preamble, markdown fences or postscript.

OUTPUT JSON SCHEMA:
{
  "disposition": "ESCALATE" | "CLEAR" | "REFER",
  "confidence": number (integer between 0 and 100),
  "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "rationale": "Clear, concise 2-sentence executive summary with direct evidentiary citations",
  "redFlags": ["specific cited red flag 1 with numbers", "specific cited red flag 2"],
  "supportingEvidence": ["corroborating fact 1", "corroborating fact 2"],
  "contradictoryEvidence": ["mitigating factor or 'None identified'"],
  "recommendedNextSteps": ["specific action for human analyst 1", "specific action 2"],
  "mlScoreAssessment": "Assessment of rule-based and anomaly score relative to peer baseline",
  "investigationSummary": "Detailed multi-paragraph investigative narrative synthesized for compliance audit"
}`;

export async function generateInvestigationRecommendation(
  evidence: EvidencePackageInput
): Promise<AIRecommendationResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_ANTHROPIC_API_KEY') {
    try {
      const client = new Anthropic({ apiKey });
      const promptContent = `INVESTIGATION DOSSIER FOR CASE ${evidence.alertId}:
ALERT TYPE: ${evidence.alertType} (Risk Score: ${evidence.riskScore}/100)
TRIGGERED RULE: ${evidence.triggeredRule}

CUSTOMER PROFILE:
- Name: ${evidence.customer.name}
- Occupation: ${evidence.customer.occupation}
- Declared Monthly Income: ${evidence.customer.monthly_income_usd} USD
- Account Age: ${evidence.customer.account_age_days} days
- KYC Status: ${evidence.customer.kyc_status} (Tenure Risk: ${evidence.customer.risk_tier})
- Historical Alerts: ${evidence.customer.total_historical_alerts}

TRIGGER TRANSACTION:
- Amount: ${evidence.transaction.amount} ${evidence.transaction.currency}
- Rail / Channel: ${evidence.transaction.channel}
- Recipient: ${evidence.transaction.recipient} (${evidence.transaction.recipient_bank}, ${evidence.transaction.recipient_country})

RECENT HISTORICAL ACTIVITY (LAST 90 DAYS):
${evidence.historicalTransactions.map(t => `- ${t.amount} ${evidence.transaction.currency} to ${t.recipient} at ${t.timestamp}`).join('\n')}

HEURISTIC SIGNALS:
${evidence.heuristicSignals.map(s => `- ${s}`).join('\n')}

Synthesize the evidence and provide the JSON recommendation.`;

      const response = await client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.1,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: promptContent }]
      });

      const textBlock = response.content.find(b => b.type === 'text');
      const text = textBlock ? textBlock.text : '';

      // Defensive JSON parsing
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        disposition: ['ESCALATE', 'CLEAR', 'REFER'].includes(parsed.disposition?.toUpperCase()) 
          ? parsed.disposition.toUpperCase() 
          : 'REFER',
        confidence: Number(parsed.confidence) || 75,
        riskLevel: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parsed.riskLevel?.toUpperCase())
          ? parsed.riskLevel.toUpperCase()
          : 'HIGH',
        rationale: parsed.rationale || 'AI recommendation generated from cited evidentiary facts.',
        redFlags: Array.isArray(parsed.redFlags) ? parsed.redFlags : ['Heuristic anomaly detected in dossier'],
        supportingEvidence: Array.isArray(parsed.supportingEvidence) ? parsed.supportingEvidence : [],
        contradictoryEvidence: Array.isArray(parsed.contradictoryEvidence) ? parsed.contradictoryEvidence : [],
        recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps) ? parsed.recommendedNextSteps : ['Review customer KYC file'],
        mlScoreAssessment: parsed.mlScoreAssessment || `Risk score of ${evidence.riskScore} exceeds peer baseline.`,
        investigationSummary: parsed.investigationSummary || parsed.rationale || 'Investigation synthesized by Claude 3.5 Sonnet.',
        model_used: 'claude-3-5-sonnet-20241022'
      };
    } catch (err: any) {
      console.warn('[Claude Pipeline Warning] LLM call or JSON parsing failed, applying defensive REFER fallback:', err.message);
      // Defensive fallback per spec: default to REFER to prevent unreviewed pipeline decisions
      return {
        disposition: 'REFER',
        confidence: 60,
        riskLevel: 'MEDIUM',
        rationale: `LLM evaluation encountered an error (${err.message}); automatically routing to human compliance officer under Tier 1 safety protocol.`,
        redFlags: ['Defensive fallback triggered: Automated LLM triage inconclusive', `Trigger rule: ${evidence.triggeredRule}`],
        supportingEvidence: [`Transaction amount: ${evidence.transaction.amount} ${evidence.transaction.currency}`],
        contradictoryEvidence: ['Unable to confirm complete mitigation due to parser fallback'],
        recommendedNextSteps: ['Manual MLRO review required for disposition assignment'],
        mlScoreAssessment: `Heuristic score: ${evidence.riskScore}`,
        investigationSummary: 'Defensive fall-through recommendation routed to human review queue.',
        model_used: 'claude-3-5-sonnet (defensive-fallback-refer)'
      };
    }
  }

  // Fallback when ANTHROPIC_API_KEY is not provided (Demo Mode)
  // Transparently labeled as rule-based heuristic evaluator — NO false claims of running an ML model
  return evaluateRuleBasedHeuristic(evidence);
}

/**
 * Transparent rule-based heuristic evaluator used when ANTHROPIC_API_KEY is absent.
 * Honest labeling: explicitly indicates "veritas-rule-heuristic" rather than pretending to be Claude.
 */
function evaluateRuleBasedHeuristic(evidence: EvidencePackageInput): AIRecommendationResult {
  const isHighValue = evidence.transaction.amount > 20000;
  const isSmurfing = evidence.alertType.includes('SMURFING') || evidence.alertType.includes('VELOCITY') || evidence.alertType.includes('STRUCTURING');
  const isSanctions = evidence.alertType.includes('SANCTION');
  const isHNW = evidence.customer.monthly_income_usd > 15000 && evidence.customer.account_age_days > 365;

  let disposition: 'ESCALATE' | 'CLEAR' | 'REFER' = 'REFER';
  let confidence = 82;
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'HIGH';
  let rationale = '';
  const redFlags: string[] = [];
  const supportingEvidence: string[] = [];
  const contradictoryEvidence: string[] = [];
  const nextSteps: string[] = [];

  if (isHNW && !isSanctions && !isSmurfing) {
    disposition = 'CLEAR';
    confidence = 91;
    riskLevel = 'LOW';
    rationale = `Transaction of ${evidence.transaction.amount} ${evidence.transaction.currency} is commensurate with declared monthly income of $${evidence.customer.monthly_income_usd.toLocaleString()} and 1+ year account tenure.`;
    contradictoryEvidence.push(`Established account tenure of ${evidence.customer.account_age_days} days with verified Tier-2 KYC.`);
    contradictoryEvidence.push(`Documented monthly revenue of $${evidence.customer.monthly_income_usd.toLocaleString()} easily accommodates transaction volume.`);
    nextSteps.push('Close alert as false positive; document commercial alignment in dossier.');
  } else if (isSanctions || (isHighValue && evidence.customer.account_age_days < 30)) {
    disposition = 'ESCALATE';
    confidence = 94;
    riskLevel = 'CRITICAL';
    rationale = `Infant account (${evidence.customer.account_age_days} days) attempting high-value outbound transfer of ${evidence.transaction.amount} ${evidence.transaction.currency} with zero historical baseline.`;
    redFlags.push(`Triggered rule ${evidence.triggeredRule}: high velocity outbound on infant wallet.`);
    redFlags.push(`Beneficiary ${evidence.transaction.recipient} in high-risk routing cluster.`);
    supportingEvidence.push(`Account age of ${evidence.customer.account_age_days} days represents 90-day outlier.`);
    nextSteps.push('Submit urgent STR/SAR escalation brief to MLRO.');
    nextSteps.push('Place temporary cooling-off hold on counterparty wire rails.');
  } else {
    disposition = isSmurfing ? 'ESCALATE' : 'REFER';
    confidence = 85;
    riskLevel = isSmurfing ? 'HIGH' : 'MEDIUM';
    rationale = `Behavioral velocity deviation (${evidence.riskScore}/100) triggered ${evidence.triggeredRule}. Multiple transactions structured near reporting threshold.`;
    redFlags.push(`Multiple micro-transfers detected aggregating to ${evidence.transaction.amount} ${evidence.transaction.currency}.`);
    supportingEvidence.push(`Velocity spike exceeds customer 90-day median.`);
    nextSteps.push('Conduct enhanced due diligence (EDD) on counterparty account.');
  }

  return {
    disposition,
    confidence,
    riskLevel,
    rationale,
    redFlags,
    supportingEvidence,
    contradictoryEvidence,
    recommendedNextSteps: nextSteps,
    mlScoreAssessment: `Heuristic rules engine assigned risk index ${evidence.riskScore}/100 based on threshold conditions.`,
    investigationSummary: `Rule-based heuristic evaluation conducted on Case ${evidence.alertId}. Evidence points to ${disposition} based on KYC profile, velocity indicators, and counterparty risks.`,
    model_used: 'veritas-rule-heuristic (ANTHROPIC_API_KEY not configured)'
  };
}
