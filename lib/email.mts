import keystone from '../index.mjs';
import isObject from './utils/isObject.mjs';
import safeRequire from './safeRequire.mjs';

interface EmailOptions {
	templateName?: string;
	transport?: string;
	apiKey?: string;
	engine?: string | Function;
	ext?: string;
	root?: string;
	templateExt?: string;
	[key: string]: unknown;
}

const Email = function (options: EmailOptions | string): Promise<unknown> {
	if (typeof options === 'string') {
		options = { templateName: options };
	}
	if (!isObject(options)) {
		throw new Error('The keystone.Email class requires a templateName or options argument to be provided');
	}

	const opts = options;

	const emailTransport = keystone.get('email transport');
	if (!opts.transport && emailTransport) {
		opts.transport = emailTransport as string;
	}
	const mandrillApiKey = keystone.get('mandrill api key');
	if (!opts.transport && mandrillApiKey) {
		opts.transport = 'mandrill';
		opts.apiKey = mandrillApiKey;
	}
	if (!opts.engine) {
		opts.engine = opts.templateExt;
	}
	if (!opts.engine) {
		const customEngine = keystone.get('custom engine');
		const viewEngine = keystone.get('view engine');
		if (typeof customEngine === 'function') {
			opts.engine = customEngine;
			opts.ext = opts.ext || opts.templateExt || viewEngine;
		} else if (viewEngine) {
			opts.engine = viewEngine;
		}
	}
	const rootPath = keystone.get('emails');
	if (rootPath && !opts.root) {
		opts.root = rootPath;
	}

	return safeRequire('keystone-email', 'email').then(function (ns: unknown) {
		type EmailCtor = new (templateName: string | undefined, opts: EmailOptions) => {
			send: (...args: unknown[]) => void;
			[key: string]: unknown;
		};
		const mod = ns as Record<string, unknown>;
		const KeystoneEmail = (mod['default'] ?? mod) as EmailCtor;

		const templateName = opts.templateName;
		delete opts.templateName;
		const email = new KeystoneEmail(templateName, opts);

		const send = email.send;
		email.send = function () {
			const args = [arguments[0]];
			if (typeof arguments[1] === 'function') {
				args.push(arguments[0]);
				args.push(arguments[1]);
			} else {
				args.push(arguments[1]);
				args.push(arguments[2]);
			}
			send.apply(email, args);
		};

		return email;
	});
};

export default Email;
