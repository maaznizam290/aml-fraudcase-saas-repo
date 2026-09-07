import { 
  Customer, 
  Transaction, 
  Alert, 
  HermesMemory, 
  HermesCandidateRule, 
  ModelRegistryItem, 
  ScenarioDefinition,
  AuditLog
} from '../types';

export const SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'smurfing',
    title: 'Rapid Velocity / Card Smurfing',
    badge: 'SCENARIO_01',
    description: '12 micro-transfers ($85 - $190) dispatched within 4 minutes across newly spawned virtual cards to crypto off-ramp.',
    alert_type: 'RAPID_VELOCITY',
    customer_name: 'Vikram Patel',
    amount: 1420.00,
    expected_disposition: 'ESCALATE',
    expected_confidence: 94,
    key_evidence: 'Velocity spike 8.4x above 90-day baseline; unverified device hash; automated script interval fingerprint.',
    pitch_note: 'Demonstrates automated smurfing detection catching micro-layering that traditional batch rule systems miss until end-of-day.'
  },
  {
    id: 'wire',
    title: 'New Device + High-Value Wire',
    badge: 'SCENARIO_02',
    description: '$48,500 swift wire to offshore jurisdiction initiated 9 minutes after login from an unregistered Android emulator.',
    alert_type: 'HIGH_VALUE_WIRE',
    customer_name: 'Elena Rostova',
    amount: 48500.00,
    expected_disposition: 'ESCALATE',
    expected_confidence: 96,
    key_evidence: 'New device hardware GUID; beneficiary IBAN in high-risk transit hub; amount exceeds 90-day avg by 1400%.',
    pitch_note: 'Proves high-loss ATO (Account Takeover) intervention before irrevocable SWIFT wire settlement.'
  },
  {
    id: 'geo_jump',
    title: 'Multi-Country Geolocation Jump',
    badge: 'SCENARIO_03',
    description: 'London Canary Wharf web authentication followed 18 minutes later by Singapore Marina Bay physical ATM cash withdrawal query.',
    alert_type: 'GEOLOCATION_JUMP',
    customer_name: 'Marcus Vance',
    amount: 5000.00,
    expected_disposition: 'ESCALATE',
    expected_confidence: 91,
    key_evidence: 'Impossible travel velocity (6,740 miles in 18 minutes = 22,466 mph); dual active session tokens.',
    pitch_note: 'Shows behavioral telemetry and IP infrastructure correlation detecting compromised enterprise credentials.'
  },
  {
    id: 'structuring',
    title: 'Potential Structuring / CTR Smurfing',
    badge: 'SCENARIO_04',
    description: '3 consecutive deposits of $9,850, $9,900, and $9,750 over 36 hours at disparate branch ATMs just below the $10,000 BSA CTR threshold.',
    alert_type: 'STRUCTURING_SMURFING',
    customer_name: 'David K. Morrison',
    amount: 29500.00,
    expected_disposition: 'ESCALATE',
    expected_confidence: 93,
    key_evidence: 'Intentional avoidance of $10k FinCEN CTR threshold; 99th percentile proximity to reporting limit; cash-in pattern.',
    pitch_note: 'Demonstrates FinCEN/FATF pattern recognition where deterministic rules alone get bypassed by sophisticated smurfs.'
  },
  {
    id: 'hnw_clear',
    title: 'High-Net-Worth False Positive (AI Clears)',
    badge: 'SCENARIO_05',
    description: '$34,000 art auction gallery purchase in Geneva triggered standard high-amount legacy rule, but matches validated wealth profile.',
    alert_type: 'HIGH_VALUE_WIRE',
    customer_name: 'Camilla Montgomery-Smyth',
    amount: 34000.00,
    expected_disposition: 'CLEAR',
    expected_confidence: 89,
    key_evidence: 'Customer annual verified income $1.2M; authenticated biometrics on trusted iOS device; historical Sotheby\'s merchant category alignment.',
    pitch_note: 'The Holy Grail for compliance teams: safely CLEARING false positives with audit-proof citations, slashing analyst backlog by up to 85%.'
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust_01',
    external_id: 'EXT-8831-GB',
    name: 'Vikram Patel',
    email: 'v.patel@horizonfin.co.uk',
    country: 'United Kingdom',
    city: 'Manchester',
    risk_tier: 'HIGH',
    kyc_status: 'ENHANCED_DUE_DILIGENCE',
    account_age_days: 42,
    occupation: 'Logistics Consultant',
    monthly_income_usd: 4800,
    device_fingerprint: 'fp_a98f71c4992e',
    linked_accounts_count: 2,
    total_historical_alerts: 4,
    avatar_seed: 'VP'
  },
  {
    id: 'cust_02',
    external_id: 'EXT-4109-CY',
    name: 'Elena Rostova',
    email: 'elena.rostova@baltic-trade.lv',
    country: 'Cyprus',
    city: 'Limassol',
    risk_tier: 'CRITICAL',
    kyc_status: 'VERIFIED',
    account_age_days: 180,
    occupation: 'Import / Export Director',
    monthly_income_usd: 12500,
    device_fingerprint: 'fp_5510b299de81',
    linked_accounts_count: 5,
    total_historical_alerts: 6,
    avatar_seed: 'ER'
  },
  {
    id: 'cust_03',
    external_id: 'EXT-9923-SG',
    name: 'Marcus Vance',
    email: 'm.vance@quantacapital.sg',
    country: 'Singapore',
    city: 'Singapore',
    risk_tier: 'HIGH',
    kyc_status: 'VERIFIED',
    account_age_days: 365,
    occupation: 'Fintech Product Lead',
    monthly_income_usd: 14000,
    device_fingerprint: 'fp_21f9c890334a',
    linked_accounts_count: 3,
    total_historical_alerts: 2,
    avatar_seed: 'MV'
  },
  {
    id: 'cust_04',
    external_id: 'EXT-3041-US',
    name: 'David K. Morrison',
    email: 'dmorrison@texasoilservice.com',
    country: 'United States',
    city: 'Dallas, TX',
    risk_tier: 'CRITICAL',
    kyc_status: 'ENHANCED_DUE_DILIGENCE',
    account_age_days: 95,
    occupation: 'Equipment Contractor',
    monthly_income_usd: 7500,
    device_fingerprint: 'fp_9934110ee441',
    linked_accounts_count: 4,
    total_historical_alerts: 3,
    avatar_seed: 'DM'
  },
  {
    id: 'cust_05',
    external_id: 'EXT-7721-CH',
    name: 'Camilla Montgomery-Smyth',
    email: 'c.montgomery@genevaprivate.ch',
    country: 'Switzerland',
    city: 'Geneva',
    risk_tier: 'LOW',
    kyc_status: 'VERIFIED',
    account_age_days: 1420,
    occupation: 'Managing Partner, Family Office',
    monthly_income_usd: 95000,
    device_fingerprint: 'fp_3321ec89b012',
    linked_accounts_count: 8,
    total_historical_alerts: 1,
    avatar_seed: 'CM'
  },
  {
    id: 'cust_06',
    external_id: 'EXT-1049-AE',
    name: 'Tariq Al-Mansoor',
    email: 't.mansoor@gulfproperties.ae',
    country: 'United Arab Emirates',
    city: 'Dubai',
    risk_tier: 'MEDIUM',
    kyc_status: 'VERIFIED',
    account_age_days: 520,
    occupation: 'Commercial Real Estate Broker',
    monthly_income_usd: 28000,
    device_fingerprint: 'fp_7720ba44199c',
    linked_accounts_count: 6,
    total_historical_alerts: 1,
    avatar_seed: 'TA'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Vikram Patel (Smurfing cluster)
  {
    id: 'txn_smurf_12',
    customer_id: 'cust_01',
    amount: 142.50,
    currency: 'GBP',
    timestamp: '2026-09-07T09:42:10Z',
    sender: 'Vikram Patel',
    recipient: 'MoonPay Gateway 09',
    recipient_bank: 'ClearBank Ltd',
    recipient_country: 'GB',
    channel: 'CARD',
    device_id: 'dev_unknown_macbook_v8',
    ip_address: '185.220.101.45',
    location_country: 'GB',
    location_city: 'London',
    status: 'FLAGGED',
    is_trigger: true
  },
  {
    id: 'txn_smurf_11',
    customer_id: 'cust_01',
    amount: 125.00,
    currency: 'GBP',
    timestamp: '2026-09-07T09:41:45Z',
    sender: 'Vikram Patel',
    recipient: 'MoonPay Gateway 09',
    recipient_bank: 'ClearBank Ltd',
    recipient_country: 'GB',
    channel: 'CARD',
    device_id: 'dev_unknown_macbook_v8',
    ip_address: '185.220.101.45',
    location_country: 'GB',
    location_city: 'London',
    status: 'SETTLED',
    is_trigger: false
  },
  {
    id: 'txn_smurf_10',
    customer_id: 'cust_01',
    amount: 160.00,
    currency: 'GBP',
    timestamp: '2026-09-07T09:41:12Z',
    sender: 'Vikram Patel',
    recipient: 'BitPay Escrow EU',
    recipient_bank: 'Banking Circle S.A.',
    recipient_country: 'LU',
    channel: 'CARD',
    device_id: 'dev_unknown_macbook_v8',
    ip_address: '185.220.101.45',
    location_country: 'GB',
    location_city: 'London',
    status: 'SETTLED',
    is_trigger: false
  },
  {
    id: 'txn_smurf_09',
    customer_id: 'cust_01',
    amount: 110.00,
    currency: 'GBP',
    timestamp: '2026-09-07T09:40:30Z',
    sender: 'Vikram Patel',
    recipient: 'Binance Pay Direct',
    recipient_bank: 'Lithuania Bankas',
    recipient_country: 'LT',
    channel: 'CARD',
    device_id: 'dev_unknown_macbook_v8',
    ip_address: '185.220.101.45',
    location_country: 'GB',
    location_city: 'London',
    status: 'SETTLED',
    is_trigger: false
  },
  {
    id: 'txn_vp_hist_01',
    customer_id: 'cust_01',
    amount: 45.20,
    currency: 'GBP',
    timestamp: '2026-08-28T14:15:00Z',
    sender: 'Vikram Patel',
    recipient: 'Sainsbury Supermarket',
    recipient_bank: 'Barclays Bank UK',
    recipient_country: 'GB',
    channel: 'CARD',
    device_id: 'fp_a98f71c4992e',
    ip_address: '82.132.221.19',
    location_country: 'GB',
    location_city: 'Manchester',
    status: 'SETTLED',
    is_trigger: false
  },
  {
    id: 'txn_vp_hist_02',
    customer_id: 'cust_01',
    amount: 2200.00,
    currency: 'GBP',
    timestamp: '2026-08-30T09:00:00Z',
    sender: 'Horizon Logistics Ltd',
    recipient: 'Vikram Patel',
    recipient_bank: 'NatWest Bank',
    recipient_country: 'GB',
    channel: 'FASTER_PAYMENTS',
    device_id: 'fp_a98f71c4992e',
    ip_address: '82.132.221.19',
    location_country: 'GB',
    location_city: 'Manchester',
    status: 'SETTLED',
    is_trigger: false
  },

  // Elena Rostova (Wire to high risk jurisdiction)
  {
    id: 'txn_wire_trigger',
    customer_id: 'cust_02',
    amount: 48500.00,
    currency: 'EUR',
    timestamp: '2026-09-07T08:15:22Z',
    sender: 'Elena Rostova',
    recipient: 'Vanguard Global Transit FZE',
    recipient_bank: 'Mashreq Neo Offshore',
    recipient_country: 'AE',
    channel: 'WIRE',
    device_id: 'dev_emu_nexus6p_android14',
    ip_address: '194.26.29.11',
    location_country: 'SC', // Seychelles IP
    location_city: 'Victoria',
    status: 'FLAGGED',
    is_trigger: true
  },
  {
    id: 'txn_er_hist_01',
    customer_id: 'cust_02',
    amount: 3200.00,
    currency: 'EUR',
    timestamp: '2026-08-20T11:20:00Z',
    sender: 'Elena Rostova',
    recipient: 'Hellenic Shipping Supplies',
    recipient_bank: 'Bank of Cyprus',
    recipient_country: 'CY',
    channel: 'WIRE',
    device_id: 'fp_5510b299de81',
    ip_address: '94.230.12.8',
    location_country: 'CY',
    location_city: 'Limassol',
    status: 'SETTLED',
    is_trigger: false
  },

  // Marcus Vance (Geo Jump)
  {
    id: 'txn_geo_trigger',
    customer_id: 'cust_03',
    amount: 5000.00,
    currency: 'USD',
    timestamp: '2026-09-07T07:22:15Z',
    sender: 'Marcus Vance',
    recipient: 'DBS ATM Marina Bay Sands',
    recipient_bank: 'DBS Bank SG',
    recipient_country: 'SG',
    channel: 'CARD',
    device_id: 'dev_iphone15_sg',
    ip_address: '118.200.41.90',
    location_country: 'SG',
    location_city: 'Singapore',
    status: 'FLAGGED',
    is_trigger: true
  },
  {
    id: 'txn_mv_london',
    customer_id: 'cust_03',
    amount: 28.50,
    currency: 'GBP',
    timestamp: '2026-09-07T07:04:00Z', // 18 mins earlier in London!
    sender: 'Marcus Vance',
    recipient: 'Pret A Manger Canary Wharf',
    recipient_bank: 'HSBC UK',
    recipient_country: 'GB',
    channel: 'CARD',
    device_id: 'fp_21f9c890334a',
    ip_address: '81.144.170.2',
    location_country: 'GB',
    location_city: 'London',
    status: 'SETTLED',
    is_trigger: false
  },

  // David Morrison (Structuring)
  {
    id: 'txn_struct_03',
    customer_id: 'cust_04',
    amount: 9850.00,
    currency: 'USD',
    timestamp: '2026-09-07T06:10:00Z',
    sender: 'David K. Morrison (Cash ATM)',
    recipient: 'David K. Morrison Primary Checking',
    recipient_bank: 'JPMorgan Chase',
    recipient_country: 'US',
    channel: 'ACH',
    device_id: 'fp_9934110ee441',
    ip_address: '74.120.90.11',
    location_country: 'US',
    location_city: 'Fort Worth, TX',
    status: 'FLAGGED',
    is_trigger: true
  },
  {
    id: 'txn_struct_02',
    customer_id: 'cust_04',
    amount: 9900.00,
    currency: 'USD',
    timestamp: '2026-09-06T18:40:00Z',
    sender: 'David K. Morrison (Cash ATM)',
    recipient: 'David K. Morrison Primary Checking',
    recipient_bank: 'JPMorgan Chase',
    recipient_country: 'US',
    channel: 'ACH',
    device_id: 'fp_9934110ee441',
    ip_address: '74.120.90.11',
    location_country: 'US',
    location_city: 'Arlington, TX',
    status: 'SETTLED',
    is_trigger: false
  },
  {
    id: 'txn_struct_01',
    customer_id: 'cust_04',
    amount: 9750.00,
    currency: 'USD',
    timestamp: '2026-09-05T14:15:00Z',
    sender: 'David K. Morrison (Cash ATM)',
    recipient: 'David K. Morrison Primary Checking',
    recipient_bank: 'JPMorgan Chase',
    recipient_country: 'US',
    channel: 'ACH',
    device_id: 'fp_9934110ee441',
    ip_address: '74.120.90.11',
    location_country: 'US',
    location_city: 'Dallas, TX',
    status: 'SETTLED',
    is_trigger: false
  },

  // Camilla Montgomery (HNW False Positive)
  {
    id: 'txn_hnw_trigger',
    customer_id: 'cust_05',
    amount: 34000.00,
    currency: 'CHF',
    timestamp: '2026-09-07T05:50:00Z',
    sender: 'Camilla Montgomery-Smyth',
    recipient: 'Galerie d\'Art Moderne Genève',
    recipient_bank: 'UBS Switzerland AG',
    recipient_country: 'CH',
    channel: 'WIRE',
    device_id: 'fp_3321ec89b012',
    ip_address: '178.196.44.12',
    location_country: 'CH',
    location_city: 'Geneva',
    status: 'FLAGGED',
    is_trigger: true
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-2026-0901',
    customer_id: 'cust_01',
    transaction_id: 'txn_smurf_12',
    alert_type: 'RAPID_VELOCITY',
    risk_score: 93,
    triggered_rule: 'RULE_VELOCITY_BURST_4MIN: >10 micro-txns to crypto offramp',
    status: 'AI_REVIEWED',
    priority: 'P1_CRITICAL',
    created_at: '2026-09-07T09:42:12Z',
    customer: INITIAL_CUSTOMERS[0],
    transaction: INITIAL_TRANSACTIONS[0],
    ml_prediction: {
      id: 'mlp_01',
      alert_id: 'ALT-2026-0901',
      fraud_probability: 0.89,
      anomaly_score: 0.93,
      risk_band: 'CRITICAL',
      model_version: 'ensemble-v2.4-duckdb',
      velocity_90d_ratio: 8.4,
      models_breakdown: {
        isolation_forest: 0.94,
        lof: 0.88,
        ocsvm: 0.91,
        kmeans: 0.82,
        xgboost: 0.89
      },
      signals: [
        'VELOCITY_BURST_8.4X_BASELINE',
        'UNRECOGNIZED_DEVICE_HARDWARE_HASH',
        'AUTOMATED_TIME_DELTA_CV_UNDER_0.05',
        'CRYPTO_VASP_CONCENTRATION'
      ],
      explanation: 'Isolation Forest detected extreme outlier in 5-minute transaction velocity (score: 0.94). PCA creditcard components V12 and V14 shifted > 3.8 standard deviations. DuckDB rolling query indicates zero historical card volume of this cadence.'
    },
    ai_recommendation: {
      id: 'rec_01',
      case_id: 'ALT-2026-0901',
      disposition: 'ESCALATE',
      confidence: 94,
      riskLevel: 'CRITICAL',
      rationale: 'Transaction is the 12th in a 4-minute smurfing cluster totaling £1,420 targeting crypto off-ramps (MoonPay/BitPay) from an unverified macOS hardware GUID. 90-day velocity is 8.4x baseline. Behavior matches automated mule smurfing typology.',
      redFlags: [
        '12 transactions dispatched in 238 seconds across 3 virtual cards (interval std dev = 1.4s)',
        '100% of outflows directed to high-velocity crypto VASP gateways (MoonPay, BitPay)',
        'Device fingerprint mismatch: hardware hash fp_a98f71c4992e replaced by dev_unknown_macbook_v8',
        'Outflow velocity ratio 8.4x above customer\'s 90-day median (£120/day)'
      ],
      supportingEvidence: [
        'customer.risk_tier: HIGH',
        'customer.kyc_status: ENHANCED_DUE_DILIGENCE',
        'transaction.channel: CARD',
        'ml_prediction.isolation_forest: 0.94',
        'ml_prediction.velocity_90d_ratio: 8.4'
      ],
      contradictoryEvidence: [
        'IP geolocation matches residential ISP in Manchester (same municipal area as KYC address)'
      ],
      recommendedNextSteps: [
        'Apply temporary freeze on virtual card sub-identifiers VIRT-901 to VIRT-912',
        'Trigger step-up biometric SMS/Passkey challenge for active session dev_unknown_macbook_v8',
        'Escalate to Senior Financial Crime Investigator for MLRO STR consideration'
      ],
      mlScoreAssessment: 'DuckDB ML ensemble fraud probability (0.89) strongly corroborated by deterministic temporal spacing (<4s variance) and merchant novelty.',
      investigationSummary: 'High-confidence automated mule layering. Recommend immediate human confirmation to freeze virtual card portfolio before off-ramp settlement completes.',
      generated_at: '2026-09-07T09:42:15Z',
      model_used: 'claude-3-7-sonnet'
    }
  },
  {
    id: 'ALT-2026-0902',
    customer_id: 'cust_02',
    transaction_id: 'txn_wire_trigger',
    alert_type: 'HIGH_VALUE_WIRE',
    risk_score: 96,
    triggered_rule: 'RULE_WIRE_NEW_DEVICE_OVER_25K: Outbound wire >$25k on device <24h old',
    status: 'AI_REVIEWED',
    priority: 'P1_CRITICAL',
    created_at: '2026-09-07T08:15:25Z',
    customer: INITIAL_CUSTOMERS[1],
    transaction: INITIAL_TRANSACTIONS[6],
    ml_prediction: {
      id: 'mlp_02',
      alert_id: 'ALT-2026-0902',
      fraud_probability: 0.95,
      anomaly_score: 0.96,
      risk_band: 'CRITICAL',
      model_version: 'ensemble-v2.4-duckdb',
      velocity_90d_ratio: 14.2,
      models_breakdown: {
        isolation_forest: 0.97,
        lof: 0.93,
        ocsvm: 0.95,
        kmeans: 0.91,
        xgboost: 0.96
      },
      signals: [
        'ANDROID_EMULATOR_FINGERPRINT',
        'OFFSHORE_JURISDICTION_FIRST_SEEN',
        'AMOUNT_1400_PERCENT_OF_90D_AVG',
        'AUTH_TO_WIRE_DELTA_UNDER_10MIN'
      ],
      explanation: 'XGBoost supervised score 0.96. Wire initiated 9 minutes following credentials login on an Android 14 emulator with fake baseband build ID. Offshore beneficiary with zero ledger history.'
    },
    ai_recommendation: {
      id: 'rec_02',
      case_id: 'ALT-2026-0902',
      disposition: 'ESCALATE',
      confidence: 96,
      riskLevel: 'CRITICAL',
      rationale: 'Critical Account Takeover (ATO) profile: €48,500 outgoing wire to UAE beneficiary initiated within 9 minutes of session setup on an Android emulator connecting through a Seychelles VPN, completely deviating from customer Cyprus maritime history.',
      redFlags: [
        'Device hardware report indicates Bluestacks / QEMU Android emulator fingerprint',
        'Beneficiary Vanguard Global Transit FZE has no prior invoicing in Baltic-Trade ledger',
        'Login IP origin (Seychelles) deviates 3,800 miles from primary registered office in Limassol',
        'Amount €48,500 drains 88% of liquid operating balance in single transaction'
      ],
      supportingEvidence: [
        'customer.occupation: Import / Export Director',
        'transaction.recipient_country: AE',
        'ml_prediction.fraud_probability: 0.95',
        'device.is_emulator: true'
      ],
      contradictoryEvidence: [
        'Customer operates legitimate international trade business with occasional overseas suppliers'
      ],
      recommendedNextSteps: [
        'Immediately place administrative hold on outgoing SWIFT MT103 message',
        'Out-of-band telephone verification to customer primary phone number on file',
        'Terminate active session dev_emu_nexus6p_android14 and revoke API tokens'
      ],
      mlScoreAssessment: 'Extreme corroboration between ML anomaly score (0.96) and hardware virtualization flags.',
      investigationSummary: 'Suspected corporate account takeover. Hold wire pending live verbal voice verification with designated compliance signatory.',
      generated_at: '2026-09-07T08:15:30Z',
      model_used: 'claude-3-7-sonnet'
    }
  },
  {
    id: 'ALT-2026-0903',
    customer_id: 'cust_03',
    transaction_id: 'txn_geo_trigger',
    alert_type: 'GEOLOCATION_JUMP',
    risk_score: 91,
    triggered_rule: 'RULE_IMPOSSIBLE_TRAVEL_VELOCITY: >500mph between consecutive auth events',
    status: 'AI_REVIEWED',
    priority: 'P2_HIGH',
    created_at: '2026-09-07T07:22:20Z',
    customer: INITIAL_CUSTOMERS[2],
    transaction: INITIAL_TRANSACTIONS[8],
    ml_prediction: {
      id: 'mlp_03',
      alert_id: 'ALT-2026-0903',
      fraud_probability: 0.88,
      anomaly_score: 0.91,
      risk_band: 'HIGH',
      model_version: 'ensemble-v2.4-duckdb',
      velocity_90d_ratio: 3.1,
      models_breakdown: {
        isolation_forest: 0.89,
        lof: 0.92,
        ocsvm: 0.87,
        kmeans: 0.84,
        xgboost: 0.88
      },
      signals: [
        'CALCULATED_SPEED_22466_MPH',
        'SIMULTANEOUS_CONCURRENT_SESSIONS',
        'HIGH_VALUE_ATM_QUERY_FOREIGN_NETWORK'
      ],
      explanation: 'Geographic distance calculation: London (51.5074°N, 0.1278°W) to Singapore (1.3521°N, 103.8198°E) is 6,740 miles. Delta t = 18 minutes (speed 22,466 mph), violating physical laws.'
    },
    ai_recommendation: {
      id: 'rec_03',
      case_id: 'ALT-2026-0903',
      disposition: 'ESCALATE',
      confidence: 91,
      riskLevel: 'HIGH',
      rationale: 'Impossible travel alert: Authenticated card use in London Canary Wharf occurred just 18 minutes prior to $5,000 cash withdrawal attempt in Singapore. Mathematical velocity of 22,466 mph confirms physical cloning or relay attack.',
      redFlags: [
        'Spatial-temporal impossibility: 6,740 nautical miles covered in 18 minutes',
        'Concurrent active card tokens on two disparate continents',
        'Singapore withdrawal attempt executed at maximum single-day ATM foreign limit ($5,000)'
      ],
      supportingEvidence: [
        'txn_mv_london.timestamp: 07:04:00Z (London)',
        'txn_geo_trigger.timestamp: 07:22:15Z (Singapore)',
        'calculated_speed: 22,466 mph'
      ],
      contradictoryEvidence: [
        'Customer frequently travels to Singapore office on bi-monthly rotation'
      ],
      recommendedNextSteps: [
        'Temporarily disable physical card ATM withdrawal capability',
        'Push in-app push authorization prompt to registered iPhone in London',
        'Review ATM camera stills if requested via network chargeback'
      ],
      mlScoreAssessment: 'Ensemble score 0.91 derived from kinematic physical impossibility calculation.',
      investigationSummary: 'Card cloning or proxy relay attack confirmed. Block international ATM channel until user confirms current physical location.',
      generated_at: '2026-09-07T07:22:25Z',
      model_used: 'claude-3-7-sonnet'
    }
  },
  {
    id: 'ALT-2026-0904',
    customer_id: 'cust_04',
    transaction_id: 'txn_struct_03',
    alert_type: 'STRUCTURING_SMURFING',
    risk_score: 92,
    triggered_rule: 'RULE_STRUCTURING_SUB_CTR: >=3 cash deposits $9,000-$9,999 in 72h',
    status: 'AI_REVIEWED',
    priority: 'P2_HIGH',
    created_at: '2026-09-07T06:10:05Z',
    customer: INITIAL_CUSTOMERS[3],
    transaction: INITIAL_TRANSACTIONS[10],
    ml_prediction: {
      id: 'mlp_04',
      alert_id: 'ALT-2026-0904',
      fraud_probability: 0.91,
      anomaly_score: 0.92,
      risk_band: 'HIGH',
      model_version: 'ensemble-v2.4-duckdb',
      velocity_90d_ratio: 5.8,
      models_breakdown: {
        isolation_forest: 0.92,
        lof: 0.89,
        ocsvm: 0.91,
        kmeans: 0.87,
        xgboost: 0.90
      },
      signals: [
        'CTR_AVOIDANCE_CONVERGENCE_BAND',
        'BRANCH_HOPPING_METROPOLITAN_CLUSTER',
        'TOTAL_AGGREGATE_EXCEEDS_25K'
      ],
      explanation: 'Benford law and clustering analysis shows intentional grouping in $9,750 - $9,900 range (p-value < 0.001) avoiding mandatory $10,000 Currency Transaction Report.'
    },
    ai_recommendation: {
      id: 'rec_04',
      case_id: 'ALT-2026-0904',
      disposition: 'ESCALATE',
      confidence: 93,
      riskLevel: 'HIGH',
      rationale: 'Pattern of classic cash structuring (smurfing): 3 physical ATM cash deposits of $9,850, $9,900, and $9,750 within 36 hours across 3 distinct Dallas-Fort Worth branches, totaling $29,500. Clear deliberate intent to bypass the $10,000 CTR filing threshold.',
      redFlags: [
        '3 consecutive cash deposits between $9,750 and $9,900 (98-99% of BSA threshold)',
        'Physical ATM branch rotation: Dallas, Arlington, Fort Worth across 36 hours',
        'Aggregate cash volume ($29,500) represents 393% of declared monthly income ($7,500)'
      ],
      supportingEvidence: [
        'customer.monthly_income_usd: $7,500',
        'aggregate_36h_cash: $29,500',
        'rule: RULE_STRUCTURING_SUB_CTR'
      ],
      contradictoryEvidence: [
        'Customer operates industrial equipment servicing business with cash payments'
      ],
      recommendedNextSteps: [
        'Refer file to AML Operations Lead for Form 111 Suspicious Activity Report (SAR)',
        'Issue request for Source of Funds (SOF) documentation and equipment invoices',
        'Flag account for 90-day automated cash monitor'
      ],
      mlScoreAssessment: 'Supervised and unsupervised models align at 0.92, corroborating regulatory evasion typology.',
      investigationSummary: 'Deliberate structuring pattern meeting FinCEN SAR filing criteria. Tier 1 recommendation: human analyst review for SAR escalation.',
      generated_at: '2026-09-07T06:10:10Z',
      model_used: 'claude-3-7-sonnet'
    }
  },
  {
    id: 'ALT-2026-0905',
    customer_id: 'cust_05',
    transaction_id: 'txn_hnw_trigger',
    alert_type: 'HIGH_VALUE_WIRE',
    risk_score: 32,
    triggered_rule: 'RULE_SINGLE_TRANSACTION_OVER_30K: Absolute amount threshold triggered',
    status: 'AI_REVIEWED',
    priority: 'P3_MEDIUM',
    created_at: '2026-09-07T05:50:05Z',
    customer: INITIAL_CUSTOMERS[4],
    transaction: INITIAL_TRANSACTIONS[13],
    ml_prediction: {
      id: 'mlp_05',
      alert_id: 'ALT-2026-0905',
      fraud_probability: 0.08,
      anomaly_score: 0.28,
      risk_band: 'LOW',
      model_version: 'ensemble-v2.4-duckdb',
      velocity_90d_ratio: 0.9,
      models_breakdown: {
        isolation_forest: 0.24,
        lof: 0.21,
        ocsvm: 0.19,
        kmeans: 0.22,
        xgboost: 0.08
      },
      signals: [
        'WEALTH_PROFILE_MATCH_VERIFIED',
        'BIOMETRIC_PASSKEY_CONFIRMED',
        'LOCAL_MERCHANT_CORRESPONDENCE'
      ],
      explanation: 'While absolute amount CHF 34,000 crossed static legacy rule, behavioral ML model shows normal deviation. Net worth percentile >99.4%, trusted device fingerprint matched.'
    },
    ai_recommendation: {
      id: 'rec_05',
      case_id: 'ALT-2026-0905',
      disposition: 'CLEAR',
      confidence: 89,
      riskLevel: 'LOW',
      rationale: 'Clear false positive generated by legacy static dollar ceiling. Customer declared monthly income is $95,000 (CHF 34k represents ~35% of monthly income). Transaction was authenticated via trusted iOS passkey on registered home network to a verified Geneva art institution.',
      redFlags: [],
      supportingEvidence: [
        'customer.monthly_income_usd: $95,000',
        'device.fingerprint_match: 100%',
        'merchant.registry: Verified Swiss Enterprise Registry IDE CHE-108.921.442',
        'ml_prediction.fraud_probability: 0.08'
      ],
      contradictoryEvidence: [
        'None identified; wire aligns with historical seasonal art patronage'
      ],
      recommendedNextSteps: [
        'Approve CLEAR recommendation and log automated false-positive clearance',
        'Maintain current Low Risk tier without customer outreach'
      ],
      mlScoreAssessment: 'ML anomaly score 0.28 demonstrates legacy rule failure; transaction is standard high-net-worth discretionary spending.',
      investigationSummary: 'Safe false positive to CLEAR. Proves how Veritas eliminates wasted analyst hours on affluent customer routine purchases.',
      generated_at: '2026-09-07T05:50:10Z',
      model_used: 'claude-3-7-sonnet'
    }
  }
];

export const INITIAL_HERMES_MEMORIES: HermesMemory[] = [
  {
    id: 'mem_01',
    memory_type: 'SEMANTIC',
    title: 'Typology: Virtual Card Micro-Smurfing to Crypto Off-Ramps',
    content: 'Recognize rapid clusters of 8-15 card charges under £200 within 5 minutes targeting MoonPay, BitPay, or Banxa. Characteristics: time delta variance <1.5s (automated bot execution), randomized cents, new device hardware hash. Historical false-positive rate: 4.2%.',
    confidence: 0.94,
    tags: ['SMURFING', 'CRYPTO_VASP', 'BOT_EXECUTION', 'CARD_VELOCITY'],
    created_at: '2026-09-06T18:30:00Z',
    case_reference: 'ALT-2026-0889'
  },
  {
    id: 'mem_02',
    memory_type: 'SKILL',
    title: 'Investigation Procedure: Cross-Border Wire Device Virtualization Audit',
    content: '1. Inspect user agent build tags for emulator fingerprints (qemu, bluestacks, genymotion, fake baseband). 2. Compare IP autonomous system (AS) with KYC registered jurisdiction. 3. Check if wire beneficiary received >$50k within 48h of account opening. 4. If all 3 true, escalate to P1 freeze hold.',
    confidence: 0.96,
    tags: ['PROCEDURE', 'ATO', 'EMULATOR', 'WIRE_FREEZE'],
    created_at: '2026-09-05T12:00:00Z'
  },
  {
    id: 'mem_03',
    memory_type: 'FEEDBACK',
    title: 'Analyst Override: Seasonal Q4 Art Patronage High-Net-Worth Exemption',
    content: 'Compliance Lead (Sarah Jenkins) approved override on Case ALT-2026-0810: Camilla Montgomery-Smyth and similar Family Office Tier customers make annual Swiss gallery acquisitions in Sept/Oct. Do not flag wires <$100k to registered Art Galleries if passkey authenticated.',
    confidence: 0.91,
    tags: ['ANALYST_OVERRIDE', 'HNW_EXCEPTION', 'ART_GALLERY', 'SWISS'],
    created_at: '2026-09-04T15:20:00Z',
    case_reference: 'ALT-2026-0810'
  },
  {
    id: 'mem_04',
    memory_type: 'EPISODIC',
    title: 'Resolved Ground Truth: Impossible Travel Proxy Relay Attack',
    content: 'Investigation ALT-2026-0792 confirmed card skimming ring in Southeast Asia using copied magnetic stripe data while UK cardholder retained physical card in London. London-Singapore concurrent auth confirmed ground truth fraud within 24h.',
    confidence: 0.98,
    tags: ['GROUND_TRUTH', 'GEO_JUMP', 'CARD_CLONE', 'CONFIRMED_FRAUD'],
    created_at: '2026-09-03T09:14:00Z',
    case_reference: 'ALT-2026-0792'
  }
];

export const INITIAL_CANDIDATE_RULES: HermesCandidateRule[] = [
  {
    id: 'rule_cand_42',
    title: 'Proposed Heuristic #42: Flag Neobank Micro-Deposits within 2h of KYC',
    description: 'Hermes detected 14 recurring mule accounts using instant £1.00 micro-deposits from neobanks immediately after KYC tier upgrade before executing rapid velocity smurfing.',
    rule_logic: 'IF customer.account_age_days <= 3 AND count(micro_deposit < £5.00 in 2h) >= 3 THEN risk_score += 45 AND flag(PRE_SMURFING_PING)',
    status: 'IN_REVIEW',
    impact_cases_count: 14,
    proposed_at: '2026-09-06T20:15:00Z',
    reviewed_by: 'Sarah Jenkins (MLRO)',
    rationale: 'Observed in 14 confirmed fraud cases over past 14 days with zero false positives on legitimate commerce.'
  },
  {
    id: 'rule_cand_43',
    title: 'Proposed Heuristic #43: Dynamic Threshold Scaling for Family Office Tier',
    description: 'Auto-adjust static $30k wire threshold to 40% of verified monthly declared income for Tier 1 HNW customers to eliminate 85% of luxury gallery false positives.',
    rule_logic: 'IF customer.risk_tier == "LOW" AND customer.monthly_income_usd >= 50000 AND transaction.amount <= (0.40 * customer.monthly_income_usd) AND merchant.category in ["FINE_ART", "AUCTION", "CHARTER"] THEN suppress_alert(STATIC_AMOUNT_RULE)',
    status: 'APPROVED',
    impact_cases_count: 38,
    proposed_at: '2026-09-05T14:10:00Z',
    reviewed_by: 'Marcus Brody (Head of Compliance)',
    rationale: 'Derived from 38 analyst false-positive clearances over 60 days. Passed internal audit committee review.'
  },
  {
    id: 'rule_cand_44',
    title: 'Proposed Heuristic #44: Impossible Kinematic Travel Filter with Flight Telemetry',
    description: 'Incorporate flight duration lookup table before raising GEOLOCATION_JUMP alerts to distinguish legitimate trans-continental supersonic flights from concurrent proxy relay clones.',
    rule_logic: 'IF delta_distance_miles / delta_hours > 600 THEN alert(IMPOSSIBLE_TRAVEL) ELSE IF scheduled_flight_detected THEN refer(TRAVEL_CORROBORATED)',
    status: 'PROPOSED',
    impact_cases_count: 9,
    proposed_at: '2026-09-07T01:30:00Z',
    rationale: 'Drafted automatically by Hermes after analyzing 9 business traveler false positives in last 72 hours.'
  }
];

export const INITIAL_MODEL_REGISTRY: ModelRegistryItem[] = [
  {
    id: 'mod_01',
    model_name: 'Isolation Forest (DuckDB Engineered)',
    version: 'v2.4.1',
    algorithm: 'Unsupervised Isolation Tree Ensemble (n_estimators=150)',
    pr_auc: 0.884,
    precision_score: 0.892,
    recall_score: 0.875,
    anomaly_threshold: 0.72,
    latency_ms: 12,
    status: 'PRODUCTION',
    feature_importance_top: ['velocity_90d_ratio', 'amount_z_score', 'temporal_delta_variance', 'device_entropy']
  },
  {
    id: 'mod_02',
    model_name: 'XGBoost Supervised Fraud Classifier',
    version: 'v3.1.0',
    algorithm: 'Gradient Boosted Decision Trees (CreditCard Benchmark + Tabular)',
    pr_auc: 0.938,
    precision_score: 0.941,
    recall_score: 0.912,
    anomaly_threshold: 0.65,
    latency_ms: 18,
    status: 'PRODUCTION',
    feature_importance_top: ['PCA_V14', 'PCA_V12', 'velocity_90d_ratio', 'country_risk_weight', 'device_is_emulator']
  },
  {
    id: 'mod_03',
    model_name: 'Local Outlier Factor (LOF)',
    version: 'v1.8.0',
    algorithm: 'Density-based Local Outlier Factor (k_neighbors=25)',
    pr_auc: 0.841,
    precision_score: 0.835,
    recall_score: 0.860,
    anomaly_threshold: 1.45,
    latency_ms: 34,
    status: 'EXPERIMENTAL',
    feature_importance_top: ['amount', 'hour_of_day', 'recipient_novelty_score', 'geo_distance_km']
  },
  {
    id: 'mod_04',
    model_name: 'One-Class SVM (OCSVM)',
    version: 'v1.2.4',
    algorithm: 'Support Vector Boundary Estimation (RBF Kernel, nu=0.05)',
    pr_auc: 0.812,
    precision_score: 0.804,
    recall_score: 0.842,
    anomaly_threshold: 0.00,
    latency_ms: 45,
    status: 'EXPERIMENTAL',
    feature_importance_top: ['PCA_V17', 'PCA_V10', 'rolling_std_amount_30d', 'login_delta_sec']
  },
  {
    id: 'mod_05',
    model_name: 'K-Means Cluster Distance',
    version: 'v2.0.0',
    algorithm: 'Centroid Distance Outlier Detection (k=12 clusters)',
    pr_auc: 0.765,
    precision_score: 0.750,
    recall_score: 0.810,
    anomaly_threshold: 3.20,
    latency_ms: 8,
    status: 'EXPERIMENTAL',
    feature_importance_top: ['cluster_euclidean_distance', 'monthly_income_ratio', 'channel_encoded']
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'AUD-88219',
    timestamp: '2026-09-07T09:42:15Z',
    actor: 'system:n8n_intake_webhook',
    action: 'ALERT_INGESTED',
    entity_type: 'ALERT',
    entity_id: 'ALT-2026-0901',
    evidence_hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    details: 'Received raw webhook payload from transaction ingest queue. Parallel fetch dispatched.'
  },
  {
    id: 'AUD-88220',
    timestamp: '2026-09-07T09:42:16Z',
    actor: 'service:python_ml_duckdb',
    action: 'ML_INFERENCE_EMITTED',
    entity_type: 'ML_PREDICTION',
    entity_id: 'mlp_01',
    evidence_hash: 'sha256:8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    details: 'Calculated 90-day velocity ratio 8.4x. Isolation forest score 0.94. Anomaly score 0.93.'
  },
  {
    id: 'AUD-88221',
    timestamp: '2026-09-07T09:42:18Z',
    actor: 'agent:anthropic_claude_sonnet',
    action: 'AI_RECOMMENDATION_GENERATED',
    entity_type: 'AI_RECOMMENDATION',
    entity_id: 'rec_01',
    evidence_hash: 'sha256:3a7bd3e2360a3d29eea436fcfb7e44c735d117c42d1c1835420b6b9942dd4f1b',
    details: 'Strict JSON recommendation generated: ESCALATE (Confidence: 94%). Cited 4 red flags.'
  }
];

export const MOCK_TREND_DATA = [
  { time: '00:00', totalAlerts: 14, mlAnomalies: 3, falsePositivesCleared: 10, medianTriageMin: 4.1 },
  { time: '03:00', totalAlerts: 18, mlAnomalies: 4, falsePositivesCleared: 13, medianTriageMin: 3.9 },
  { time: '06:00', totalAlerts: 24, mlAnomalies: 7, falsePositivesCleared: 16, medianTriageMin: 3.7 },
  { time: '09:00', totalAlerts: 48, mlAnomalies: 15, falsePositivesCleared: 31, medianTriageMin: 3.5 },
  { time: '12:00', totalAlerts: 42, mlAnomalies: 11, falsePositivesCleared: 28, medianTriageMin: 3.6 },
  { time: '15:00', totalAlerts: 56, mlAnomalies: 16, falsePositivesCleared: 37, medianTriageMin: 3.8 },
  { time: '18:00', totalAlerts: 39, mlAnomalies: 9, falsePositivesCleared: 27, medianTriageMin: 3.7 },
  { time: '21:00', totalAlerts: 29, mlAnomalies: 6, falsePositivesCleared: 21, medianTriageMin: 3.9 },
  { time: 'Now', totalAlerts: 35, mlAnomalies: 8, falsePositivesCleared: 24, medianTriageMin: 3.8 }
];
