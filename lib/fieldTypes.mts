import BooleanType from '../fields/types/boolean/BooleanType.mjs';
import CloudinaryType from '../fields/types/cloudinary/CloudinaryType.mjs';
import CloudinaryImageType from '../fields/types/cloudinaryimage/CloudinaryImageType.mjs';
import CloudinaryImagesType from '../fields/types/cloudinaryimages/CloudinaryImagesType.mjs';
import CodeType from '../fields/types/code/CodeType.mjs';
import ColorType from '../fields/types/color/ColorType.mjs';
import DateType from '../fields/types/date/DateType.mjs';
import DateArrayType from '../fields/types/datearray/DateArrayType.mjs';
import DatetimeType from '../fields/types/datetime/DatetimeType.mjs';
import EmailType from '../fields/types/email/EmailType.mjs';
import FileType from '../fields/types/file/FileType.mjs';
import GeoPointType from '../fields/types/geopoint/GeoPointType.mjs';
import HtmlType from '../fields/types/html/HtmlType.mjs';
import KeyType from '../fields/types/key/KeyType.mjs';
import LocalFileType from '../fields/types/localfile/LocalFileType.mjs';
import LocalFilesType from '../fields/types/localfiles/LocalFilesType.mjs';
import LocationType from '../fields/types/location/LocationType.mjs';
import MarkdownType from '../fields/types/markdown/MarkdownType.mjs';
import MoneyType from '../fields/types/money/MoneyType.mjs';
import NameType from '../fields/types/name/NameType.mjs';
import NumberType from '../fields/types/number/NumberType.mjs';
import NumberArrayType from '../fields/types/numberarray/NumberArrayType.mjs';
import PasswordType from '../fields/types/password/PasswordType.mjs';
import RelationshipType from '../fields/types/relationship/RelationshipType.mjs';
import SelectType from '../fields/types/select/SelectType.mjs';
import TextType from '../fields/types/text/TextType.mjs';
import TextArrayType from '../fields/types/textarray/TextArrayType.mjs';
import TextareaType from '../fields/types/textarea/TextareaType.mjs';
import UrlType from '../fields/types/url/UrlType.mjs';

/** Maps field type names to their constructor classes. */
export interface FieldTypesMap {
	Boolean: typeof BooleanType;
	Cloudinary: typeof CloudinaryType;
	CloudinaryImage: typeof CloudinaryImageType;
	CloudinaryImages: typeof CloudinaryImagesType;
	Code: typeof CodeType;
	Color: typeof ColorType;
	Date: typeof DateType;
	DateArray: typeof DateArrayType;
	Datetime: typeof DatetimeType;
	Email: typeof EmailType;
	File: typeof FileType;
	GeoPoint: typeof GeoPointType;
	Html: typeof HtmlType;
	Key: typeof KeyType;
	LocalFile: typeof LocalFileType;
	LocalFiles: typeof LocalFilesType;
	Location: typeof LocationType;
	Markdown: typeof MarkdownType;
	Money: typeof MoneyType;
	Name: typeof NameType;
	Number: typeof NumberType;
	NumberArray: typeof NumberArrayType;
	Password: typeof PasswordType;
	Relationship: typeof RelationshipType;
	Select: typeof SelectType;
	Text: typeof TextType;
	TextArray: typeof TextArrayType;
	Textarea: typeof TextareaType;
	Url: typeof UrlType;
}

const fields: FieldTypesMap = {
	Boolean: BooleanType,
	Cloudinary: CloudinaryType,
	CloudinaryImage: CloudinaryImageType,
	CloudinaryImages: CloudinaryImagesType,
	Code: CodeType,
	Color: ColorType,
	Date: DateType,
	DateArray: DateArrayType,
	Datetime: DatetimeType,
	Email: EmailType,
	File: FileType,
	GeoPoint: GeoPointType,
	Html: HtmlType,
	Key: KeyType,
	LocalFile: LocalFileType,
	LocalFiles: LocalFilesType,
	Location: LocationType,
	Markdown: MarkdownType,
	Money: MoneyType,
	Name: NameType,
	Number: NumberType,
	NumberArray: NumberArrayType,
	Password: PasswordType,
	Relationship: RelationshipType,
	Select: SelectType,
	Text: TextType,
	TextArray: TextArrayType,
	Textarea: TextareaType,
	Url: UrlType,
};

export default fields;
