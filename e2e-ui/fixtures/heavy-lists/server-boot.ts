/**
 * @file Keystone test server for heavy-list parity specs.
 *
 * Boots Keystone with `admin ui: 'both'` and registers three list shapes
 * that mirror the stress dimensions of the real cloom-core CLMUser,
 * CLMThread, and EarlyAccessApplication models:
 *
 *  - HeavyUser     — 18 inverse relationship panels (mirrors CLMUser)
 *  - HeavyThread   — 3 relationship fields + legacy/lock sections (mirrors CLMThread)
 *  - HeavyApp      — 5 field sections + self-referential relationship (mirrors EarlyAccessApplication)
 *
 * Uses a distinct DB (`keystone-e2e-ui-heavy`) and the same port 3009
 * to avoid colliding with the main parity suite.
 */

import keystone from 'keystone';
import mongoose from 'mongoose';

const MONGO_URI =
	process.env.MONGO_URI ?? 'mongodb://localhost:27017/keystone-e2e-ui-heavy';
const PORT = process.env.PORT ?? '3009';

export const TEST_ADMIN_EMAIL = 'admin@example.com';
// Test fixture credential — never used outside the e2e harness.
// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_ADMIN_PASSWORD = 'admin-password-123';

type FixtureList = {
	add(...args: unknown[]): void;
	defaultColumns: string;
	register(): void;
	relationship(options: { ref: string; path: string; refPath: string }): void;
	schema: {
		virtual(name: string): { get(getter: (this: { isAdmin?: boolean }) => unknown): void };
	};
};

function createList(key: string, options: Record<string, unknown> = {}): FixtureList {
	return new keystone.List(key, options) as unknown as FixtureList;
}

async function dropDatabase() {
	const conn = await mongoose.createConnection(MONGO_URI).asPromise();
	try {
		if (conn.db) await conn.db.dropDatabase();
	} finally {
		await conn.close();
	}
}

function defineLists() {
	const Types = keystone.Field.Types;

	// ── User (needed as the auth model) ────────────────────────────────────────
	const User = createList('User');
	User.add({
		name: { type: Types.Name, required: true, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		isAdmin: { type: Types.Boolean, default: false },
	});
	User.schema.virtual('canAccessKeystone').get(function () {
		return this.isAdmin;
	});
	User.defaultColumns = 'name, email, isAdmin';
	User.register();

	// ── HeavyUser — mirrors CLMUser shape (23 own fields, 18 inverse panels) ──
	const HeavyUser = createList('HeavyUser', {
		label: 'Conversation Users',
		singular: 'Conversation User',
		plural: 'Conversation Users',
		defaultColumns: 'systemTitle, displayName, email, preferredLanguage, createdAt',
		defaultSort: '-createdAt',
	});
	HeavyUser.add(
		{
			// Core group
			systemTitle: { type: Types.Text, noedit: true, label: 'System Title' },
			userId: { type: Types.Text, noedit: true, label: 'User ID' },
			userToken: { type: Types.Text, required: true, initial: true, label: 'User Token' },
			userTokenUi: { type: Types.Text, label: 'User Token (UI)' },
			userTokenManagerAstro: { type: Types.Text, label: 'User Token (Manager Astro)' },
			userTokenManagerNext: { type: Types.Text, label: 'User Token (Manager Next)' },
			preferredLanguage: { type: Types.Text, label: 'Preferred Language' },
			lastLanguage: { type: Types.Text, label: 'Last Language' },
		},
		'Profile',
		{
			firstName: { type: Types.Text, label: 'First Name' },
			lastName: { type: Types.Text, label: 'Last Name' },
			displayName: { type: Types.Text, label: 'Display Name' },
			email: { type: Types.Email, label: 'Email' },
			socialLinkedin: { type: Types.Url, label: 'LinkedIn URL' },
			socialX: { type: Types.Url, label: 'X URL' },
			socialInstagram: { type: Types.Url, label: 'Instagram URL' },
			socialFacebook: { type: Types.Url, label: 'Facebook URL' },
			socialTiktok: { type: Types.Url, label: 'TikTok URL' },
			socialYoutube: { type: Types.Url, label: 'YouTube URL' },
			lastSyncedAt: { type: Types.Datetime, label: 'Last Synced At' },
		},
		'Manager Permissions',
		{
			canAccessManager: { type: Types.Boolean, default: false, label: 'Can Access Manager' },
			managerRoles: { type: Types.TextArray, label: 'Manager Roles' },
			canIssueInvites: { type: Types.Boolean, default: false, label: 'Can Issue Invites' },
			invitePolicy: { type: Types.Textarea, label: 'Invite Policy' },
		},
		'Tracking',
		{
			createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
			updatedAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Updated At' },
		},
	);
	HeavyUser.register();

	// ── HeavyThread — mirrors CLMThread (3 rel fields, 5 sections) ─────────────
	const HeavyThread = createList('HeavyThread', {
		label: 'Conversation Threads',
		singular: 'Conversation Thread',
		plural: 'Conversation Threads',
		defaultColumns: 'systemTitle, displayName, threadUser, createdAt',
		defaultSort: '-createdAt',
	});
	HeavyThread.add(
		{
			systemTitle: { type: Types.Text, noedit: true, label: 'System Title' },
			threadId: { type: Types.Text, noedit: true, label: 'Thread ID' },
			threadUser: {
				type: Types.Relationship,
				ref: 'HeavyUser',
				many: false,
				required: true,
				initial: true,
				label: 'User',
			},
			displayName: { type: Types.Text, required: true, initial: true, label: 'Display Name' },
			lastLanguage: { type: Types.Text, label: 'Last Language' },
			threadLoop: {
				type: Types.Relationship,
				ref: 'HeavyLoop',
				many: false,
				label: 'Current Loop',
			},
			threadSubject: {
				type: Types.Relationship,
				ref: 'HeavySubject',
				many: false,
				label: 'Selected Entity',
			},
			threadSummary: { type: Types.Textarea, noedit: true, label: 'Thread Summary' },
		},
		'Tracking',
		{
			createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
			updatedAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Updated At' },
		},
		'Selected Business (Legacy)',
		{
			bizTitle: { type: Types.Text, label: 'Business Title' },
			bizDescription: { type: Types.Textarea, label: 'Business Description' },
			bizUrls: { type: Types.TextArray, label: 'Business URLs' },
			bizLocation: { type: Types.Text, label: 'Business Location' },
			bizIndustry: { type: Types.Text, label: 'Business Industry' },
		},
		'Distributed Lock',
		{
			lockOwnerId: { type: Types.Text, noedit: true, label: 'Lock Owner ID' },
			lockExpiresAt: { type: Types.Datetime, noedit: true, label: 'Lock Expires At' },
			lockAcquiredAt: { type: Types.Datetime, noedit: true, label: 'Lock Acquired At' },
		},
		'Deletion State',
		{
			isDeleted: { type: Types.Boolean, default: false, label: 'Is Deleted' },
			deletedAt: { type: Types.Datetime, noedit: true, label: 'Deleted At' },
			deletedBy: {
				type: Types.Relationship,
				ref: 'HeavyUser',
				many: false,
				label: 'Deleted By',
			},
			deletedBecause: { type: Types.Text, label: 'Deleted Because' },
		},
	);
	HeavyThread.register();

	// ── HeavyLoop (referenced by HeavyThread.threadLoop) ───────────────────────
	const HeavyLoop = createList('HeavyLoop', {
		label: 'Conversation Loops',
		singular: 'Conversation Loop',
		plural: 'Conversation Loops',
	});
	HeavyLoop.add({
		name: { type: Types.Text, required: true, initial: true, label: 'Name' },
		loopUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyLoop.register();

	// ── HeavySubject (referenced by HeavyThread.threadSubject) ─────────────────
	const HeavySubject = createList('HeavySubject', {
		label: 'Conversation Subjects',
		singular: 'Conversation Subject',
		plural: 'Conversation Subjects',
	});
	HeavySubject.add({
		name: { type: Types.Text, required: true, initial: true, label: 'Name' },
		subjectUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavySubject.register();

	// ── HeavyTurn (one of HeavyUser's 18 inverse relationship lists) ────────────
	const HeavyTurn = createList('HeavyTurn', {
		label: 'Conversation Turns',
		singular: 'Conversation Turn',
		plural: 'Conversation Turns',
	});
	HeavyTurn.add({
		turnThread: {
			type: Types.Relationship,
			ref: 'HeavyThread',
			many: false,
			required: true,
			initial: true,
			label: 'Thread',
		},
		turnUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			required: true,
			initial: true,
			label: 'User',
		},
		content: { type: Types.Textarea, label: 'Content' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyTurn.register();

	// ── HeavyMessage (another inverse list) ────────────────────────────────────
	const HeavyMessage = createList('HeavyMessage', {
		label: 'Conversation Messages',
		singular: 'Conversation Message',
		plural: 'Conversation Messages',
	});
	HeavyMessage.add({
		msgThread: {
			type: Types.Relationship,
			ref: 'HeavyThread',
			many: false,
			label: 'Thread',
		},
		msgUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		body: { type: Types.Textarea, label: 'Body' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyMessage.register();

	// ── HeavyRequest (LLMRequest analog) ───────────────────────────────────────
	const HeavyRequest = createList('HeavyRequest', {
		label: 'LLM Requests',
		singular: 'LLM Request',
		plural: 'LLM Requests',
	});
	HeavyRequest.add({
		reqUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		model: { type: Types.Text, label: 'Model' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyRequest.register();

	// ── HeavySession (LLMSession analog) ───────────────────────────────────────
	const HeavySession = createList('HeavySession', {
		label: 'LLM Sessions',
		singular: 'LLM Session',
		plural: 'LLM Sessions',
	});
	HeavySession.add({
		sessionUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		startedAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Started At' },
	});
	HeavySession.register();

	// ── HeavyContextDoc (CLMContextDocument analog) ─────────────────────────────
	const HeavyContextDoc = createList('HeavyContextDoc', {
		label: 'Context Documents',
		singular: 'Context Document',
		plural: 'Context Documents',
	});
	HeavyContextDoc.add({
		docUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		title: { type: Types.Text, label: 'Title' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyContextDoc.register();

	// ── HeavyMilestone (CLMJourneyMilestone analog) ─────────────────────────────
	const HeavyMilestone = createList('HeavyMilestone', {
		label: 'Journey Milestones',
		singular: 'Journey Milestone',
		plural: 'Journey Milestones',
	});
	HeavyMilestone.add({
		milestoneUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		name: { type: Types.Text, label: 'Name' },
		achievedAt: { type: Types.Datetime, label: 'Achieved At' },
	});
	HeavyMilestone.register();

	// ── HeavyPipelineExec (CLMPipelineExecution analog) ─────────────────────────
	const HeavyPipelineExec = createList('HeavyPipelineExec', {
		label: 'Pipeline Executions',
		singular: 'Pipeline Execution',
		plural: 'Pipeline Executions',
	});
	HeavyPipelineExec.add({
		execUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		status: { type: Types.Text, label: 'Status' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyPipelineExec.register();

	// ── HeavyProfileField (ProfileField analog) ─────────────────────────────────
	const HeavyProfileField = createList('HeavyProfileField', {
		label: 'Profile Fields',
		singular: 'Profile Field',
		plural: 'Profile Fields',
	});
	HeavyProfileField.add({
		createdByUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'Created By User',
		},
		fieldName: { type: Types.Text, label: 'Field Name' },
	});
	HeavyProfileField.register();

	// ── HeavyProfileItem (ProfileItem analog) ───────────────────────────────────
	const HeavyProfileItem = createList('HeavyProfileItem', {
		label: 'Profile Items',
		singular: 'Profile Item',
		plural: 'Profile Items',
	});
	HeavyProfileItem.add({
		createdByUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'Created By User',
		},
		content: { type: Types.Textarea, label: 'Content' },
	});
	HeavyProfileItem.register();

	// ── HeavyProfileRoot (ProfileRoot analog) ───────────────────────────────────
	const HeavyProfileRoot = createList('HeavyProfileRoot', {
		label: 'Profile Roots',
		singular: 'Profile Root',
		plural: 'Profile Root',
	});
	HeavyProfileRoot.add({
		createdByUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'Created By User',
		},
		name: { type: Types.Text, label: 'Name' },
	});
	HeavyProfileRoot.register();

	// ── HeavyProfileSection (ProfileSection analog) ─────────────────────────────
	const HeavyProfileSection = createList('HeavyProfileSection', {
		label: 'Profile Sections',
		singular: 'Profile Section',
		plural: 'Profile Sections',
	});
	HeavyProfileSection.add({
		createdByUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'Created By User',
		},
		title: { type: Types.Text, label: 'Title' },
	});
	HeavyProfileSection.register();

	// ── HeavyWebSearch (GoogleWebSearchRequest analog) ──────────────────────────
	const HeavyWebSearch = createList('HeavyWebSearch', {
		label: 'Web Searches',
		singular: 'Web Search',
		plural: 'Web Searches',
	});
	HeavyWebSearch.add({
		searchUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		query: { type: Types.Text, label: 'Query' },
		createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
	});
	HeavyWebSearch.register();

	// ── HeavyPlacesSearch (GooglePlacesBusinessSearchRequest analog) ─────────────
	const HeavyPlacesSearch = createList('HeavyPlacesSearch', {
		label: 'Places Searches',
		singular: 'Places Search',
		plural: 'Places Searches',
	});
	HeavyPlacesSearch.add({
		placesUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		query: { type: Types.Text, label: 'Query' },
	});
	HeavyPlacesSearch.register();

	// ── HeavyPlacesDetails (GooglePlacesBusinessDetailsRequest analog) ───────────
	const HeavyPlacesDetails = createList('HeavyPlacesDetails', {
		label: 'Places Details',
		singular: 'Places Detail',
		plural: 'Places Details',
	});
	HeavyPlacesDetails.add({
		detailsUser: {
			type: Types.Relationship,
			ref: 'HeavyUser',
			many: false,
			label: 'User',
		},
		placeId: { type: Types.Text, label: 'Place ID' },
	});
	HeavyPlacesDetails.register();

	// ── HeavyDeletedThread (CLMThread.deletedBy inverse) ────────────────────────
	// This is handled by the deletedBy relationship on HeavyThread above.

	// ── EarlyApp — mirrors EarlyAccessApplication (5 sections, self-ref rel) ────
	const EarlyApp = createList('EarlyApp', {
		label: 'Early Access Applications',
		singular: 'Early Access Application',
		plural: 'Early Access Applications',
		defaultColumns: 'systemTitle, email, status, createdAt',
		defaultSort: '-createdAt',
	});
	EarlyApp.add(
		'Identity',
		{
			systemTitle: { type: Types.Text, noedit: true, label: 'System Title' },
			applicationKey: { type: Types.Text, required: true, initial: true, label: 'Application Key' },
			fullName: { type: Types.Text, required: true, initial: true, label: 'Full Name' },
			email: { type: Types.Email, required: true, initial: true, label: 'Email' },
			normalizedEmail: { type: Types.Text, label: 'Normalized Email' },
			linkedUser: {
				type: Types.Relationship,
				ref: 'HeavyUser',
				many: false,
				label: 'Linked CLM User',
			},
			linkedUserToken: { type: Types.Text, label: 'Linked User Token' },
		},
		'Application Details',
		{
			businessName: { type: Types.Text, required: true, initial: true, label: 'Business Name' },
			businessUrlsJson: { type: Types.Textarea, label: 'Business URLs (JSON)' },
			useCaseSummary: { type: Types.Textarea, label: 'Use Case Summary' },
			extraFieldsJson: { type: Types.Textarea, label: 'Extra Fields (JSON)' },
		},
		'Workflow',
		{
			status: {
				type: Types.Select,
				options: 'pending, approved, rejected, waitlisted',
				default: 'pending',
				required: true,
				label: 'Status',
			},
			completenessStatus: {
				type: Types.Select,
				options: 'identity_only, details_provided',
				default: 'identity_only',
				label: 'Completeness Status',
			},
			detailsProvidedAt: { type: Types.Datetime, label: 'Details Provided At' },
			isStarred: { type: Types.Boolean, default: false, label: 'Starred' },
			priorityScore: { type: Types.Number, default: 0, label: 'Priority Score' },
			isQualifiedLead: { type: Types.Boolean, default: false, label: 'Qualified Lead' },
			followUpState: {
				type: Types.Select,
				options: 'none, requested, responded',
				default: 'none',
				label: 'Follow Up State',
			},
			lastFollowUpRequestedAt: { type: Types.Datetime, label: 'Last Follow Up Requested At' },
			lastFollowUpRespondedAt: { type: Types.Datetime, label: 'Last Follow Up Responded At' },
			lastManagerActionAt: { type: Types.Datetime, label: 'Last Manager Action At' },
			lastManagerActionByToken: { type: Types.Text, label: 'Last Manager Action By' },
			dedupeKey: { type: Types.Text, label: 'Dedupe Key' },
			supersededBy: {
				type: Types.Relationship,
				ref: 'EarlyApp',
				many: false,
				label: 'Superseded By',
			},
			lastChangedByToken: { type: Types.Text, label: 'Last Changed By Token' },
			lastChangedAt: { type: Types.Datetime, label: 'Last Changed At' },
		},
		'Abuse Controls',
		{
			antiBotTokenHash: { type: Types.Text, label: 'Anti Bot Token Hash' },
			antiBotProvider: { type: Types.Text, label: 'Anti Bot Provider' },
			rateLimitKey: { type: Types.Text, label: 'Rate Limit Key' },
		},
		'Tracking',
		{
			createdAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Created At' },
			updatedAt: { type: Types.Datetime, noedit: true, default: Date.now, label: 'Updated At' },
		},
	);
	EarlyApp.register();

	// ── Wire up the 18 inverse relationship panels on HeavyUser ─────────────────
	// 1. Threads (via threadUser)
	HeavyUser.relationship({ ref: 'HeavyThread', path: 'threads', refPath: 'threadUser' });
	// 2. Threads deleted by this user
	HeavyUser.relationship({ ref: 'HeavyThread', path: 'threads-deleted', refPath: 'deletedBy' });
	// 3. Loops
	HeavyUser.relationship({ ref: 'HeavyLoop', path: 'loops', refPath: 'loopUser' });
	// 4. Subjects
	HeavyUser.relationship({ ref: 'HeavySubject', path: 'subjects', refPath: 'subjectUser' });
	// 5. Turns
	HeavyUser.relationship({ ref: 'HeavyTurn', path: 'turns', refPath: 'turnUser' });
	// 6. Messages
	HeavyUser.relationship({ ref: 'HeavyMessage', path: 'messages', refPath: 'msgUser' });
	// 7. LLM Requests
	HeavyUser.relationship({ ref: 'HeavyRequest', path: 'llm-requests', refPath: 'reqUser' });
	// 8. LLM Sessions
	HeavyUser.relationship({ ref: 'HeavySession', path: 'llm-sessions', refPath: 'sessionUser' });
	// 9. Context Documents
	HeavyUser.relationship({ ref: 'HeavyContextDoc', path: 'context-docs', refPath: 'docUser' });
	// 10. Journey Milestones
	HeavyUser.relationship({ ref: 'HeavyMilestone', path: 'milestones', refPath: 'milestoneUser' });
	// 11. Pipeline Executions
	HeavyUser.relationship({ ref: 'HeavyPipelineExec', path: 'pipeline-execs', refPath: 'execUser' });
	// 12. Profile Fields
	HeavyUser.relationship({ ref: 'HeavyProfileField', path: 'profile-fields', refPath: 'createdByUser' });
	// 13. Profile Items
	HeavyUser.relationship({ ref: 'HeavyProfileItem', path: 'profile-items', refPath: 'createdByUser' });
	// 14. Profile Roots
	HeavyUser.relationship({ ref: 'HeavyProfileRoot', path: 'profile-roots', refPath: 'createdByUser' });
	// 15. Profile Sections
	HeavyUser.relationship({ ref: 'HeavyProfileSection', path: 'profile-sections', refPath: 'createdByUser' });
	// 16. Web Searches
	HeavyUser.relationship({ ref: 'HeavyWebSearch', path: 'web-searches', refPath: 'searchUser' });
	// 17. Places Searches
	HeavyUser.relationship({ ref: 'HeavyPlacesSearch', path: 'places-searches', refPath: 'placesUser' });
	// 18. Places Details
	HeavyUser.relationship({ ref: 'HeavyPlacesDetails', path: 'places-details', refPath: 'detailsUser' });

	// ── Wire inverse panels on HeavyThread ──────────────────────────────────────
	HeavyThread.relationship({ ref: 'HeavyTurn', path: 'turns', refPath: 'turnThread' });
	HeavyThread.relationship({ ref: 'HeavyMessage', path: 'messages', refPath: 'msgThread' });
}

async function seedData() {
	const HeavyUser = keystone.list('HeavyUser');
	const HeavyThread = keystone.list('HeavyThread');
	const HeavyLoop = keystone.list('HeavyLoop');
	const HeavySubject = keystone.list('HeavySubject');
	const HeavyTurn = keystone.list('HeavyTurn');
	const HeavyMessage = keystone.list('HeavyMessage');
	const HeavyRequest = keystone.list('HeavyRequest');
	const HeavySession = keystone.list('HeavySession');
	const HeavyContextDoc = keystone.list('HeavyContextDoc');
	const HeavyMilestone = keystone.list('HeavyMilestone');
	const HeavyPipelineExec = keystone.list('HeavyPipelineExec');
	const HeavyProfileField = keystone.list('HeavyProfileField');
	const HeavyProfileItem = keystone.list('HeavyProfileItem');
	const HeavyProfileRoot = keystone.list('HeavyProfileRoot');
	const HeavyProfileSection = keystone.list('HeavyProfileSection');
	const HeavyWebSearch = keystone.list('HeavyWebSearch');
	const HeavyPlacesSearch = keystone.list('HeavyPlacesSearch');
	const HeavyPlacesDetails = keystone.list('HeavyPlacesDetails');
	const EarlyApp = keystone.list('EarlyApp');
	const User = keystone.list('User');

	// Admin user (for Keystone auth)
	let adminUser = await User.model.findOne({ email: TEST_ADMIN_EMAIL }).exec();
	if (!adminUser) {
		adminUser = new User.model({
			name: { first: 'Test', last: 'Admin' },
			email: TEST_ADMIN_EMAIL,
			password: TEST_ADMIN_PASSWORD,
			isAdmin: true,
		});
		await adminUser.save();
	}

	// HeavyUser (the "CLMUser" analog)
	const heavyUser = new HeavyUser.model({
		systemTitle: 'U0001 – alice@example.com',
		userId: 'U0001',
		userToken: 'tok-heavy-user-001',
		userTokenUi: 'uitok-heavy-user-001',
		firstName: 'Alice',
		lastName: 'Example',
		displayName: 'Alice Example',
		email: 'alice@example.com',
		preferredLanguage: 'en',
		lastLanguage: 'en',
		canAccessManager: true,
		managerRoles: ['admin', 'reviewer'],
		createdAt: new Date('2026-01-01T00:00:00.000Z'),
		updatedAt: new Date('2026-05-01T00:00:00.000Z'),
	});
	await heavyUser.save();

	// Create a HeavyLoop and HeavySubject first (needed by HeavyThread)
	const loop = new HeavyLoop.model({
		name: 'Main Loop',
		loopUser: heavyUser._id,
	});
	await loop.save();

	const subject = new HeavySubject.model({
		name: 'Acme Corp',
		subjectUser: heavyUser._id,
	});
	await subject.save();

	// HeavyThread (the "CLMThread" analog)
	const heavyThread = new HeavyThread.model({
		systemTitle: 'T0001 – Marketing Campaign',
		threadId: 'T0001',
		threadUser: heavyUser._id,
		displayName: 'Marketing Campaign Thread',
		lastLanguage: 'en',
		threadLoop: loop._id,
		threadSubject: subject._id,
		threadSummary: 'User is asking about campaign strategies for their e-commerce business.',
		bizTitle: 'Acme Corp',
		bizDescription: 'An e-commerce retailer',
		bizUrls: ['https://acme.example.com'],
		bizLocation: 'Amsterdam, NL',
		bizIndustry: 'E-Commerce',
		createdAt: new Date('2026-01-15T09:00:00.000Z'),
		updatedAt: new Date('2026-05-01T12:00:00.000Z'),
	});
	await heavyThread.save();

	// Seed related items for the 18 inverse panels on HeavyUser
	const turn = new HeavyTurn.model({ turnThread: heavyThread._id, turnUser: heavyUser._id, content: 'Hello!' });
	await turn.save();
	const msg = new HeavyMessage.model({ msgThread: heavyThread._id, msgUser: heavyUser._id, body: 'Hi there' });
	await msg.save();
	const req = new HeavyRequest.model({ reqUser: heavyUser._id, model: 'gpt-4' });
	await req.save();
	const sess = new HeavySession.model({ sessionUser: heavyUser._id });
	await sess.save();
	const ctx = new HeavyContextDoc.model({ docUser: heavyUser._id, title: 'Company Overview' });
	await ctx.save();
	const milestone = new HeavyMilestone.model({ milestoneUser: heavyUser._id, name: 'First Thread' });
	await milestone.save();
	const exec = new HeavyPipelineExec.model({ execUser: heavyUser._id, status: 'completed' });
	await exec.save();
	const pf = new HeavyProfileField.model({ createdByUser: heavyUser._id, fieldName: 'industry' });
	await pf.save();
	const pi = new HeavyProfileItem.model({ createdByUser: heavyUser._id, content: 'E-Commerce' });
	await pi.save();
	const pr = new HeavyProfileRoot.model({ createdByUser: heavyUser._id, name: 'Alice Root' });
	await pr.save();
	const ps = new HeavyProfileSection.model({ createdByUser: heavyUser._id, title: 'Background' });
	await ps.save();
	const ws = new HeavyWebSearch.model({ searchUser: heavyUser._id, query: 'e-commerce trends 2026' });
	await ws.save();
	const pls = new HeavyPlacesSearch.model({ placesUser: heavyUser._id, query: 'Acme Corp Amsterdam' });
	await pls.save();
	const pld = new HeavyPlacesDetails.model({ detailsUser: heavyUser._id, placeId: 'ChIJ123' });
	await pld.save();

	// EarlyApp (EarlyAccessApplication analog)
	const app = new EarlyApp.model({
		systemTitle: 'Acme Corp – alice@example.com (pending)',
		applicationKey: 'app-key-001',
		fullName: 'Alice Example',
		email: 'alice@example.com',
		normalizedEmail: 'alice@example.com',
		linkedUser: heavyUser._id,
		businessName: 'Acme Corp',
		businessUrlsJson: '["https://acme.example.com"]',
		useCaseSummary: 'We want to use AI for customer support automation.',
		status: 'pending',
		completenessStatus: 'details_provided',
		detailsProvidedAt: new Date('2026-03-01T10:00:00.000Z'),
		isStarred: true,
		priorityScore: 85,
		isQualifiedLead: true,
		followUpState: 'none',
		dedupeKey: 'alice@example.com|acme-corp',
		createdAt: new Date('2026-02-15T08:00:00.000Z'),
		updatedAt: new Date('2026-05-01T14:00:00.000Z'),
	});
	await app.save();

	console.log(`[heavy-list-seed] HeavyUser: ${String(heavyUser._id)}`);
	console.log(`[heavy-list-seed] HeavyThread: ${String(heavyThread._id)}`);
	console.log(`[heavy-list-seed] EarlyApp: ${String(app._id)}`);

	return { heavyUserId: String(heavyUser._id), heavyThreadId: String(heavyThread._id), earlyAppId: String(app._id) };
}

await dropDatabase();

keystone.init({
	'name': 'keystone-e2e-ui-heavy',
	'brand': 'Heavy Lists Admin',
	'host': '127.0.0.1',
	'port': PORT,
	'mongo': MONGO_URI,
	'auto update': false,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'keystone-e2e-ui-heavy-secret',
	'admin legacy path': 'keystone',
	'admin next path': 'keystone-next',
	'admin api path': 'keystone-api',
	'admin ui': 'both',
	'headless': false,
	'logger': false,
});

defineLists();

await new Promise((resolve, reject) => {
	keystone.start({
		onStart: () => resolve(undefined),
		onHttpServerCreated: () => {
			const server = keystone.httpServer;
			if (server) server.on('error', reject);
		},
	});
});

const ids = await seedData();

console.log(`[e2e-ui-heavy] Keystone listening on http://127.0.0.1:${PORT}/keystone`);
console.log(`[e2e-ui-heavy] admin next mounted at http://127.0.0.1:${PORT}/keystone-next`);
console.log(`[e2e-ui-heavy] HeavyUser id: ${ids.heavyUserId}`);
console.log(`[e2e-ui-heavy] HeavyThread id: ${ids.heavyThreadId}`);
console.log(`[e2e-ui-heavy] EarlyApp id: ${ids.earlyAppId}`);
