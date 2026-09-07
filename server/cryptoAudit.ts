import crypto from 'crypto';

export interface CryptographicAuditEntry {
  id: string;
  sequence_number: number;
  timestamp: string;
  actor: string;
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details: string;
  previous_hash: string;
  evidence_hash: string;
}

export const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Computes canonical payload string for deterministic SHA-256 hashing.
 */
export function getCanonicalPayload(entry: Omit<CryptographicAuditEntry, 'sequence_number' | 'evidence_hash'>): string {
  const normalized = {
    id: entry.id,
    timestamp: entry.timestamp,
    actor: entry.actor,
    actor_id: entry.actor_id || '',
    action: entry.action,
    entity_type: entry.entity_type,
    entity_id: entry.entity_id,
    details: entry.details,
    previous_hash: entry.previous_hash
  };
  return JSON.stringify(normalized);
}

/**
 * Computes a genuine SHA-256 hash over canonical payload chained with previous hash.
 */
export function computeEvidenceHash(
  entry: any
): string {
  if (entry && entry.id && entry.timestamp && entry.action) {
    const canonical = getCanonicalPayload(entry);
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }
  return crypto.createHash('sha256').update(JSON.stringify(entry)).digest('hex');
}

/**
 * Creates and hashes a new audit entry chained to the latest log entry.
 */
export function createChainedAuditEntry(
  params: {
    actor: string;
    actor_id?: string;
    action: string;
    entity_type: string;
    entity_id: string;
    details: string;
  },
  lastEntry?: CryptographicAuditEntry | null
): CryptographicAuditEntry {
  const sequence_number = lastEntry ? lastEntry.sequence_number + 1 : 1;
  const previous_hash = lastEntry ? lastEntry.evidence_hash : GENESIS_HASH;
  const timestamp = new Date().toISOString();
  const id = `AUD-${Date.now().toString().slice(-6)}-${sequence_number.toString().padStart(4, '0')}`;

  const partial = {
    id,
    timestamp,
    actor: params.actor,
    actor_id: params.actor_id || 'system',
    action: params.action,
    entity_type: params.entity_type,
    entity_id: params.entity_id,
    details: params.details,
    previous_hash
  };

  const evidence_hash = computeEvidenceHash(partial);

  return {
    ...partial,
    sequence_number,
    evidence_hash
  };
}

/**
 * Mathematically validates the integrity of the audit log chain from genesis to tip.
 */
export function verifyAuditChain(entries: CryptographicAuditEntry[]): {
  isValid: boolean;
  count: number;
  brokenIndex?: number;
  message: string;
} {
  if (entries.length === 0) {
    return { isValid: true, count: 0, message: 'Audit log is empty (valid)' };
  }

  // Sort ascending by sequence number
  const sorted = [...entries].sort((a, b) => a.sequence_number - b.sequence_number);

  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const expectedPrevHash = i === 0 ? GENESIS_HASH : sorted[i - 1].evidence_hash;

    if (entry.previous_hash !== expectedPrevHash) {
      return {
        isValid: false,
        count: sorted.length,
        brokenIndex: i,
        message: `Broken chain link at sequence ${entry.sequence_number}: previous_hash does not match parent evidence_hash.`
      };
    }

    const computed = computeEvidenceHash({
      id: entry.id,
      timestamp: entry.timestamp,
      actor: entry.actor,
      actor_id: entry.actor_id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      details: entry.details,
      previous_hash: entry.previous_hash
    });

    if (computed !== entry.evidence_hash) {
      return {
        isValid: false,
        count: sorted.length,
        brokenIndex: i,
        message: `Tamper detected at sequence ${entry.sequence_number}: stored hash (${entry.evidence_hash}) does not match recalculated hash (${computed}).`
      };
    }
  }

  return {
    isValid: true,
    count: sorted.length,
    message: `All ${sorted.length} cryptographic audit blocks verified with zero tamper detected.`
  };
}
