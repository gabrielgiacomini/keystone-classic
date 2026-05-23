export const FIELD_COMPLETE_SEED = {
	adminEmail: 'admin@example.com',
	// Test fixture credential. Never use outside the e2e harness.
	// eslint-disable-next-line sonarjs/no-hardcoded-passwords
	adminPassword: 'admin-password-123',
};

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
const inertPassword = 'password-123';

type FixtureModel = {
	new (doc: Record<string, unknown>): { _id?: unknown; save(): Promise<void> };
};

type SeedIds = Record<string, string>;

type KeystoneLike = {
	list(key: string): { model: FixtureModel };
};

function fixtureImageDataUrl (publicId: string, width: number, height: number): string {
	const label = publicId.split('/').pop() ?? publicId;
	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
		'<rect width="100%" height="100%" fill="#e8f1fb"/>',
		'<rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#2f80ed" stroke-width="12"/>',
		`<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.max(24, Math.floor(width / 18))}" fill="#1f2937">${label}</text>`,
		'</svg>',
	].join('');
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function cloudinaryImage (publicId: string, width = 1200, height = 800): Record<string, unknown> {
	const fixtureUrl = fixtureImageDataUrl(publicId, width, height);
	return {
		public_id: publicId,
		version: 1,
		signature: `sig-${publicId}`,
		format: 'jpg',
		resource_type: 'image',
		url: fixtureUrl,
		width,
		height,
		secure_url: fixtureUrl,
	};
}

export async function seedFieldCompleteData (keystone: KeystoneLike): Promise<SeedIds> {
	const User = keystone.list('User');
	const MediaAsset = keystone.list('MediaAsset');
	const Article = keystone.list('Article');
	const Venue = keystone.list('Venue');
	const Event = keystone.list('Event');
	const Product = keystone.list('Product');
	const SortableItem = keystone.list('SortableItem');
	const RelationshipTarget = keystone.list('RelationshipTarget');
	const ManyRelationship = keystone.list('ManyRelationship');
	const NoDefaultColumn = keystone.list('NoDefaultColumn');
	const DateFieldMap = keystone.list('DateFieldMap');
	const DependsOn = keystone.list('DependsOn');

	const admin = new User.model({
		fixtureKey: 'account-admin',
		name: { first: 'Test', last: 'Admin' },
		email: FIELD_COMPLETE_SEED.adminEmail,
		password: FIELD_COMPLETE_SEED.adminPassword,
		isAdmin: true,
		role: 'administrator',
	});
	await admin.save();

	const editor = new User.model({
		fixtureKey: 'account-editor',
		name: { first: 'Morgan', last: 'Editor' },
		email: 'morgan.editor@example.com',
		password: inertPassword,
		isAdmin: false,
		role: 'editor',
	});
	await editor.save();

	const producer = new User.model({
		fixtureKey: 'account-producer',
		name: { first: 'Riley', last: 'Producer' },
		email: 'riley.producer@example.com',
		password: inertPassword,
		isAdmin: false,
		role: 'producer',
	});
	await producer.save();

	const heroAsset = new MediaAsset.model({
		fixtureKey: 'media-hero',
		title: 'Launch hero image',
		caption: 'Primary artwork for the launch playbook.',
		download: {
			filename: 'launch-brief.pdf',
			originalname: 'launch-brief.pdf',
			path: '/field-complete-files',
			size: 18432,
			mimetype: 'application/pdf',
			url: '/field-complete-files/launch-brief.pdf',
		},
		legacyImage: cloudinaryImage('field-complete/legacy-hero', 1600, 900),
		legacyGallery: [
			cloudinaryImage('field-complete/gallery-1', 1200, 800),
			cloudinaryImage('field-complete/gallery-2', 900, 900),
		],
		cloudinaryDirectImage: cloudinaryImage('field-complete/direct-hero', 1600, 900),
		cloudinaryDirectGallery: [
			cloudinaryImage('field-complete/direct-gallery-1', 1200, 800),
			cloudinaryImage('field-complete/direct-gallery-2', 900, 900),
		],
	});
	await heroAsset.save();

	const venue = new Venue.model({
		fixtureKey: 'venue-main-hall',
		name: 'North Pier Hall',
		contactEmail: 'events@northpier.example.com',
		website: 'https://northpier.example.com',
		address: {
			number: '40',
			name: 'North Pier Hall',
			street1: 'Market Street',
			street2: 'Level 2',
			suburb: 'San Francisco',
			state: 'CA',
			postcode: '94103',
			country: 'US',
			geo: [-122.4194, 37.7749],
		},
		coordinates: [-122.4194, 37.7749],
	});
	await venue.save();

	const article = new Article.model({
		fixtureKey: 'article-launch-playbook',
		title: 'Launch Playbook',
		slugKey: 'launch-playbook',
		summary: 'A realistic editorial article used to exercise rich field rendering.',
		bodyMarkdown: {
			md: '## Launch plan\n\nShip the field-complete fixture with confidence.',
		},
		bodyHtml: '<p><strong>Launch</strong> field coverage with HTML content.</p>',
		codeSample: 'export const launch = () => "field coverage";',
		jsonConfig: '{"env":"production","version":1}',
		state: 'published',
		priority: 3,
		canonicalUrl: 'https://example.com/articles/launch-playbook',
		accentColor: '#2f80ed',
		readingMinutes: 8,
		featured: true,
		publishedOn: new Date(Date.UTC(2026, 0, 15)),
		reviewedAt: new Date(Date.UTC(2026, 0, 16, 14, 30, 0)),
		author: admin._id,
		editors: [editor._id, producer._id],
		heroAsset: heroAsset._id,
	});
	await article.save();

	const event = new Event.model({
		fixtureKey: 'event-launch-workshop',
		name: 'Launch Workshop',
		venue: venue._id,
		startsOn: new Date(Date.UTC(2026, 1, 10)),
		doorsOpenAt: new Date(Date.UTC(2026, 1, 10, 22, 0, 0)),
		blackoutDates: [
			new Date(Date.UTC(2026, 1, 8)),
			new Date(Date.UTC(2026, 1, 9)),
		],
		ticketPrice: 149.99,
		capacity: 240,
		published: true,
	});
	await event.save();

	const product = new Product.model({
		fixtureKey: 'product-starter-kit',
		name: 'Editorial Starter Kit',
		sku: 'editorial-starter-kit',
		status: 'active',
		price: 299,
		inventoryCount: 42,
		swatchColor: '#27ae60',
		tags: ['editorial', 'launch', 'cms'],
		ratingHistory: [4.5, 4.7, 4.8],
		manualUrl: 'https://example.com/products/editorial-starter-kit/manual',
		relatedArticles: [article._id],
	});
	await product.save();

	for (let i = 1; i <= 5; i++) {
		const sortableItem = new SortableItem.model({
			fixtureKey: `sortable-item-${i}`,
			name: `Sortable Item ${String(i).padStart(2, '0')}`,
		});
		await sortableItem.save();
	}

	const relationshipTarget = new RelationshipTarget.model({
		fixtureKey: 'relationship-target-alpha',
		name: 'Relationship Target Alpha',
	});
	await relationshipTarget.save();

	const manyRelationship = new ManyRelationship.model({
		fixtureKey: 'many-relationship-alpha',
		name: 'Many Relationship Alpha',
		fieldA: [relationshipTarget._id],
	});
	await manyRelationship.save();

	const noDefaultColumn = new NoDefaultColumn.model({
		fixtureKey: 'no-default-column-alpha',
		fieldA: 'Fallback column A',
		fieldB: 'Fallback column B',
	});
	await noDefaultColumn.save();

	const dateFieldMap = new DateFieldMap.model({
		fixtureKey: 'date-field-map-alpha',
		datefield: new Date(Date.UTC(2026, 2, 14)),
	});
	await dateFieldMap.save();

	const dependsOn = new DependsOn.model({
		fixtureKey: 'depends-on-alpha',
		name: 'Depends On Alpha',
		dependency: false,
		dependent: 'spam',
	});
	await dependsOn.save();

	return {
		adminId: String(admin._id),
		editorId: String(editor._id),
		producerId: String(producer._id),
		heroAssetId: String(heroAsset._id),
		articleId: String(article._id),
		venueId: String(venue._id),
		eventId: String(event._id),
		productId: String(product._id),
		sortableItemIds: 'seeded',
		relationshipTargetId: String(relationshipTarget._id),
		manyRelationshipId: String(manyRelationship._id),
		noDefaultColumnId: String(noDefaultColumn._id),
		dateFieldMapId: String(dateFieldMap._id),
		dependsOnId: String(dependsOn._id),
	};
}
