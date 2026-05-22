import type { NextFunction, Request, RequestHandler, Response } from 'express';
import type { Keystone } from '../../../../index.mjs';

const DEFAULT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX_ATTEMPTS = 100;
const DEFAULT_LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const DEFAULT_LOCKOUT_MAX_FAILURES = 5;
const DEFAULT_LOCKOUT_DURATION_MS = 15 * 60 * 1000;

interface RateLimitConfig {
	enabled: boolean;
	windowMs: number;
	max: number;
}

interface LockoutConfig {
	enabled: boolean;
	windowMs: number;
	maxFailures: number;
	durationMs: number;
}

interface SigninSecurityConfig {
	rateLimit: RateLimitConfig;
	lockout: LockoutConfig;
}

interface AttemptBucket {
	count: number;
	resetAt: number;
}

interface CredentialBucket extends AttemptBucket {
	lockedUntil?: number;
}

interface SigninSecurityBlock {
	statusCode: number;
	body: {
		error: string;
		message: string;
		retryAfter: number;
	};
}

const ipAttempts = new Map<string, AttemptBucket>();
const credentialAttempts = new Map<string, CredentialBucket>();
let nextPruneAt = 0;

function readPositiveInteger(value: unknown, fallback: number): number {
	const numericValue = typeof value === 'string' && value.trim() !== ''
		? Number(value)
		: value;
	if (typeof numericValue !== 'number' || !Number.isFinite(numericValue)) {
		return fallback;
	}
	const integer = Math.floor(numericValue);
	return integer > 0 ? integer : fallback;
}

function readObjectOption(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

export function getSigninSecurityConfig(keystone: Keystone): SigninSecurityConfig {
	const rateLimitOption = keystone.get('signin rate limit');
	const lockoutOption = keystone.get('signin lockout');
	const rateLimitValues = readObjectOption(rateLimitOption);
	const lockoutValues = readObjectOption(lockoutOption);

	return {
		rateLimit: {
			enabled: rateLimitOption !== false,
			windowMs: readPositiveInteger(rateLimitValues.windowMs, DEFAULT_RATE_LIMIT_WINDOW_MS),
			max: readPositiveInteger(rateLimitValues.max, DEFAULT_RATE_LIMIT_MAX_ATTEMPTS),
		},
		lockout: {
			enabled: lockoutOption !== false,
			windowMs: readPositiveInteger(lockoutValues.windowMs, DEFAULT_LOCKOUT_WINDOW_MS),
			maxFailures: readPositiveInteger(lockoutValues.maxFailures, DEFAULT_LOCKOUT_MAX_FAILURES),
			durationMs: readPositiveInteger(lockoutValues.durationMs, DEFAULT_LOCKOUT_DURATION_MS),
		},
	};
}

function retryAfterSeconds(until: number, now: number): number {
	return Math.max(1, Math.ceil((until - now) / 1000));
}

function createBlock(error: string, message: string, until: number, now: number): SigninSecurityBlock {
	return {
		statusCode: 429,
		body: {
			error,
			message,
			retryAfter: retryAfterSeconds(until, now),
		},
	};
}

function sendBlock(res: Response, block: SigninSecurityBlock): void {
	res.setHeader('Retry-After', String(block.body.retryAfter));
	res.status(block.statusCode).json(block.body);
}

function normalizeCredential(email: unknown): string | null {
	if (typeof email !== 'string') {
		return null;
	}
	const trimmed = email.trim().toLowerCase();
	return trimmed ? trimmed.slice(0, 320) : null;
}

function getRequestIp(req: Request): string {
	return req.ip || req.socket.remoteAddress || 'unknown';
}

function getRequestCredential(req: Request): string | null {
	return normalizeCredential((req.body as { email?: unknown } | undefined)?.email);
}

function checkCredentialLock(config: LockoutConfig, credential: string | null, now: number): SigninSecurityBlock | null {
	if (!config.enabled || !credential) {
		return null;
	}
	const bucket = credentialAttempts.get(credential);
	if (!bucket?.lockedUntil) {
		return null;
	}
	if (bucket.lockedUntil <= now) {
		credentialAttempts.delete(credential);
		return null;
	}
	return createBlock(
		'signin locked',
		'Too many failed sign-in attempts for this account. Try again later.',
		bucket.lockedUntil,
		now
	);
}

function pruneExpiredBuckets(now: number): void {
	if (nextPruneAt > now) {
		return;
	}
	nextPruneAt = now + Math.min(DEFAULT_RATE_LIMIT_WINDOW_MS, DEFAULT_LOCKOUT_WINDOW_MS);
	ipAttempts.forEach((bucket, key) => {
		if (bucket.resetAt <= now) {
			ipAttempts.delete(key);
		}
	});
	credentialAttempts.forEach((bucket, key) => {
		const lockedUntil = bucket.lockedUntil ?? 0;
		if (bucket.resetAt <= now && lockedUntil <= now) {
			credentialAttempts.delete(key);
		}
	});
}

function consumeIpAttempt(config: RateLimitConfig, ip: string, now: number): SigninSecurityBlock | null {
	if (!config.enabled) {
		return null;
	}
	const resetAt = now + config.windowMs;
	const bucket = ipAttempts.get(ip);
	if (!bucket || bucket.resetAt <= now) {
		ipAttempts.set(ip, { count: 1, resetAt });
		return null;
	}
	bucket.count += 1;
	if (bucket.count <= config.max) {
		return null;
	}
	return createBlock(
		'signin rate limit exceeded',
		'Too many sign-in attempts. Try again later.',
		bucket.resetAt,
		now
	);
}

export function createSigninRateLimitMiddleware(keystone: Keystone): RequestHandler {
	return function signinRateLimit(req: Request, res: Response, next: NextFunction): void {
		const now = Date.now();
		pruneExpiredBuckets(now);
		const config = getSigninSecurityConfig(keystone);
		const ipBlock = consumeIpAttempt(config.rateLimit, getRequestIp(req), now);
		if (ipBlock) {
			sendBlock(res, ipBlock);
			return;
		}
		const credentialBlock = checkCredentialLock(config.lockout, getRequestCredential(req), now);
		if (credentialBlock) {
			sendBlock(res, credentialBlock);
			return;
		}
		next();
	};
}

export function recordSigninFailure(req: Request, email: unknown): SigninSecurityBlock | null {
	if (!req.keystone) {
		return null;
	}
	const config = getSigninSecurityConfig(req.keystone).lockout;
	const credential = normalizeCredential(email);
	if (!config.enabled || !credential) {
		return null;
	}
	const now = Date.now();
	pruneExpiredBuckets(now);
	const bucket = credentialAttempts.get(credential);
	if (!bucket || bucket.resetAt <= now) {
		const nextBucket: CredentialBucket = {
			count: 1,
			resetAt: now + config.windowMs,
		};
		credentialAttempts.set(credential, nextBucket);
		return null;
	}
	bucket.count += 1;
	if (bucket.count < config.maxFailures) {
		return null;
	}
	bucket.lockedUntil = now + config.durationMs;
	return createBlock(
		'signin locked',
		'Too many failed sign-in attempts for this account. Try again later.',
		bucket.lockedUntil,
		now
	);
}

export function clearSigninFailures(email: unknown): void {
	const credential = normalizeCredential(email);
	if (credential) {
		credentialAttempts.delete(credential);
	}
}

export function sendSigninSecurityBlock(res: Response, block: SigninSecurityBlock): void {
	sendBlock(res, block);
}

export function resetSigninSecurityState(): void {
	ipAttempts.clear();
	credentialAttempts.clear();
	nextPruneAt = 0;
}
