import type { FieldComponentSet } from './types.js';
import {
	type LegacyFieldComponentSet,
	registerLegacyFieldComponents,
} from './legacyAdapters.js';
import { registerField } from './registry.js';

export interface RuntimeCustomFieldComponents {
	fieldComponents?: Record<string, FieldComponentSet<unknown, unknown>>;
	legacyFieldComponents?: Record<string, LegacyFieldComponentSet>;
}

export interface RuntimeCustomFieldRegistrationResult {
	modern: string[];
	legacy: string[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getRuntimeConfig(): RuntimeCustomFieldComponents | undefined {
	const runtime = globalThis as {
		Keystone?: unknown;
		window?: { Keystone?: unknown };
	};
	const candidate = runtime.window?.Keystone ?? runtime.Keystone;
	return isRecord(candidate) ? candidate as RuntimeCustomFieldComponents : undefined;
}

export function registerCustomFieldComponents(
	components: Record<string, FieldComponentSet<unknown, unknown>> | undefined,
): string[] {
	if (!isRecord(components)) return [];
	const registered: string[] = [];
	for (const [typeName, set] of Object.entries(components)) {
		registerField(typeName, set);
		registered.push(typeName);
	}
	return registered;
}

export function registerLegacyCustomFieldComponents(
	components: Record<string, LegacyFieldComponentSet> | undefined,
): string[] {
	if (!isRecord(components)) return [];
	const registered: string[] = [];
	for (const [typeName, set] of Object.entries(components)) {
		registerLegacyFieldComponents(typeName, set);
		registered.push(typeName);
	}
	return registered;
}

export function registerRuntimeCustomFieldComponents(
	config: RuntimeCustomFieldComponents | undefined = getRuntimeConfig(),
): RuntimeCustomFieldRegistrationResult {
	return {
		modern: registerCustomFieldComponents(config?.fieldComponents),
		legacy: registerLegacyCustomFieldComponents(config?.legacyFieldComponents),
	};
}
