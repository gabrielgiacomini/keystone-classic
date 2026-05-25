import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && 'code' in error;
}

async function copyIfPresent(from: string, to: string): Promise<void> {
	try {
		await cp(path.join(root, from), path.join(dist, to), {
			recursive: true,
			force: true,
			errorOnExist: false,
		});
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return;
		}
		throw error;
	}
}

async function copyRootTypes(): Promise<void> {
	const outDir = path.join(dist, 'types');
	await mkdir(outDir, { recursive: true });
	let entries;
	try {
		entries = await readdir(path.join(root, 'types'));
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return;
		}
		throw error;
	}
	await Promise.all(
		entries
			.filter((entry) => entry.endsWith('.d.ts'))
			.map((entry) => copyIfPresent(path.join('types', entry), path.join('types', entry))),
	);
}

async function addExtensionlessMjsSiblings(dir: string): Promise<void> {
	let entries;
	try {
		entries = await readdir(dir, { withFileTypes: true });
	} catch (error) {
		if (isNodeError(error) && error.code === 'ENOENT') {
			return;
		}
		throw error;
	}
	await Promise.all(entries.map(async (entry) => {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			await addExtensionlessMjsSiblings(fullPath);
		} else if (entry.isFile() && entry.name.endsWith('.mjs')) {
			await cp(fullPath, fullPath.slice(0, -'.mjs'.length), { force: true });
		}
	}));
}

await rm(path.join(dist, 'admin', 'public-next'), { recursive: true, force: true });
await rm(path.join(dist, 'admin', 'public-legacy'), { recursive: true, force: true });
await rm(path.join(dist, 'admin', 'client-legacy'), { recursive: true, force: true });
await rm(path.join(dist, 'admin', 'server', 'templates-legacy'), { recursive: true, force: true });
await rm(path.join(dist, 'fields', 'types', 'markdown', 'less'), { recursive: true, force: true });

await Promise.all([
	copyRootTypes(),
	copyIfPresent('index.cjs', 'index.cjs'),
	copyIfPresent('admin/server/index.cjs', 'admin/server/index.cjs'),
	copyIfPresent('package.json', 'package.json'),
	copyIfPresent('admin/public-next', 'admin/public-next'),
	copyIfPresent('admin/public-legacy', 'admin/public-legacy'),
	copyIfPresent('admin/client-legacy/App', 'admin/client-legacy/App'),
	copyIfPresent('admin/client-legacy/Signin', 'admin/client-legacy/Signin'),
	copyIfPresent('admin/client-legacy/compat', 'admin/client-legacy/compat'),
	copyIfPresent('admin/client-legacy/utils', 'admin/client-legacy/utils'),
	copyIfPresent('admin/client-legacy/router.mjs', 'admin/client-legacy/router.mjs'),
	copyIfPresent('admin/client-legacy/routerRedux.mjs', 'admin/client-legacy/routerRedux.mjs'),
	copyIfPresent('admin/client-legacy/theme.mjs', 'admin/client-legacy/theme.mjs'),
	copyIfPresent('admin/client-legacy/constants.mjs', 'admin/client-legacy/constants.mjs'),
	copyIfPresent('admin/server/templates-legacy', 'admin/server/templates-legacy'),
	copyIfPresent('fields/types/markdown/less', 'fields/types/markdown/less'),
]);

await copyIfPresent('lib/utils/inflect.mjs', 'lib/utils/inflect.mjs');
await copyIfPresent('lib/utils/numberFormat.mjs', 'lib/utils/numberFormat.mjs');
await addExtensionlessMjsSiblings(path.join(dist, 'fields', 'components'));

// When a .d.mts sidecar exists for a .mjs file, tsc skips emitting the .mjs.
// Copy these explicitly so legacy browser bundle generation can resolve them.
await copyIfPresent('fields/types/Field.mjs', 'fields/types/Field.mjs');
await copyIfPresent('fields/types/boolean/BooleanField.mjs', 'fields/types/boolean/BooleanField.mjs');
await copyIfPresent('fields/types/text/TextField.mjs', 'fields/types/text/TextField.mjs');
await copyIfPresent('fields/types/key/KeyField.mjs', 'fields/types/key/KeyField.mjs');
await copyIfPresent('fields/types/email/EmailField.mjs', 'fields/types/email/EmailField.mjs');
await copyIfPresent('fields/types/url/UrlField.mjs', 'fields/types/url/UrlField.mjs');
await copyIfPresent('fields/types/textarea/TextareaField.mjs', 'fields/types/textarea/TextareaField.mjs');
await copyIfPresent('fields/types/markdown/MarkdownField.mjs', 'fields/types/markdown/MarkdownField.mjs');
await copyIfPresent('fields/types/code/CodeField.mjs', 'fields/types/code/CodeField.mjs');
await copyIfPresent('fields/types/select/SelectField.mjs', 'fields/types/select/SelectField.mjs');
await copyIfPresent('fields/types/number/NumberField.mjs', 'fields/types/number/NumberField.mjs');
await copyIfPresent('fields/types/money/MoneyField.mjs', 'fields/types/money/MoneyField.mjs');
await copyIfPresent('fields/types/name/NameField.mjs', 'fields/types/name/NameField.mjs');
await copyIfPresent('fields/types/geopoint/GeoPointField.mjs', 'fields/types/geopoint/GeoPointField.mjs');
await copyIfPresent('fields/types/date/DateField.mjs', 'fields/types/date/DateField.mjs');
await copyIfPresent('fields/types/key/KeyColumn.mjs', 'fields/types/key/KeyColumn.mjs');
await copyIfPresent('fields/types/money/MoneyColumn.mjs', 'fields/types/money/MoneyColumn.mjs');
await copyIfPresent('fields/types/code/CodeColumn.mjs', 'fields/types/code/CodeColumn.mjs');
await copyIfPresent('fields/types/html/HtmlColumn.mjs', 'fields/types/html/HtmlColumn.mjs');
await copyIfPresent('fields/types/textarea/TextareaColumn.mjs', 'fields/types/textarea/TextareaColumn.mjs');
await copyIfPresent('fields/types/datetime/DatetimeColumn.mjs', 'fields/types/datetime/DatetimeColumn.mjs');
await copyIfPresent('fields/types/datearray/DateArrayColumn.mjs', 'fields/types/datearray/DateArrayColumn.mjs');
await copyIfPresent('fields/types/numberarray/NumberArrayColumn.mjs', 'fields/types/numberarray/NumberArrayColumn.mjs');
await copyIfPresent('fields/types/textarray/TextArrayColumn.mjs', 'fields/types/textarray/TextArrayColumn.mjs');
await copyIfPresent('fields/types/email/EmailColumn.mjs', 'fields/types/email/EmailColumn.mjs');
await copyIfPresent('fields/types/text/TextColumn.mjs', 'fields/types/text/TextColumn.mjs');
await copyIfPresent('fields/types/boolean/BooleanColumn.mjs', 'fields/types/boolean/BooleanColumn.mjs');
await copyIfPresent('fields/types/url/UrlColumn.mjs', 'fields/types/url/UrlColumn.mjs');
await copyIfPresent('fields/types/select/SelectColumn.mjs', 'fields/types/select/SelectColumn.mjs');
await copyIfPresent('fields/types/markdown/MarkdownColumn.mjs', 'fields/types/markdown/MarkdownColumn.mjs');
await copyIfPresent('fields/types/password/PasswordColumn.mjs', 'fields/types/password/PasswordColumn.mjs');
await copyIfPresent('fields/types/number/NumberColumn.mjs', 'fields/types/number/NumberColumn.mjs');
await copyIfPresent('fields/types/name/NameColumn.mjs', 'fields/types/name/NameColumn.mjs');
await copyIfPresent('fields/types/geopoint/GeoPointColumn.mjs', 'fields/types/geopoint/GeoPointColumn.mjs');
await copyIfPresent('fields/types/date/DateColumn.mjs', 'fields/types/date/DateColumn.mjs');
await copyIfPresent('fields/types/code/CodeFilter.mjs', 'fields/types/code/CodeFilter.mjs');
await copyIfPresent('fields/types/datetime/DatetimeFilter.mjs', 'fields/types/datetime/DatetimeFilter.mjs');
await copyIfPresent('fields/types/email/EmailFilter.mjs', 'fields/types/email/EmailFilter.mjs');
await copyIfPresent('fields/types/file/FileColumn.mjs', 'fields/types/file/FileColumn.mjs');
await copyIfPresent('fields/types/file/FileFilter.mjs', 'fields/types/file/FileFilter.mjs');
await copyIfPresent('fields/types/html/HtmlFilter.mjs', 'fields/types/html/HtmlFilter.mjs');
await copyIfPresent('fields/types/key/KeyFilter.mjs', 'fields/types/key/KeyFilter.mjs');
await copyIfPresent('fields/types/markdown/MarkdownFilter.mjs', 'fields/types/markdown/MarkdownFilter.mjs');
await copyIfPresent('fields/types/money/MoneyFilter.mjs', 'fields/types/money/MoneyFilter.mjs');
await copyIfPresent('fields/types/name/NameFilter.mjs', 'fields/types/name/NameFilter.mjs');
await copyIfPresent('fields/types/text/TextFilter.mjs', 'fields/types/text/TextFilter.mjs');
await copyIfPresent('fields/types/textarea/TextareaFilter.mjs', 'fields/types/textarea/TextareaFilter.mjs');
await copyIfPresent('fields/types/url/UrlFilter.mjs', 'fields/types/url/UrlFilter.mjs');
await copyIfPresent('fields/types/cloudinary/CloudinaryColumn.mjs', 'fields/types/cloudinary/CloudinaryColumn.mjs');
await copyIfPresent('fields/types/cloudinary/CloudinaryField.mjs', 'fields/types/cloudinary/CloudinaryField.mjs');
await copyIfPresent('fields/types/cloudinary/CloudinaryFilter.mjs', 'fields/types/cloudinary/CloudinaryFilter.mjs');
await copyIfPresent('fields/types/cloudinaryimages/CloudinaryImagesFilter.mjs', 'fields/types/cloudinaryimages/CloudinaryImagesFilter.mjs');
await copyIfPresent('fields/types/select/SelectFilter.mjs', 'fields/types/select/SelectFilter.mjs');
await copyIfPresent('fields/types/boolean/BooleanFilter.mjs', 'fields/types/boolean/BooleanFilter.mjs');
await copyIfPresent('fields/types/number/NumberFilter.mjs', 'fields/types/number/NumberFilter.mjs');
await copyIfPresent('fields/types/textarray/TextArrayFilter.mjs', 'fields/types/textarray/TextArrayFilter.mjs');
await copyIfPresent('fields/types/datearray/DateArrayFilter.mjs', 'fields/types/datearray/DateArrayFilter.mjs');
await copyIfPresent('fields/types/numberarray/NumberArrayFilter.mjs', 'fields/types/numberarray/NumberArrayFilter.mjs');
await copyIfPresent('fields/types/geopoint/GeoPointFilter.mjs', 'fields/types/geopoint/GeoPointFilter.mjs');
await copyIfPresent('fields/types/date/DateFilter.mjs', 'fields/types/date/DateFilter.mjs');
await copyIfPresent('fields/types/location/LocationColumn.mjs', 'fields/types/location/LocationColumn.mjs');
await copyIfPresent('fields/types/location/LocationFilter.mjs', 'fields/types/location/LocationFilter.mjs');
await copyIfPresent('fields/types/relationship/RelationshipColumn.mjs', 'fields/types/relationship/RelationshipColumn.mjs');
await copyIfPresent('fields/types/relationship/RelationshipFilter.mjs', 'fields/types/relationship/RelationshipFilter.mjs');
await copyIfPresent('fields/types/relationship/RelationshipField.mjs', 'fields/types/relationship/RelationshipField.mjs');
await copyIfPresent('fields/types/color/ColorColumn.mjs', 'fields/types/color/ColorColumn.mjs');
await copyIfPresent('fields/types/color/ColorFilter.mjs', 'fields/types/color/ColorFilter.mjs');
await copyIfPresent('fields/types/color/ColorField.mjs', 'fields/types/color/ColorField.mjs');
await copyIfPresent('fields/types/datetime/DatetimeField.mjs', 'fields/types/datetime/DatetimeField.mjs');
await copyIfPresent('fields/types/password/PasswordFilter.mjs', 'fields/types/password/PasswordFilter.mjs');
await copyIfPresent('fields/types/password/PasswordField.mjs', 'fields/types/password/PasswordField.mjs');
await copyIfPresent('fields/types/html/HtmlField.mjs', 'fields/types/html/HtmlField.mjs');
await copyIfPresent('fields/types/file/FileField.mjs', 'fields/types/file/FileField.mjs');
await copyIfPresent('fields/types/location/LocationField.mjs', 'fields/types/location/LocationField.mjs');
await copyIfPresent('fields/types/cloudinaryimage/CloudinaryImageColumn.mjs', 'fields/types/cloudinaryimage/CloudinaryImageColumn.mjs');
await copyIfPresent('fields/types/cloudinaryimage/CloudinaryImageFilter.mjs', 'fields/types/cloudinaryimage/CloudinaryImageFilter.mjs');
await copyIfPresent('fields/types/cloudinaryimage/CloudinaryImageField.mjs', 'fields/types/cloudinaryimage/CloudinaryImageField.mjs');
await copyIfPresent('fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs', 'fields/types/cloudinaryimages/CloudinaryImagesColumn.mjs');
await copyIfPresent('fields/types/cloudinaryimages/CloudinaryImagesField.mjs', 'fields/types/cloudinaryimages/CloudinaryImagesField.mjs');
await copyIfPresent('fields/types/textarray/TextArrayField.mjs', 'fields/types/textarray/TextArrayField.mjs');
await copyIfPresent('fields/types/numberarray/NumberArrayField.mjs', 'fields/types/numberarray/NumberArrayField.mjs');
await copyIfPresent('fields/types/datearray/DateArrayField.mjs', 'fields/types/datearray/DateArrayField.mjs');
await copyIfPresent('fields/utils/classnames.mjs', 'fields/utils/classnames.mjs');
await copyIfPresent('fields/components/Checkbox.mjs', 'fields/components/Checkbox.mjs');
await copyIfPresent('fields/components/CollapsedFieldLabel.mjs', 'fields/components/CollapsedFieldLabel.mjs');
await copyIfPresent('fields/components/DateInput.mjs', 'fields/components/DateInput.mjs');
await copyIfPresent('fields/components/FileChangeMessage.mjs', 'fields/components/FileChangeMessage.mjs');
await copyIfPresent('fields/components/HiddenFileInput.mjs', 'fields/components/HiddenFileInput.mjs');
await copyIfPresent('fields/components/ImageThumbnail.mjs', 'fields/components/ImageThumbnail.mjs');
await copyIfPresent('fields/components/ItemsTableCell.mjs', 'fields/components/ItemsTableCell.mjs');
await copyIfPresent('fields/components/ItemsTableValue.mjs', 'fields/components/ItemsTableValue.mjs');
await copyIfPresent('fields/components/NestedFormField.mjs', 'fields/components/NestedFormField.mjs');
await copyIfPresent('fields/components/columns/ArrayColumn.mjs', 'fields/components/columns/ArrayColumn.mjs');
await copyIfPresent('fields/components/columns/CloudinaryImageSummary.mjs', 'fields/components/columns/CloudinaryImageSummary.mjs');
await copyIfPresent('fields/components/columns/IdColumn.mjs', 'fields/components/columns/IdColumn.mjs');
await copyIfPresent('fields/components/columns/InvalidColumn.mjs', 'fields/components/columns/InvalidColumn.mjs');
