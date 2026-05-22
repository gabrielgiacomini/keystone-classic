import type { Keystone } from '../index.mjs';
import type { Application } from 'express';

/**
 * Configures the Express view engine for Keystone (Jade/Pug templates).
 * @param keystone - The keystone instance.
 * @param app - The Express application.
 */
export default function initViewEngine(keystone: Keystone, app: Application): void {
	if (keystone.get('custom engine')) {
		const viewEngine = keystone.get('view engine');
		if (!viewEngine) throw new Error('initViewEngine: keystone "view engine" config is required when "custom engine" is set');
		// Express's app.engine expects (path: string, options: object, callback).
		// `custom engine` is stored as unknown; cast via intermediate to the exact type Express expects.
		/** Express engine function signature for custom template engines. */
type EngineFunction = (path: string, options: object, callback: (err: Error | null, str?: string) => void) => void;
		app.engine(viewEngine, keystone.get('custom engine') as unknown as EngineFunction);
	}

	app.set('views', keystone.getPath('views') || 'views');
	app.set('view engine', keystone.get('view engine'));

	const customView = keystone.get('view');
	if (customView) {
		app.set('view', customView);
	}
}
