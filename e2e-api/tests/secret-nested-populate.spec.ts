/**
 * Secret fields (Password-type or `secret: true`) on the two paths the
 * first-level checks do not cover:
 *
 * - a populated relationship whose related document is itself populated
 *   (`Project` -> `Team` -> `User`): every level must be redacted;
 * - an autokey path that is declared secret (`Voucher.code`): the generated
 *   key must be stored but never returned or searched.
 */

import type { APIRequestContext, APIResponse } from '@playwright/test';
import { test, expect } from '../fixtures/auth.js';
import {
	API_BASE,
	APP_GET_BASE,
	TEST_ADMIN_EMAIL,
	TEST_ADMIN_PASSWORD,
	TEST_ADMIN_RECOVERY_CODE,
} from '../fixtures/server.js';
import { resetDb, withRawDb } from '../fixtures/seedDb.js';
import { createItem, getItem, getList, signin } from '../helpers/api.js';

/** bcrypt modular-crypt prefix: `$2a$10$`, `$2b$12$`, ... */
const BCRYPT_RE = /\$2[abxy]?\$\d{2}\$/;

// Test fixture credential — never used outside the e2e-api harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const LEAD_PASSWORD = 'team-lead-password-123';
const LEAD_EMAIL = 'team-lead@example.com';
const LEAD_RECOVERY_CODE = 'e2e-lead-recovery-code-7a41c0de';
const TEAM_ACCESS_KEY = 'e2e-team-access-key-b93f52aa';
const VOUCHER_LABEL = 'Spring Sale';
/** The key autokey builds from `VOUCHER_LABEL`. */
const VOUCHER_CODE = 'spring-sale';
const SECRET_VALUES = [TEST_ADMIN_RECOVERY_CODE, LEAD_RECOVERY_CODE, TEAM_ACCESS_KEY, VOUCHER_CODE];

let leadId = '';
let teamId = '';
let projectId = '';
let voucherId = '';

/**
 * Asserts the response succeeded and that its raw body carries no bcrypt hash
 * and no secret field value.
 * @param res Response to inspect.
 * @param label Endpoint label used in failure messages.
 * @returns The raw response body.
 */
async function expectNoSecret (res: APIResponse, label: string): Promise<string> {
	const raw = await res.text();
	expect(res.status(), `${label} status (body: ${raw.slice(0, 200)})`).toBe(200);
	expect(BCRYPT_RE.test(raw), `${label} contains a bcrypt hash`).toBe(false);
	for (const secret of SECRET_VALUES) {
		expect(raw.includes(secret), `${label} contains a secret field value (${secret.slice(0, 8)}...)`).toBe(false);
	}
	return raw;
}

async function created (res: APIResponse, label: string): Promise<string> {
	const raw = await expectNoSecret(res, label);
	return (JSON.parse(raw) as { id: string }).id;
}

test.beforeAll(async ({ request, playwright, baseURL }) => {
	await resetDb(request);
	const ctx: APIRequestContext = await playwright.request.newContext({ baseURL });
	try {
		expect((await signin(ctx, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD)).ok()).toBe(true);
		leadId = await created(await createItem(ctx, 'users', {
			'name.first': 'Team',
			'name.last': 'Lead',
			'email': LEAD_EMAIL,
			'password': LEAD_PASSWORD,
			'password_confirm': LEAD_PASSWORD,
			'recoveryCode': LEAD_RECOVERY_CODE,
		}), 'POST users/create');
		teamId = await created(await createItem(ctx, 'teams', {
			name: 'Platform',
			accessKey: TEAM_ACCESS_KEY,
			lead: leadId,
		}), 'POST teams/create');
		projectId = await created(await createItem(ctx, 'projects', {
			name: 'Apollo',
			team: teamId,
			teams: [teamId],
			backup: teamId,
		}), 'POST projects/create');
		voucherId = await created(await createItem(ctx, 'vouchers', { label: VOUCHER_LABEL }), 'POST vouchers/create');
	} finally {
		await ctx.dispose();
	}
});

test.describe('Nested populated relationships', () => {
	test('the secrets of every level really are stored', async () => {
		const stored = await withRawDb(async (db) => ({
			lead: await db.collection('User').findOne({ email: LEAD_EMAIL }),
			team: await db.collection('Team').findOne({ name: 'Platform' }),
		}));
		expect(stored.lead?.['recoveryCode']).toBe(LEAD_RECOVERY_CODE);
		expect(BCRYPT_RE.test(String(stored.lead?.['password']))).toBe(true);
		expect(stored.team?.['accessKey']).toBe(TEAM_ACCESS_KEY);
		expect(String(stored.team?.['lead'])).toBe(leadId);
	});

	test('list, export and item output of the populating list carry no secret of any level', async ({ signedInRequest }) => {
		const variants: Array<Record<string, string | number | boolean>> = [
			{},
			{ populate: 'team' },
			{ populate: 'team,teams,backup' },
			{ expandRelationshipFields: true },
			{ populate: 'team,teams,backup', expandRelationshipFields: true },
			{ populate: 'team,teams,backup', fields: 'team,teams,backup,team.lead,team.accessKey,team.lead.password,team.lead.recoveryCode,teams.0.lead,teams.lead.recoveryCode,backup.lead' },
			{ expandRelationshipFields: true, fields: 'team.lead.recoveryCode,teams.0.lead.password,team.accessKey' },
		];
		for (const query of variants) {
			const label = JSON.stringify(query);
			await expectNoSecret(await getList(signedInRequest, 'projects', query), `GET projects ${label}`);
			const qs = Object.entries(query)
				.map(([k, v]) => `${k === 'fields' ? 'select' : k}=${encodeURIComponent(String(v))}`)
				.join('&');
			await expectNoSecret(await signedInRequest.get(`${API_BASE}/projects/export.json?${qs}`), `GET projects/export.json ${label}`);
			await expectNoSecret(await signedInRequest.get(`${API_BASE}/projects/export.csv?${qs}`), `GET projects/export.csv ${label}`);
		}
		await expectNoSecret(await getItem(signedInRequest, 'projects', projectId), 'GET projects/:id');
		await expectNoSecret(
			await signedInRequest.get(`${API_BASE}/projects/${projectId}?expandRelationshipFields=true&fields=team,teams,team.lead.recoveryCode,team.accessKey`),
			'GET projects/:id?expandRelationshipFields',
		);
	});

	test('`?populate=` returns the nested document on every level, minus its secret fields', async ({ signedInRequest }) => {
		type Lead = Record<string, unknown>;
		type Team = Record<string, unknown> & { lead?: Lead };
		const raw = await expectNoSecret(
			await getList(signedInRequest, 'projects', { populate: 'team,teams' }),
			'GET projects?populate=team,teams',
		);
		const fields = (JSON.parse(raw) as { results: Array<{ fields: { team?: Team; teams?: Team[] } }> }).results[0]?.fields;
		for (const team of [fields?.team, fields?.teams?.[0]]) {
			expect(team?.['name']).toBe('Platform');
			expect(team).not.toHaveProperty('accessKey');
			// The second level is really there, so the absence of its secrets is redaction.
			expect(team?.lead?.['email']).toBe(LEAD_EMAIL);
			expect(team?.lead).not.toHaveProperty('password');
			expect(team?.lead).not.toHaveProperty('recoveryCode');
		}
	});

	test('the list that populates itself on every find carries no secret', async ({ signedInRequest }) => {
		const raw = await expectNoSecret(await getList(signedInRequest, 'teams'), 'GET teams');
		const lead = (JSON.parse(raw) as { results: Array<{ fields: { lead?: Record<string, unknown> } }> }).results[0]?.fields.lead;
		expect(lead?.['email']).toBe(LEAD_EMAIL);
		await expectNoSecret(await getItem(signedInRequest, 'teams', teamId), 'GET teams/:id');
		await expectNoSecret(await signedInRequest.get(`${API_BASE}/teams/export.json`), 'GET teams/export.json');
		await expectNoSecret(await signedInRequest.get(`${API_BASE}/teams/export.csv`), 'GET teams/export.csv');
	});

	test('a relationship `toCSV` key list exports neither a secret nor a nested document', async ({ signedInRequest }) => {
		const csv = await expectNoSecret(
			await signedInRequest.get(`${API_BASE}/projects/export.csv?populate=backup`),
			'GET projects/export.csv?populate=backup',
		);
		expect(csv).toContain('Platform');
		expect(csv).not.toContain(LEAD_EMAIL);
	});

	test('List.apiForGet with a two-level populate carries no secret of any level', async ({ request }) => {
		type Team = Record<string, unknown> & { lead?: Record<string, unknown> };
		const raw = await expectNoSecret(await request.get(`${APP_GET_BASE}/projects/${projectId}`), 'GET app-api/projects/:id');
		const data = (JSON.parse(raw) as { data: { team?: Team; teams?: Team[]; backup?: Team } }).data;
		for (const team of [data.team, data.teams?.[0], data.backup]) {
			expect(team?.['name']).toBe('Platform');
			expect(team).not.toHaveProperty('accessKey');
			expect(team?.lead?.['email']).toBe(LEAD_EMAIL);
			expect(team?.lead).not.toHaveProperty('password');
			expect(team?.lead).not.toHaveProperty('recoveryCode');
		}
	});
});

test.describe('An autokey path declared secret', () => {
	test('the key is generated and stored', async () => {
		const stored = await withRawDb((db) => db.collection('Voucher').findOne({ label: VOUCHER_LABEL }));
		expect(stored?.['code']).toBe(VOUCHER_CODE);
	});

	test('the key is not returned by list, item or export output', async ({ signedInRequest }) => {
		type Row = { id: string; name?: string; fields: Record<string, unknown> };
		const listRaw = await expectNoSecret(await getList(signedInRequest, 'vouchers'), 'GET vouchers');
		const row = (JSON.parse(listRaw) as { results: Row[] }).results[0];
		expect(row?.id).toBe(voucherId);
		expect(row?.name).toBe(VOUCHER_LABEL);
		expect(row).not.toHaveProperty('code');
		expect(row?.fields).not.toHaveProperty('code');

		await expectNoSecret(await getList(signedInRequest, 'vouchers', { fields: 'label,code,code.length' }), 'GET vouchers?fields=code');
		const itemRaw = await expectNoSecret(await getItem(signedInRequest, 'vouchers', voucherId), 'GET vouchers/:id');
		expect(JSON.parse(itemRaw) as Row).not.toHaveProperty('code');
		await expectNoSecret(await signedInRequest.get(`${API_BASE}/vouchers/export.json`), 'GET vouchers/export.json');
		await expectNoSecret(await signedInRequest.get(`${API_BASE}/vouchers/export.json?select=label,code`), 'GET vouchers/export.json?select=code');
		const csv = await expectNoSecret(await signedInRequest.get(`${API_BASE}/vouchers/export.csv`), 'GET vouchers/export.csv');
		expect(csv).toContain(VOUCHER_LABEL);
		expect(csv.split('\n')[0]).not.toContain('code');
	});

	test('the key is not searched', async ({ signedInRequest }) => {
		const count = async (search: string): Promise<number> => {
			const raw = await expectNoSecret(await getList(signedInRequest, 'vouchers', { search }), `GET vouchers?search=${search}`);
			return (JSON.parse(raw) as { count: number }).count;
		};
		// Matches the stored key only: the label has a capital and a space.
		expect(await count(VOUCHER_CODE)).toBe(0);
		expect(await count('ring-sa')).toBe(0);
		// A search on the label still finds the item.
		expect(await count('Spring')).toBe(1);
	});
});
