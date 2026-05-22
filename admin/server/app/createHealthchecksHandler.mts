import type { Keystone } from '../../../index.mjs';
import type { RequestHandler } from 'express';
import safeRequire from '../../../lib/safeRequire.mjs';

/** Minimal shape of the `keystone-healthchecks` module's exported object. */
interface HealthcheckModule {
	healthchecks: {
		canQueryListFactory(list: unknown): unknown;
	};
	createRoute(config: Record<string, unknown>): RequestHandler;
}

export default async function createHealthchecksHandler(keystone: Keystone): Promise<RequestHandler> {
	const healthcheckNs = await safeRequire('keystone-healthchecks', 'healthchecks') as Record<string, unknown>;
	// JUSTIFIED: optional package resolved at runtime; default export or namespace export both accepted
	const healthcheck = ((healthcheckNs['default'] as HealthcheckModule | undefined) ?? healthcheckNs) as HealthcheckModule;

	let healthcheckConfig: Record<string, unknown>;

	const rawConfig: unknown = keystone.get('healthchecks');
	if (rawConfig === true) {
		healthcheckConfig = {};
		const userModel = keystone.get('user model');
		if (userModel) {
			const User = keystone.lists[userModel];
			healthcheckConfig['canQueryUsers'] = healthcheck.healthchecks.canQueryListFactory(User);
		}
	} else if (rawConfig !== null && rawConfig !== undefined && typeof rawConfig === 'object' && !Array.isArray(rawConfig)) {
		healthcheckConfig = rawConfig as Record<string, unknown>;
	} else {
		healthcheckConfig = {};
	}

	return healthcheck.createRoute(healthcheckConfig);
}
