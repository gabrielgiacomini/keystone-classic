/**
 * Backward-compatible entry point for the Password-field redaction helpers.
 *
 * The implementation lives in `./secretFieldRedaction.mjs`, which treats
 * Password-type fields and fields declared with `secret: true` alike. The
 * names below are kept so existing imports continue to work; the two
 * `*WithoutPasswordFields` helpers remove every secret field, not only
 * Password-type ones.
 */
export {
	getPasswordFieldPaths,
	isHydratedDocument,
	isPasswordField,
	isSensitivePath,
	toJSONWithoutSecretFields as toJSONWithoutPasswordFields,
	withoutSecretFields as withoutPasswordFields,
} from './secretFieldRedaction.mjs';
export type { SecretAwareList as PasswordAwareList } from './secretFieldRedaction.mjs';
