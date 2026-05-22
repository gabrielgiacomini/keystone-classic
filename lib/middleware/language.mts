import type { RequestHandler } from 'express';
import type { Keystone } from '../../index.mjs';
import requestLanguage from 'express-request-language';

export default function language (keystone: Keystone): RequestHandler {
	const defaults = {
		'supported languages': ['en-US'] as string[],
		'language cookie': 'language',
		'language cookie options': {} as Record<string, unknown>,
		'language select url': '/languages/{language}',
	};
	const overrides = (keystone.get('language options') ?? {}) as Record<string, unknown>;
	const languageOptions = { ...defaults, ...overrides };

	return requestLanguage({
		languages: (languageOptions['supported languages'] as string[]),
		cookie: {
			name: (languageOptions['language cookie'] as string),
			url: (languageOptions['language select url'] as string),
			options: (languageOptions['language cookie options'] as Record<string, unknown>),
		},
		queryName: (overrides['language query name'] as string | undefined),
	}) as RequestHandler;
}
