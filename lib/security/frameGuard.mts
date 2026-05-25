// Deprecated: X-Frame-Options is now managed by helmet (P7-45).
// This export is kept for backward compatibility and will be removed in v6.
import type { Request, Response, NextFunction } from 'express';

/**
 * No-op middleware kept for backward compatibility. X-Frame-Options is now managed by helmet.
 *
 *
 * @deprecated Use helmet frameguard option instead. This no-op is kept for backward compatibility.
 */
export default function frameGuard (_keystone?: unknown): (_req: Request, _res: Response, next: NextFunction) => void {
	return function (_req: Request, _res: Response, next: NextFunction): void {
		next();
	};
}
