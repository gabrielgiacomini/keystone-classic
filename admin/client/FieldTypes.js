import AzureFileColumn from '../../fields/types/azurefile/AzureFileColumn';
import AzureFileField from '../../fields/types/azurefile/AzureFileField';
import AzureFileFilter from '../../fields/types/azurefile/AzureFileFilter';
import BooleanColumn from '../../fields/types/boolean/BooleanColumn';
import BooleanField from '../../fields/types/boolean/BooleanField';
import BooleanFilter from '../../fields/types/boolean/BooleanFilter';
import CloudinaryImageColumn from '../../fields/types/cloudinaryimage/CloudinaryImageColumn';
import CloudinaryImageField from '../../fields/types/cloudinaryimage/CloudinaryImageField';
import CloudinaryImageFilter from '../../fields/types/cloudinaryimage/CloudinaryImageFilter';
import CloudinaryImagesColumn from '../../fields/types/cloudinaryimages/CloudinaryImagesColumn';
import CloudinaryImagesField from '../../fields/types/cloudinaryimages/CloudinaryImagesField';
import CloudinaryImagesFilter from '../../fields/types/cloudinaryimages/CloudinaryImagesFilter';
import CodeColumn from '../../fields/types/code/CodeColumn';
import CodeField from '../../fields/types/code/CodeField';
import CodeFilter from '../../fields/types/code/CodeFilter';
import ColorColumn from '../../fields/types/color/ColorColumn';
import ColorField from '../../fields/types/color/ColorField';
import ColorFilter from '../../fields/types/color/ColorFilter';
import DateColumn from '../../fields/types/date/DateColumn';
import DateField from '../../fields/types/date/DateField';
import DateFilter from '../../fields/types/date/DateFilter';
import DateArrayColumn from '../../fields/types/datearray/DateArrayColumn';
import DateArrayField from '../../fields/types/datearray/DateArrayField';
import DateArrayFilter from '../../fields/types/datearray/DateArrayFilter';
import DatetimeColumn from '../../fields/types/datetime/DatetimeColumn';
import DatetimeField from '../../fields/types/datetime/DatetimeField';
import DatetimeFilter from '../../fields/types/datetime/DatetimeFilter';
import EmailColumn from '../../fields/types/email/EmailColumn';
import EmailField from '../../fields/types/email/EmailField';
import EmailFilter from '../../fields/types/email/EmailFilter';
import EmbedlyColumn from '../../fields/types/embedly/EmbedlyColumn';
import EmbedlyField from '../../fields/types/embedly/EmbedlyField';
import EmbedlyFilter from '../../fields/types/embedly/EmbedlyFilter';
import FileColumn from '../../fields/types/file/FileColumn';
import FileField from '../../fields/types/file/FileField';
import FileFilter from '../../fields/types/file/FileFilter';
import GeoPointColumn from '../../fields/types/geopoint/GeoPointColumn';
import GeoPointField from '../../fields/types/geopoint/GeoPointField';
import GeoPointFilter from '../../fields/types/geopoint/GeoPointFilter';
import HtmlColumn from '../../fields/types/html/HtmlColumn';
import HtmlField from '../../fields/types/html/HtmlField';
import HtmlFilter from '../../fields/types/html/HtmlFilter';
import KeyColumn from '../../fields/types/key/KeyColumn';
import KeyField from '../../fields/types/key/KeyField';
import KeyFilter from '../../fields/types/key/KeyFilter';
import LocalFileColumn from '../../fields/types/localfile/LocalFileColumn';
import LocalFileField from '../../fields/types/localfile/LocalFileField';
import LocalFileFilter from '../../fields/types/localfile/LocalFileFilter';
import LocalFilesColumn from '../../fields/types/localfiles/LocalFilesColumn';
import LocalFilesField from '../../fields/types/localfiles/LocalFilesField';
import LocalFilesFilter from '../../fields/types/localfiles/LocalFilesFilter';
import LocationColumn from '../../fields/types/location/LocationColumn';
import LocationField from '../../fields/types/location/LocationField';
import LocationFilter from '../../fields/types/location/LocationFilter';
import MarkdownColumn from '../../fields/types/markdown/MarkdownColumn';
import MarkdownField from '../../fields/types/markdown/MarkdownField';
import MarkdownFilter from '../../fields/types/markdown/MarkdownFilter';
import MoneyColumn from '../../fields/types/money/MoneyColumn';
import MoneyField from '../../fields/types/money/MoneyField';
import MoneyFilter from '../../fields/types/money/MoneyFilter';
import NameColumn from '../../fields/types/name/NameColumn';
import NameField from '../../fields/types/name/NameField';
import NameFilter from '../../fields/types/name/NameFilter';
import NumberColumn from '../../fields/types/number/NumberColumn';
import NumberField from '../../fields/types/number/NumberField';
import NumberFilter from '../../fields/types/number/NumberFilter';
import NumberArrayColumn from '../../fields/types/numberarray/NumberArrayColumn';
import NumberArrayField from '../../fields/types/numberarray/NumberArrayField';
import NumberArrayFilter from '../../fields/types/numberarray/NumberArrayFilter';
import PasswordColumn from '../../fields/types/password/PasswordColumn';
import PasswordField from '../../fields/types/password/PasswordField';
import PasswordFilter from '../../fields/types/password/PasswordFilter';
import RelationshipColumn from '../../fields/types/relationship/RelationshipColumn';
import RelationshipField from '../../fields/types/relationship/RelationshipField';
import RelationshipFilter from '../../fields/types/relationship/RelationshipFilter';
import S3FileColumn from '../../fields/types/s3file/S3FileColumn';
import S3FileField from '../../fields/types/s3file/S3FileField';
import S3FileFilter from '../../fields/types/s3file/S3FileFilter';
import SelectColumn from '../../fields/types/select/SelectColumn';
import SelectField from '../../fields/types/select/SelectField';
import SelectFilter from '../../fields/types/select/SelectFilter';
import TextColumn from '../../fields/types/text/TextColumn';
import TextField from '../../fields/types/text/TextField';
import TextFilter from '../../fields/types/text/TextFilter';
import TextareaColumn from '../../fields/types/textarea/TextareaColumn';
import TextareaField from '../../fields/types/textarea/TextareaField';
import TextareaFilter from '../../fields/types/textarea/TextareaFilter';
import TextArrayColumn from '../../fields/types/textarray/TextArrayColumn';
import TextArrayField from '../../fields/types/textarray/TextArrayField';
import TextArrayFilter from '../../fields/types/textarray/TextArrayFilter';
import UrlColumn from '../../fields/types/url/UrlColumn';
import UrlField from '../../fields/types/url/UrlField';
import UrlFilter from '../../fields/types/url/UrlFilter';

import IdColumn from '../../fields/components/columns/IdColumn';
import InvalidColumn from '../../fields/components/columns/InvalidColumn';

export const Columns = {
	azurefile: AzureFileColumn,
	boolean: BooleanColumn,
	cloudinaryimage: CloudinaryImageColumn,
	cloudinaryimages: CloudinaryImagesColumn,
	code: CodeColumn,
	color: ColorColumn,
	date: DateColumn,
	datearray: DateArrayColumn,
	datetime: DatetimeColumn,
	email: EmailColumn,
	embedly: EmbedlyColumn,
	file: FileColumn,
	geopoint: GeoPointColumn,
	html: HtmlColumn,
	key: KeyColumn,
	localfile: LocalFileColumn,
	localfiles: LocalFilesColumn,
	location: LocationColumn,
	markdown: MarkdownColumn,
	money: MoneyColumn,
	name: NameColumn,
	number: NumberColumn,
	numberarray: NumberArrayColumn,
	password: PasswordColumn,
	relationship: RelationshipColumn,
	s3file: S3FileColumn,
	select: SelectColumn,
	text: TextColumn,
	textarea: TextareaColumn,
	textarray: TextArrayColumn,
	url: UrlColumn,
	id: IdColumn,
	__unrecognised__: InvalidColumn,
};

export const Fields = {
	azurefile: AzureFileField,
	boolean: BooleanField,
	cloudinaryimage: CloudinaryImageField,
	cloudinaryimages: CloudinaryImagesField,
	code: CodeField,
	color: ColorField,
	date: DateField,
	datearray: DateArrayField,
	datetime: DatetimeField,
	email: EmailField,
	embedly: EmbedlyField,
	file: FileField,
	geopoint: GeoPointField,
	html: HtmlField,
	key: KeyField,
	localfile: LocalFileField,
	localfiles: LocalFilesField,
	location: LocationField,
	markdown: MarkdownField,
	money: MoneyField,
	name: NameField,
	number: NumberField,
	numberarray: NumberArrayField,
	password: PasswordField,
	relationship: RelationshipField,
	s3file: S3FileField,
	select: SelectField,
	text: TextField,
	textarea: TextareaField,
	textarray: TextArrayField,
	url: UrlField,
};

export const Filters = {
	azurefile: AzureFileFilter,
	boolean: BooleanFilter,
	cloudinaryimage: CloudinaryImageFilter,
	cloudinaryimages: CloudinaryImagesFilter,
	code: CodeFilter,
	color: ColorFilter,
	date: DateFilter,
	datearray: DateArrayFilter,
	datetime: DatetimeFilter,
	email: EmailFilter,
	embedly: EmbedlyFilter,
	file: FileFilter,
	geopoint: GeoPointFilter,
	html: HtmlFilter,
	key: KeyFilter,
	localfile: LocalFileFilter,
	localfiles: LocalFilesFilter,
	location: LocationFilter,
	markdown: MarkdownFilter,
	money: MoneyFilter,
	name: NameFilter,
	number: NumberFilter,
	numberarray: NumberArrayFilter,
	password: PasswordFilter,
	relationship: RelationshipFilter,
	s3file: S3FileFilter,
	select: SelectFilter,
	text: TextFilter,
	textarea: TextareaFilter,
	textarray: TextArrayFilter,
	url: UrlFilter,
};

export default { Columns, Fields, Filters };
