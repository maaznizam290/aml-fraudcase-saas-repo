import { Request, Response, NextFunction } from 'express';

export type UserRole = 'analyst' | 'compliance_officer';

export interface AuthenticatedUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  email: string;
}

export const KNOWN_USERS: Record<string, AuthenticatedUser> = {
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

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Extracts and validates authenticated user from Request headers.
 */
export function authenticateUserMiddleware(isDemoMode: boolean) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const userIdHeader = req.headers['x-user-id'] as string;

    let targetUserId = userIdHeader;
    if (!targetUserId && authHeader && authHeader.startsWith('Bearer ')) {
      targetUserId = authHeader.substring(7).trim();
    }

    if (targetUserId && KNOWN_USERS[targetUserId]) {
      req.user = KNOWN_USERS[targetUserId];
      return next();
    }

    // In demo mode, default gracefully to Sarah Jenkins if not specified
    if (isDemoMode) {
      req.user = KNOWN_USERS['usr_sarah_jenkins'];
      return next();
    }

    return res.status(401).json({
      error: 'UNAUTHORIZED',
      message: 'Missing or invalid authentication token. Provide x-user-id or Authorization header.'
    });
  };
}

/**
 * Requires one of the specified roles (e.g. ['compliance_officer'] for Hermes rule promotion).
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'UNAUTHORIZED',
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'FORBIDDEN_INSUFFICIENT_ROLE',
        message: `Action requires role: ${allowedRoles.join(' or ')}. User ${req.user.name} has role '${req.user.role}'. Only Chief Compliance Officer (CCO) can approve or deploy rules.`
      });
    }

    next();
  };
}

/**
 * Statutory Tier 3 Guardrail Middleware
 * Strictly prohibits automation or API endpoints that perform irreversible actions without statutory sovereign human signoff.
 */
export function tier3StatutoryGuardrail(actionName: string) {
  const BANNED_TIER3_ACTIONS = [
    'autonomous_account_closure',
    'autonomous_credit_denial',
    'autonomous_sar_filing',
    'autonomous_treasury_movement',
    'autonomous_release_held_funds'
  ];

  if (BANNED_TIER3_ACTIONS.includes(actionName)) {
    throw new Error(`[TIER_3_STATUTORY_VIOLATION] Autonomous action "${actionName}" is strictly forbidden under FinCEN/SBP AML regulatory guardrails.`);
  }
}
