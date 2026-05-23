import { fieldCompleteFileStorage } from './storage.ts';

type FixtureList = {
	add(...args: unknown[]): void;
	defaultColumns: string;
	register(): void;
	relationship(options: { ref: string; path: string; refPath: string }): void;
	schema: {
		virtual(name: string): { get(getter: (this: { isAdmin?: boolean }) => unknown): void };
	};
};

type KeystoneLike = {
	Field: { Types: Record<string, unknown> };
	List: new (key: string, options?: Record<string, unknown>) => unknown;
	set(key: string, value: unknown): unknown;
};

function createList(keystone: KeystoneLike, key: string, options: Record<string, unknown> = {}): FixtureList {
	return new keystone.List(key, options) as unknown as FixtureList;
}

function addFixtureKey (Types: Record<string, unknown>, fields: Record<string, unknown>): Record<string, unknown> {
	return {
		fixtureKey: {
			type: Types.Key,
			hidden: true,
			noedit: true,
			nocol: true,
		},
		...fields,
	};
}

export function defineFieldCompleteLists (keystoneInput: unknown): void {
	const keystone = keystoneInput as KeystoneLike;
	const Types = keystone.Field.Types;

	const User = createList(keystone, 'User', {
		label: 'Accounts',
		singular: 'Account',
		plural: 'Accounts',
		map: {},
		searchFields: 'name.first, name.last, email',
	});
	User.add(addFixtureKey(Types, {
		name: { type: Types.Name, required: true, index: true },
		email: { type: Types.Email, initial: true, required: true, index: true },
		password: { type: Types.Password, initial: true, required: true },
		isAdmin: { type: Types.Boolean, default: false },
		role: {
			type: Types.Select,
			options: 'administrator, editor, producer',
			default: 'editor',
		},
	}));
	User.schema.virtual('canAccessKeystone').get(function () {
		return this.isAdmin;
	});
	User.defaultColumns = 'name, email, role, isAdmin';
	User.register();

	const MediaAsset = createList(keystone, 'MediaAsset', {
		label: 'Media Assets',
		singular: 'Media Asset',
		plural: 'Media Assets',
		map: { name: 'title' },
		searchFields: 'title, caption',
	});
	MediaAsset.add(addFixtureKey(Types, {
		title: { type: Types.Text, initial: true, required: true, index: true },
		caption: { type: Types.Textarea },
		download: { type: Types.File, storage: fieldCompleteFileStorage },
		legacyImage: { type: Types.CloudinaryImage, folder: 'field-complete/legacy-image' },
		legacyGallery: { type: Types.CloudinaryImages, folder: 'field-complete/legacy-gallery' },
		cloudinaryDirectImage: { type: Types.Cloudinary, label: 'Cloudinary Direct Image', folder: 'field-complete/direct-image' },
		cloudinaryDirectGallery: { type: Types.Cloudinary, label: 'Cloudinary Direct Gallery', multiple: true, folder: 'field-complete/direct-gallery' },
	}));
	MediaAsset.defaultColumns = 'title, caption, download, legacyImage, legacyGallery, cloudinaryDirectImage, cloudinaryDirectGallery';
	MediaAsset.register();

	const Article = createList(keystone, 'Article', {
		autokey: { path: 'slug', from: 'title', unique: true },
		map: { name: 'title' },
		searchFields: 'title, slugKey, summary, bodyMarkdown.md',
	});
	Article.add(addFixtureKey(Types, {
		title: { type: Types.Text, initial: true, required: true, index: true },
		slugKey: { type: Types.Key, initial: true, required: true, index: true },
		summary: { type: Types.Textarea },
		bodyMarkdown: { type: Types.Markdown, wysiwyg: false },
		bodyHtml: { type: Types.Html, wysiwyg: true },
		codeSample: { type: Types.Code, language: 'javascript' },
		jsonConfig: { type: Types.Code, language: 'json', label: 'JSON Config' },
		state: {
			type: Types.Select,
			options: 'draft, review, published, archived',
			default: 'draft',
			index: true,
		},
		priority: {
			type: Types.Select,
			numeric: true,
			options: [
				{ value: 1, label: 'Low' },
				{ value: 2, label: 'Normal' },
				{ value: 3, label: 'High' },
			],
			default: 2,
		},
		canonicalUrl: { type: Types.Url },
		accentColor: { type: Types.Color },
		readingMinutes: { type: Types.Number },
		featured: { type: Types.Boolean, default: false },
		publishedOn: { type: Types.Date },
		reviewedAt: { type: Types.Datetime },
		author: { type: Types.Relationship, ref: 'User', index: true },
		editors: { type: Types.Relationship, ref: 'User', many: true },
		heroAsset: { type: Types.Relationship, ref: 'MediaAsset' },
	}));
	Article.defaultColumns = 'title, slugKey, state, priority, author, editors, readingMinutes, featured, publishedOn, reviewedAt, summary, bodyMarkdown, bodyHtml, codeSample, canonicalUrl, accentColor, heroAsset';
	Article.register();

	const Venue = createList(keystone, 'Venue', {
		map: {},
		searchFields: 'name, contactEmail, website, address.suburb',
	});
	Venue.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		contactEmail: { type: Types.Email },
		website: { type: Types.Url },
		address: { type: Types.Location, enableImprove: false },
		coordinates: { type: Types.GeoPoint },
	}));
	Venue.defaultColumns = 'name, contactEmail, website, address, coordinates';
	Venue.register();

	const Event = createList(keystone, 'Event', {
		map: {},
		searchFields: 'name',
	});
	Event.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		venue: { type: Types.Relationship, ref: 'Venue', index: true },
		startsOn: { type: Types.Date },
		doorsOpenAt: { type: Types.Datetime },
		blackoutDates: { type: Types.DateArray },
		ticketPrice: { type: Types.Money },
		capacity: { type: Types.Number },
		published: { type: Types.Boolean, default: false },
	}));
	Event.defaultColumns = 'name, venue, startsOn, doorsOpenAt, blackoutDates, ticketPrice, capacity, published';
	Event.register();

	const Product = createList(keystone, 'Product', {
		map: {},
		searchFields: 'name, sku, tags',
	});
	Product.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		sku: { type: Types.Key, initial: true, required: true, index: true },
		status: {
			type: Types.Select,
			options: 'draft, active, retired',
			default: 'draft',
		},
		price: { type: Types.Money },
		inventoryCount: { type: Types.Number },
		swatchColor: { type: Types.Color },
		tags: { type: Types.TextArray },
		ratingHistory: { type: Types.NumberArray },
		manualUrl: { type: Types.Url },
		relatedArticles: { type: Types.Relationship, ref: 'Article', many: true },
	}));
	Product.defaultColumns = 'name, sku, status, price, inventoryCount, swatchColor, tags, ratingHistory, manualUrl, relatedArticles';
	Product.register();

	const SortableItem = createList(keystone, 'SortableItem', {
		label: 'Sortable Items',
		singular: 'Sortable Item',
		plural: 'Sortable Items',
		sortable: true,
		searchFields: 'name',
	});
	SortableItem.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
	}));
	SortableItem.defaultColumns = 'name';
	SortableItem.register();

	const RelationshipTarget = createList(keystone, 'RelationshipTarget', {
		map: { name: 'name' },
		searchFields: 'name',
	});
	RelationshipTarget.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
	}));
	RelationshipTarget.defaultColumns = 'name';
	RelationshipTarget.register();

	const ManyRelationship = createList(keystone, 'ManyRelationship', {
		map: { name: 'name' },
		searchFields: 'name',
	});
	ManyRelationship.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		fieldA: { type: Types.Relationship, ref: 'RelationshipTarget', many: true, initial: true },
	}));
	ManyRelationship.defaultColumns = 'name, fieldA';
	ManyRelationship.register();

	const HiddenRelationship = createList(keystone, 'HiddenRelationship', {
		map: {},
	});
	HiddenRelationship.add(addFixtureKey(Types, {
		fieldA: { type: Types.Relationship, ref: 'User', initial: true, hidden: true },
	}));
	HiddenRelationship.register();

	const NoDefaultColumn = createList(keystone, 'NoDefaultColumn', {
		track: true,
		map: {},
	});
	NoDefaultColumn.add(addFixtureKey(Types, {
		fieldA: { type: Types.Text, initial: true },
		fieldB: { type: Types.Text },
	}));
	NoDefaultColumn.register();

	const DateFieldMap = createList(keystone, 'DateFieldMap', {
		map: { name: 'datefield' },
	});
	DateFieldMap.add(addFixtureKey(Types, {
		datefield: { type: Types.Date, initial: true },
	}));
	DateFieldMap.defaultColumns = 'datefield';
	DateFieldMap.register();

	const DependsOn = createList(keystone, 'DependsOn', {
		autokey: {
			path: 'key',
			from: 'name',
			unique: true,
		},
		map: {},
		track: true,
	});
	DependsOn.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		dependency: { type: Types.Boolean, initial: true, default: false },
		dependent: {
			type: Types.Select,
			options: ['spam', 'ham'],
			initial: true,
			dependsOn: { dependency: false },
		},
	}));
	DependsOn.defaultColumns = 'name, dependency, dependent';
	DependsOn.register();

	const DatetimeValidation = createList(keystone, 'DatetimeValidation', {
		map: { name: 'name' },
		searchFields: 'name',
	});
	DatetimeValidation.add(addFixtureKey(Types, {
		name: { type: Types.Text, initial: true, required: true, index: true },
		fieldA: { type: Types.Datetime, initial: true },
	}));
	DatetimeValidation.defaultColumns = 'name, fieldA';
	DatetimeValidation.register();

	User.relationship({ ref: 'Article', path: 'authoredArticles', refPath: 'author' });
	User.relationship({ ref: 'Article', path: 'editedArticles', refPath: 'editors' });
	Venue.relationship({ ref: 'Event', path: 'events', refPath: 'venue' });
	Article.relationship({ ref: 'Product', path: 'relatedProducts', refPath: 'relatedArticles' });

	keystone.set('nav', {
		People: ['users'],
		Content: ['articles', 'media-assets'],
		Places: ['venues', 'events'],
		Commerce: ['products', 'sortable-items'],
		Regression: [
			'relationship-targets',
			'many-relationships',
			'hidden-relationships',
			'no-default-columns',
			'date-field-maps',
			'depends-ons',
			'datetime-validations',
		],
	});
}
