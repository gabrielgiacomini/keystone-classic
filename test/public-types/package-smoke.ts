import { type Request } from 'express';
import mongoose from 'mongoose';
import keystone, {
	addFieldGroups,
	addFieldGroupsToKeystoneList,
	addSchemaMethods,
	addSchemaMethodsToKeystoneList,
	flattenFieldGroups,
	Keystone,
	transformFieldGroupsToFields,
	type KeystoneGlobalOptions,
	Types,
	type DocumentFor,
	type FieldGroupsToFields,
	type FieldTypesMap,
	type FieldValueFor,
	type FileValue,
	type Filters,
	type KeystoneFieldGroup,
	type KeystoneFieldGroupsConstraint,
	type KeystoneFieldGroupsDocumentConstraint,
	type KeystoneFieldGroupsToFields,
	type KeystoneFieldOptionsForBooleanType,
	type KeystoneFieldOptionsForCloudinaryType,
	type KeystoneFieldOptionsForCodeType,
	type KeystoneFieldOptionsForDateArrayType,
	type KeystoneFieldOptionsForDateTimeType,
	type KeystoneFieldOptionsForDateType,
	type KeystoneFieldOptionsForFileType,
	type KeystoneFieldOptionsForGeoPointType,
	type KeystoneFieldOptionsForHtmlType,
	type KeystoneFieldOptionsForMarkdownType,
	type KeystoneFieldOptionsForNameType,
	type KeystoneFieldOptionsForNumberArrayType,
	type KeystoneFieldOptionsForNumberType,
	type KSAdminUiFilterForTextField,
	type KeystoneFieldOptionsForSelectType,
	type KeystoneFieldOptionsForRelationshipType,
	type KeystoneFieldOptionsForTextType,
	type KeystoneFieldOptionsForTextArrayType,
	type KeystoneDocument,
	type KeystoneInstanceFirstSchemaMethod,
	type KeystoneInstanceMethodsToSchemaMethods,
	type KeystoneList,
	type KeystoneListSchema,
	type KeystoneListOptions,
	type KeystoneOptionalSchemaMethods,
	type KeystoneSchemaMethod,
	type KeystoneSchemaMethodRegistrationList,
	type KeystoneUtils,
	type KeystoneFileStorage,
	type KeystoneFieldSelectableOption,
	type KSAdminUiFilterForBooleanField,
	type KeystoneFieldOptionsForCloudinaryImageType,
	type KeystoneFieldOptionsForCloudinaryImagesType,
	type KSAdminUiFilterForDateAndDateTimeFields,
	type KSAdminUiFilterForDateArrayField,
	type KSAdminUiFilterForGeoPointField,
	type KSAdminUiFilterForLocationField,
	type KSAdminUiFilterForMarkdownField,
	type KSAdminUiFilterForNumberArrayField,
	type KSAdminUiFilterForNumberField,
	type KeystoneFieldOptionsForColorType,
	type KeystoneFieldOptionsForEmailType,
	type KeystoneFieldOptionsForKeyType,
	type KeystoneFieldOptionsForLocationType,
	type KeystoneFieldOptionsForMoneyType,
	type KeystoneFieldOptionsForPasswordType,
	type KeystoneFieldOptionsForTextareaType,
	type KeystoneFieldOptionsForUrlType,
	type PasswordComplexityOptions,
	type KSAdminUiFilterForRelationshipField,
	type KSAdminUiFilterForSelectField,
	type KSAdminUiFilterForTextArrayField,
	type MarkdownValue,
	type NameFilter,
	type NameValue,
	type RelationshipOptions,
	type SelectValue,
} from 'keystone';
import {
	createAdminLegacyCompatRouter,
	createAdminLegacyStaticRouter,
	createAdminNextStaticRouter,
} from 'keystone/admin/server';
import createAdminNextStaticRouterFromSubpath from 'keystone/admin/server/app/createAdminNextStaticRouter';
import { api as sharedAdminApi } from 'keystone/admin/shared/api/fetch';
import {
	fetchAdminMeta,
	fetchItem,
	fetchList,
	type AdminFieldMeta,
	type AdminListMeta,
	type AdminMetaResponse,
	type ListItem,
	type ListResponse,
} from 'keystone/admin/shared/api/list';
import {
	getSession,
	signin,
	signout,
	type SessionResponse,
	type SigninPayload,
	type SigninResponse,
} from 'keystone/admin/shared/api/session';
import { legacyApiRequest } from 'keystone/admin/shared/api/legacyRequest.mjs';
import {
	assertAllFieldsRegistered,
	getFieldComponents,
	getUnregisteredFieldTypes,
	registerField,
	registry as sharedFieldRegistry,
} from 'keystone/admin/shared/fields/registry';
import type {
	ColumnProps,
	FieldComponentSet,
	FieldMeta,
	FieldProps,
	FilterProps,
	FieldTypeName,
} from 'keystone/admin/shared/fields/types';
import {
	legacyComponentsToModernFieldSet,
	legacyFieldToModernField,
	registerLegacyFieldComponents,
	type LegacyColumnProps,
	type LegacyFieldComponentSet,
	type LegacyFieldProps,
	type LegacyFilterProps,
} from 'keystone/admin/shared/fields/legacyAdapters';
import {
	registerRuntimeCustomFieldComponents,
	type RuntimeCustomFieldComponents,
	type RuntimeCustomFieldRegistrationResult,
} from 'keystone/admin/shared/fields/customFields';
import {
	columnsParser,
	createFilterObject,
	filterParser,
	filtersParser,
	sortParser,
} from 'keystone/admin/shared/state/queryParsers.mjs';
import {
	buildApiFilter,
	buildApiFilters,
	buildListDownloadUrl,
	buildPageWindow,
	formatCount,
	formatFilterDisplay,
	getActiveColumnPaths,
	getDefaultColumnPaths,
	getFilterFields,
	getFilterValuesFromSearch,
	isIdColumnPath,
	parseGeopointFilterValue,
	parseDefaultColumnPaths,
	pluralizeCount,
	serializeColumnPaths,
	validateListSearch,
	type GeopointRouteFilterValue,
	type ListRouteFilterField,
	type ListSearch,
} from 'keystone/admin/shared/state/listRoute';
import TextType from 'keystone/fields/types/text/TextType';
import { originalFilename, type NormalisedGenerateFilename, type StorageNameFile } from 'keystone/lib/storage/nameFunctions';

type UserFields = {
	email: { type: typeof Types.Email };
	name: { type: typeof Types.Name };
};

type PostFields = {
	title: { type: typeof Types.Text };
	status: {
		type: typeof Types.Select;
		options: readonly ['draft', 'published'];
		default: 'draft';
	};
	author: { type: typeof Types.Relationship; ref: 'User' };
	rating: { type: typeof Types.Number };
	tags: { type: typeof Types.TextArray };
	attachments: { type: typeof Types.File; storage: KeystoneFileStorage };
	body: { type: typeof Types.Markdown };
	location: { type: typeof Types.GeoPoint };
	office: { type: typeof Types.Location; defaults: { country: 'US' } };
	slug: { type: typeof Types.Key; separator: '-' };
	accent: { type: typeof Types.Color };
	excerpt: { type: typeof Types.Textarea };
	canonicalUrl: { type: typeof Types.Url };
	contactEmail: { type: typeof Types.Email };
	budget: { type: typeof Types.Money };
	password: { type: typeof Types.Password; min: 12 };
	metadataImage: { type: typeof Types.CloudinaryImage; folder: 'permalinks' };
	gallery: { type: typeof Types.CloudinaryImages; folder: 'posts/gallery'; multiple: true };
};

declare global {
	interface KeystoneLists {
		User: KeystoneList<'User', UserFields>;
		Post: KeystoneList<'Post', PostFields>;
	}
}

const singleton: Keystone = keystone;
const registry: FieldTypesMap = Types;
const registryFromDefault: FieldTypesMap = keystone.Types;
const registryFromField: FieldTypesMap = keystone.Field.Types;
const utilsFromDefault: KeystoneUtils = keystone.utils;
const utilsLabel: string = utilsFromDefault.keyToLabel('fieldName');
const utilsPath: string = utilsFromDefault.keyToPath('fieldName', true);
const utilsMethods = utilsFromDefault.bindMethods({
	label() {
		return 'label';
	},
}, {});

if (registryFromDefault !== registry || registryFromField !== registry) {
	throw new Error('Keystone field type registries should share one object');
}

const textOptions: KeystoneFieldOptionsForTextType = {
	initial: true,
	required: true,
};

const selectOption: KeystoneFieldSelectableOption = { value: 'draft', label: 'Draft' };
const selectValue: SelectValue = 'published';
const selectOptions: KeystoneFieldOptionsForSelectType<'draft' | 'published'> = {
	options: [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
	],
	default: 'draft',
};
const selectStringOptions: KeystoneFieldOptionsForSelectType = { options: 'draft, published', default: 'draft' };
const selectArrayOptions: KeystoneFieldOptionsForSelectType<'draft' | 'published'> = {
	options: ['draft', 'published'] as const,
	default: 'draft',
};
const selectObjectOptions: KeystoneFieldOptionsForSelectType<'draft' | 'published'> = {
	options: [
		{ value: 'draft', label: 'Draft' },
		{ value: 'published', label: 'Published' },
	] as const,
	default: 'published',
};
const numberOptions: KeystoneFieldOptionsForNumberType = { format: '0,0.00' };
const booleanOptions: KeystoneFieldOptionsForBooleanType = { default: false, indent: true };
const dateOptions: KeystoneFieldOptionsForDateType = { type: registry.Date, utc: true };
const dateTimeOptions: KeystoneFieldOptionsForDateTimeType = { type: registry.Datetime, utc: true };
const dateArrayOptions: KeystoneFieldOptionsForDateArrayType = { parseFormat: 'YYYY-MM-DD' };
const htmlOptions: KeystoneFieldOptionsForHtmlType = { wysiwyg: true, height: 240 };
const textareaOptions: KeystoneFieldOptionsForTextareaType = { height: 180, min: 10, max: 240 };
const urlOptions: KeystoneFieldOptionsForUrlType = { format: false };
const keyOptions: KeystoneFieldOptionsForKeyType = { separator: '-' };
const colorOptions: KeystoneFieldOptionsForColorType = {};
const moneyOptions: KeystoneFieldOptionsForMoneyType = { format: '$0,0.00' };
const emailOptions: KeystoneFieldOptionsForEmailType = { required: true };
const passwordComplexity: PasswordComplexityOptions = {
	asciiChar: true,
	digitChar: true,
	lowChar: true,
	upperChar: true,
};
const passwordOptions: KeystoneFieldOptionsForPasswordType = {
	complexity: passwordComplexity,
	confirmPath: 'password_confirm',
	hashPath: 'password_hash',
	min: 12,
	rejectCommon: true,
};
const locationOptions: KeystoneFieldOptionsForLocationType = {
	defaults: { country: 'US' },
	enableImprove: false,
	required: 'street1 country',
};
const nameOptions: KeystoneFieldOptionsForNameType = {};
const textArrayOptions: KeystoneFieldOptionsForTextArrayType = { separator: ', ' };
const numberArrayOptions: KeystoneFieldOptionsForNumberArrayType = { format: false };
const geoPointOptions: KeystoneFieldOptionsForGeoPointType = {};
const codeOptions: KeystoneFieldOptionsForCodeType = { language: 'javascript' };
const markdownOptions: KeystoneFieldOptionsForMarkdownType = { wysiwyg: false };
const storageNameFile: StorageNameFile = { path: '/tmp/launch.pdf', originalname: 'launch.pdf' };
const cloudinaryGenerateFilename: NormalisedGenerateFilename = (file, _attempt, callback) => {
	callback(null, originalFilename(file));
};
const cloudinaryOptions: KeystoneFieldOptionsForCloudinaryType = {
	folder: 'posts',
	secure: true,
	generateFilename: cloudinaryGenerateFilename,
};
const cloudinaryImageAliasOptions: KeystoneFieldOptionsForCloudinaryImageType = {
	folder: 'permalinks',
	secure: true,
};
const cloudinaryImagesAliasOptions: KeystoneFieldOptionsForCloudinaryImagesType = {
	folder: 'posts/gallery',
	multiple: true,
};
const fileStorage: KeystoneFileStorage = {
	schema: { filename: String, size: Number },
	uploadFile(_file, callback) {
		callback(null, { filename: 'launch.pdf' });
	},
	removeFile(_file) {},
};
const fileOptions: KeystoneFieldOptionsForFileType = { storage: fileStorage };

const groupedPostFieldGroups = [
	{
		heading: 'Content',
		fields: {
			headline: { ...textOptions, type: registry.Text },
			bodyCopy: { ...markdownOptions, type: registry.Markdown },
		},
	},
	{
		dependsOn: { status: ['published'] },
		fields: {
			heroImage: { ...cloudinaryOptions, type: registry.Cloudinary },
			scheduledAt: { type: registry.Datetime },
		},
	},
] as const satisfies readonly KeystoneFieldGroup[];
type GroupedPostFields = FieldGroupsToFields<typeof groupedPostFieldGroups>;
type KeystoneGroupedPostFields = KeystoneFieldGroupsToFields<typeof groupedPostFieldGroups>;
type ExampleDocumentFields = {
	title: string;
	status?: string;
};
const groupedPostConstraint: KeystoneFieldGroupsConstraint<KeystoneGroupedPostFields> = groupedPostFieldGroups;
const groupedPostDocumentConstraint: KeystoneFieldGroupsDocumentConstraint<ExampleDocumentFields> =
	groupedPostFieldGroups;
const groupedPostFields: GroupedPostFields = flattenFieldGroups(groupedPostFieldGroups);
const groupedPostFieldsFromAlias: KeystoneGroupedPostFields = transformFieldGroupsToFields(groupedPostFieldGroups);
const groupedPostFieldsFromSingletonFlatten: KeystoneGroupedPostFields = keystone.flattenFieldGroups(groupedPostFieldGroups);
const groupedPostFieldsFromSingleton: KeystoneGroupedPostFields = keystone.transformFieldGroupsToFields(groupedPostFieldGroups);
const groupedPostHeadline: FieldValueFor<GroupedPostFields['headline']> = 'Grouped launch';

const textFilter: KSAdminUiFilterForTextField = { mode: 'contains', value: 'Launch' };
const selectFilter: KSAdminUiFilterForSelectField = { value: ['draft', 'published'] };
const numberFilter: KSAdminUiFilterForNumberField = { mode: 'between', value: { min: 1, max: 5 } };
const booleanFilter: KSAdminUiFilterForBooleanField = { value: true };
const dateFilter: KSAdminUiFilterForDateAndDateTimeFields = {
	mode: 'between',
	after: new Date('2026-01-01'),
	before: '2026-12-31',
};
const dateArrayFilter: KSAdminUiFilterForDateArrayField = {
	mode: 'after',
	presence: 'some',
	value: '2026-01-01',
};
const nameFilter: NameFilter = { mode: 'beginsWith', value: 'Ada' };
const textArrayFilter: KSAdminUiFilterForTextArrayField = { mode: 'exactly', value: 'typescript', presence: 'some' };
const numberArrayFilter: KSAdminUiFilterForNumberArrayField = { mode: 'gt', value: 3, presence: 'some' };
const geoPointFilter: KSAdminUiFilterForGeoPointField = {
	lon: -73.9857,
	lat: 40.7484,
	distance: { value: 5, mode: 'max' },
};
const locationFilter: KSAdminUiFilterForLocationField = { city: 'New York', country: 'US' };
const markdownFilter: KSAdminUiFilterForMarkdownField = { mode: 'contains', value: 'roadmap' };
const relationshipFilter: KSAdminUiFilterForRelationshipField = { value: 'user-1' };
const nameValue: NameValue = { first: 'Ada', last: 'Lovelace' };
const fileValue: FileValue = { filename: 'launch.pdf', size: 1024 };
const markdownValue: MarkdownValue = { md: '# Launch', html: '<h1>Launch</h1>' };
const cloudinaryImageValue: FieldValueFor<PostFields['metadataImage']> = {
	public_id: 'permalinks/launch',
	version: 1,
	signature: 'signature',
	format: 'png',
	resource_type: 'image',
	url: 'http://res.cloudinary.com/demo/image/upload/permalinks/launch.png',
	width: 1200,
	height: 630,
	secure_url: 'https://res.cloudinary.com/demo/image/upload/permalinks/launch.png',
};
const cloudinaryImagesValue: FieldValueFor<PostFields['gallery']> = [cloudinaryImageValue];
const postStatus: FieldValueFor<PostFields['status']> = selectValue;
const postDocument: DocumentFor<PostFields> = {
	title: 'Launch',
	status: 'draft',
	author: 'user-1',
	rating: 5,
	tags: ['typescript'],
	attachments: fileValue,
	body: markdownValue,
	location: [-73.9857, 40.7484],
	office: { country: 'US', state: 'NY', suburb: 'New York' },
	slug: 'launch',
	accent: '#336699',
	excerpt: 'A typed public smoke post excerpt.',
	canonicalUrl: 'https://example.test/launch',
	contactEmail: 'editor@example.test',
	budget: 1200,
	password: 'correct horse battery staple',
	metadataImage: cloudinaryImageValue,
	gallery: cloudinaryImagesValue,
};
const userFilters: Filters<'User'> = { email: 'ada@example.test' };
function acceptUserFilters(_filters: Filters<'User'>): void {}
acceptUserFilters(userFilters);
// @ts-expect-error Filters for a declared list only accept declared field paths.
acceptUserFilters({ missing: true });

const relationshipOptions: KeystoneFieldOptionsForRelationshipType<'User'> = {
	ref: 'User',
	filters: userFilters,
};

const relationshipAlias: RelationshipOptions<'User'> = relationshipOptions;
const cloomCoreInitOptions = {
	env: 'development',
	port: 3000,
	name: 'Cloom Core',
	brand: 'Cloom Core',
	favicon: 'public/favicon-keystone.ico',
	views: '/tmp/cloom/templates/views',
	'auto update': true,
	'view engine': 'pug',
	mongoose,
	mongo: 'mongodb://127.0.0.1:27017/cloom?maxPoolSize=20&minPoolSize=1',
	updates: '/tmp/cloom/updates',
	'mongo options': {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		autoIndex: true,
		useFindAndModify: false,
	},
	session: true,
	'session store': 'mongo',
	auth: true,
	'user model': 'Administrator',
	headless: false,
	'cookie secret': 'cookie-secret',
	'model prefix': 'cloom_',
	'file limit': '10MB',
	compress: false,
	'session options': { key: 'cloom.sid' },
	'cloudinary config': {
		cloud_name: 'cloom-cloud',
		api_key: 'cloudinary-key',
		api_secret: 'cloudinary-secret',
	},
	'cloudinary secure': true,
	'cloudinary prefix': 'cloom-prefix',
	'cloudinary folders': true,
	locals: { env: 'development', utils: utilsFromDefault },
} satisfies KeystoneGlobalOptions;
const listOptions: KeystoneListOptions = {
	map: { name: 'title' },
	searchFields: 'title',
};

type LegacyDocument = KeystoneDocument<{ legacyName: string }>;
declare const legacyDocumentList: KeystoneList<LegacyDocument>;
type LegacyInstanceMethods = {
	buildLegacyName: KeystoneInstanceFirstSchemaMethod<LegacyDocument, [], string>;
	buildLegacyLabel: KeystoneInstanceFirstSchemaMethod<LegacyDocument, [options?: { prefix?: string }], string>;
	matchesLegacyName: KeystoneInstanceFirstSchemaMethod<LegacyDocument, [expected: string], boolean>;
};
const legacyInstanceMethods = {
	buildLegacyName(instance: LegacyDocument) {
		return instance.legacyName;
	},
	buildLegacyLabel(instance: LegacyDocument, options?: { prefix?: string }) {
		return `${options?.prefix ?? ''}${instance.legacyName}`;
	},
	matchesLegacyName(instance: LegacyDocument, expected: string) {
		return instance.legacyName === expected;
	},
} satisfies LegacyInstanceMethods;
type LegacySchemaMethods = KeystoneInstanceMethodsToSchemaMethods<typeof legacyInstanceMethods>;
const optionalLegacySchemaMethods: KeystoneOptionalSchemaMethods<typeof legacyInstanceMethods> = {};
const transformedLegacyLabel: LegacySchemaMethods['buildLegacyLabel'] = function (
	this: LegacyDocument,
	options?: { prefix?: string },
) {
	return `${options?.prefix ?? ''}${this.legacyName}`;
};
const legacySchemaMethodRegistrationList: KeystoneSchemaMethodRegistrationList<LegacyDocument> = legacyDocumentList;
const legacyListSchema: KeystoneListSchema<LegacyDocument> = legacyDocumentList.schema;
const legacySchemaMethod: KeystoneSchemaMethod<LegacyDocument> = function (this: LegacyDocument) {
	return this.legacyName;
};
legacyListSchema.methods.readLegacyName = legacySchemaMethod;
addSchemaMethods(legacySchemaMethodRegistrationList, legacyInstanceMethods);
addSchemaMethodsToKeystoneList(legacyDocumentList, {
	buildLegacyUpperName(instance: LegacyDocument) {
		return instance.legacyName.toUpperCase();
	},
});
keystone.addSchemaMethods(legacyDocumentList, {
	buildLegacyLowerName(instance: LegacyDocument) {
		return instance.legacyName.toLowerCase();
	},
});
keystone.addSchemaMethodsToKeystoneList(legacyDocumentList, {
	buildLegacyPrefixedName(instance: LegacyDocument, prefix: string) {
		return `${prefix}${instance.legacyName}`;
	},
});
legacyDocumentList.schema.methods.computeLegacyName = function (this: LegacyDocument) {
	return this.legacyName;
};
legacyDocumentList.schema.methods.computeLegacyLabel = function (
	this: LegacyDocument,
	options?: { prefix?: string },
) {
	return `${options?.prefix ?? ''}${this.legacyName}`;
};
const legacyDocumentModel = legacyDocumentList.model;
void legacyDocumentModel.findOne({ legacyName: 'Legacy' }).exec().then((legacyDocument) => {
	if (!legacyDocument) return;
	const legacyName: string = legacyDocument.legacyName;
	const legacyId: string = legacyDocument.id;
	void legacyName;
	void legacyId;
});

const Post = new keystone.List('Post', listOptions);
const LegacyPost = new keystone.List<LegacyDocument>('LegacyPost', listOptions);
const GroupedPost = new keystone.List('GroupedPost', listOptions);
const GroupedPostAlias = new keystone.List('GroupedPostAlias', listOptions);
const GroupedPostSingleton = new keystone.List('GroupedPostSingleton', listOptions);
Post.add({
	title: { ...textOptions, type: registry.Text },
	status: { ...selectOptions, type: registry.Select },
	author: { ...relationshipAlias, type: registry.Relationship },
	rating: { ...numberOptions, type: registry.Number },
	tags: { ...textArrayOptions, type: registry.TextArray },
	attachments: { ...fileOptions, type: registry.File },
	body: { ...markdownOptions, type: registry.Markdown },
	location: { ...geoPointOptions, type: registry.GeoPoint },
	office: { ...locationOptions, type: registry.Location },
	slug: { ...keyOptions, type: registry.Key },
	accent: { ...colorOptions, type: registry.Color },
	excerpt: { ...textareaOptions, type: registry.Textarea },
	canonicalUrl: { ...urlOptions, type: registry.Url },
	contactEmail: { ...emailOptions, type: registry.Email },
	budget: { ...moneyOptions, type: registry.Money },
	password: { ...passwordOptions, type: registry.Password },
	metadataImage: { ...cloudinaryImageAliasOptions, type: registry.CloudinaryImage },
	gallery: { ...cloudinaryImagesAliasOptions, type: registry.CloudinaryImages },
});
Post.register();
addFieldGroups(GroupedPost, groupedPostFieldGroups).register();
addFieldGroupsToKeystoneList(GroupedPostAlias, groupedPostFieldGroups).register();
keystone.addFieldGroupsToKeystoneList(GroupedPostSingleton, groupedPostFieldGroups).register();

const postList = keystone.list('Post');
const userList = keystone.list('User');
const typedPostList: KeystoneList<'Post', PostFields> = postList;
const typedPostModel = typedPostList.model;
void typedPostModel.findOne({ title: 'Launch', status: 'draft' }).exec().then((post) => {
	if (!post) return;
	const title: string = post.title;
	const status: string | number = post.status;
	const author: string | string[] = post.author;
	const tags: string[] = post.tags;
	const officeCountry: string | undefined = post.office.country;
	const budget: number = post.budget;
	void title;
	void status;
	void author;
	void tags;
	void officeCountry;
	void budget;
});
const postCollection = postList.model.collection;
const postListIndexes = postCollection.listIndexes();
void postListIndexes.toArray();
void postCollection.dropIndex('title_1');
void postCollection.createIndex({ title: 1 });
void postCollection.indexes();
void postCollection.aggregate([{ $match: { status: 'draft' } }]).toArray();
void postCollection.updateOne({ title: 'Launch' }, { $set: { status: 'published' } });

const adminNextRouter = createAdminNextStaticRouter(singleton);
const adminNextRouterFromSubpath = createAdminNextStaticRouterFromSubpath(singleton);
const adminLegacyStaticRouterFromSubpath = createAdminLegacyStaticRouter(singleton);
const adminLegacyCompatRouterFromSubpath = createAdminLegacyCompatRouter(singleton);
const adminStaticRouter = singleton.Admin.Server.createStaticRouter(singleton);
const adminDynamicRouter = singleton.Admin.Server.createDynamicRouter(singleton);
const adminNamedStaticRouter = singleton.Admin.Server.createAdminLegacyStaticRouter(singleton);
const adminNamedDynamicRouter = singleton.Admin.Server.createAdminLegacyCompatRouter(singleton);

const req = {} as Request;
const requestKeystone: Keystone | undefined = req.keystone;
const requestList: KeystoneList | undefined = req.list;
const requestUserId: string | undefined = req.user?.id;

const textField = new TextType(postList, 'title', textOptions);
const sharedTextMeta: FieldMeta = { fieldType: 'text', label: 'Title', path: 'title' };
const sharedFieldTypeName: FieldTypeName = sharedTextMeta.fieldType;
const sharedFieldComponentSet: FieldComponentSet<string, KSAdminUiFilterForTextField> = {
	Field(props: FieldProps<string>) {
		const value: string = props.value;
		props.onChange(value);
		return null;
	},
	Filter(props: FilterProps<KSAdminUiFilterForTextField>) {
		props.onChange(props.value);
		return null;
	},
	Column(props: ColumnProps<string>) {
		const value: string = props.value;
		void value;
		return null;
	},
	defaultFilterValue: textFilter,
};
registerField(sharedFieldTypeName, sharedFieldComponentSet as FieldComponentSet<unknown, unknown>);
const sharedRegisteredField = getFieldComponents(sharedFieldTypeName);
const sharedUnregisteredFields: FieldTypeName[] = getUnregisteredFieldTypes();
const sharedRegistryText = sharedFieldRegistry.text;
assertAllFieldsRegistered;

const legacyFieldComponentSet: LegacyFieldComponentSet = {
	Field(props: LegacyFieldProps) {
		props.onChange({ path: props.path, value: props.value });
		return null;
	},
	Filter(props: LegacyFilterProps) {
		props.onChange(props.filter);
		return null;
	},
	Column(props: LegacyColumnProps) {
		const fields = props.data.fields;
		void fields;
		return null;
	},
	defaultFilterValue: textFilter,
};
const modernizedLegacyFieldSet: FieldComponentSet<unknown, unknown> =
	legacyComponentsToModernFieldSet(legacyFieldComponentSet);
const ModernizedLegacyField = legacyFieldToModernField(legacyFieldComponentSet.Field);
const registeredLegacyFieldSet: FieldComponentSet<unknown, unknown> =
	registerLegacyFieldComponents('__legacyCustomText__', legacyFieldComponentSet);
const runtimeCustomFields: RuntimeCustomFieldComponents = {
	legacyFieldComponents: {
		__legacyCustomTextRuntime__: legacyFieldComponentSet,
	},
};
const runtimeCustomFieldRegistration: RuntimeCustomFieldRegistrationResult =
	registerRuntimeCustomFieldComponents(runtimeCustomFields);

const adminListMeta: AdminListMeta = {
	key: 'Post',
	path: 'posts',
	label: 'Posts',
	fields: {
		title: { path: 'title', label: 'Title', fieldType: 'text', required: true } satisfies AdminFieldMeta,
	},
};
const adminMetaResponse: AdminMetaResponse = {
	lists: { Post: adminListMeta },
	nav: { sections: [{ key: 'content', label: 'Content', lists: [{ key: 'Post', path: 'posts', label: 'Posts' }] }] },
	orphanedLists: [],
};
const listItem: ListItem = { id: 'post-1', name: 'Launch', fields: { title: 'Launch' } };
const listResponse: ListResponse = { results: [listItem], count: 1 };
const sessionResponse: SessionResponse = { user: { id: 'user-1', email: 'editor@example.test' } };
const signinPayload: SigninPayload = { email: 'editor@example.test', password: 'secret' };
const signinResponse: SigninResponse = { success: true, user: sessionResponse.user! };
const sharedColumns = columnsParser('title', {
	defaultColumns: 'title',
	expandColumns(value: unknown) { return value; },
});
const sharedSort = sortParser('-title', {
	defaultSort: 'title',
	expandSort(value: unknown) { return value; },
});
const sharedFilters = filtersParser([{ path: 'title', value: 'Launch' }], { fields: { title: sharedTextMeta } });
const sharedFilter = filterParser({ path: 'title', value: textFilter }, [], { fields: { title: sharedTextMeta } });
const sharedFilterObject = createFilterObject('title', textFilter, { title: sharedTextMeta });
const sharedListSearch: ListSearch = validateListSearch({
	page: 2,
	search: 'Launch',
	columns: 'title,status',
	'f.status': 'published',
});
const sharedListFilterValues: Record<string, string> = getFilterValuesFromSearch(sharedListSearch);
const sharedActiveColumns: string[] = getActiveColumnPaths(sharedListSearch.cols, ['title']);
const sharedSerializedColumns: string = serializeColumnPaths(sharedActiveColumns);
const sharedParsedDefaultColumns: string[] = parseDefaultColumnPaths('title,status');
const sharedDefaultColumnPaths: string[] = getDefaultColumnPaths({
	defaultColumns: sharedParsedDefaultColumns,
	fields: adminListMeta.fields,
	resolveField(column) {
		const path = typeof column === 'string' ? column : column.path ?? column.field ?? column.key ?? '';
		return adminListMeta.fields[path];
	},
});
const sharedIsIdColumnPath: boolean = isIdColumnPath('_id');
const sharedDownloadUrl: string = buildListDownloadUrl({
	adminApiBasepath: '/keystone-api',
	columns: sharedActiveColumns.map((path) => ({ path })),
	filters: sharedListFilterValues,
	format: 'csv',
	listPath: 'posts',
	origin: 'https://example.test',
	search: sharedListSearch.search,
	sort: sharedListSearch.sort,
});
const sharedListFilterField: ListRouteFilterField = {
	path: 'status',
	label: 'Status',
	fieldType: 'select',
	hasFilterMethod: true,
	options: [{ value: 'published', label: 'Published' }],
};
const sharedFilterableFields: ListRouteFilterField[] = getFilterFields({ status: sharedListFilterField });
const sharedApiFilter: Record<string, unknown> | undefined = buildApiFilter(sharedListFilterField, 'published');
const sharedApiFilters: Record<string, unknown> = buildApiFilters(sharedFilterableFields, { status: 'published' });
const sharedGeopointFilter: GeopointRouteFilterValue | undefined = parseGeopointFilterValue({
	lat: 40.7484,
	lon: -73.9857,
	distance: { mode: 'max', value: 5 },
});
const sharedFilterDisplay: string = formatFilterDisplay(sharedListFilterField, 'published');
const sharedFormattedCount: string = formatCount(1200);
const sharedPluralCount: string = pluralizeCount(2, 'Post', 'Posts');
const sharedPageWindow: number[] = buildPageWindow(2, 10);
void sharedFormattedCount;
void sharedPluralCount;
void sharedPageWindow;
void sharedAdminApi<ListResponse>('/posts');
void fetchAdminMeta();
void fetchList('Post', { search: 'Launch' });
void fetchItem('Post', 'post-1');
void getSession();
void signin(signinPayload);
void signout();
legacyApiRequest({ url: '/keystone-api/session', responseType: 'json' }, () => {});

void singleton;
void registryFromField;
void utilsLabel;
void utilsPath;
void utilsMethods;
void adminNextRouter;
void adminNextRouterFromSubpath;
void adminLegacyStaticRouterFromSubpath;
void adminLegacyCompatRouterFromSubpath;
void adminStaticRouter;
void adminDynamicRouter;
void adminNamedStaticRouter;
void adminNamedDynamicRouter;
void postList;
void userList;
void legacyDocumentList;
void legacyDocumentModel;
void legacySchemaMethodRegistrationList;
void legacyListSchema;
void legacySchemaMethod;
void optionalLegacySchemaMethods;
void transformedLegacyLabel;
void groupedPostConstraint;
void groupedPostDocumentConstraint;
void groupedPostFields;
void groupedPostFieldsFromAlias;
void groupedPostFieldsFromSingletonFlatten;
void groupedPostFieldsFromSingleton;
void groupedPostHeadline;
void LegacyPost;
void GroupedPostAlias;
void GroupedPostSingleton;
void requestKeystone;
void requestList;
void requestUserId;
void textField;
void sharedTextMeta;
void sharedFieldTypeName;
void sharedFieldComponentSet;
void sharedRegisteredField;
void sharedUnregisteredFields;
void sharedRegistryText;
void modernizedLegacyFieldSet;
void ModernizedLegacyField;
void registeredLegacyFieldSet;
void runtimeCustomFields;
void runtimeCustomFieldRegistration;
void adminListMeta;
void adminMetaResponse;
void listResponse;
void sessionResponse;
void signinResponse;
void sharedColumns;
void sharedSort;
void sharedFilters;
void sharedFilter;
void sharedFilterObject;
void sharedListSearch;
void sharedListFilterValues;
void sharedActiveColumns;
void sharedSerializedColumns;
void sharedParsedDefaultColumns;
void sharedDefaultColumnPaths;
void sharedIsIdColumnPath;
void sharedDownloadUrl;
void sharedListFilterField;
void sharedFilterableFields;
void sharedApiFilter;
void sharedApiFilters;
void sharedGeopointFilter;
void sharedFilterDisplay;
void selectOption;
void selectValue;
void selectStringOptions;
void selectArrayOptions;
void selectObjectOptions;
void booleanOptions;
void dateOptions;
void dateTimeOptions;
void dateArrayOptions;
void htmlOptions;
void textareaOptions;
void urlOptions;
void keyOptions;
void colorOptions;
void moneyOptions;
void emailOptions;
void passwordComplexity;
void passwordOptions;
void locationOptions;
void nameOptions;
void numberArrayOptions;
void geoPointOptions;
void codeOptions;
void markdownOptions;
void storageNameFile;
void cloudinaryOptions;
void cloudinaryImageAliasOptions;
void cloudinaryImagesAliasOptions;
void textFilter;
void selectFilter;
void numberFilter;
void booleanFilter;
void dateFilter;
void dateArrayFilter;
void nameFilter;
void textArrayFilter;
void numberArrayFilter;
void geoPointFilter;
void locationFilter;
void markdownFilter;
void relationshipFilter;
void nameValue;
void cloudinaryImageValue;
void cloudinaryImagesValue;
void postStatus;
void postDocument;
void cloomCoreInitOptions;
