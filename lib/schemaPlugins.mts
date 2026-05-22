import sortable from './schemaPlugins/sortable.mjs';
import autokey from './schemaPlugins/autokey.mjs';
import track from './schemaPlugins/track.mjs';
import history from './schemaPlugins/history.mjs';
import getRelated from './schemaPlugins/methods/getRelated.mjs';
import populateRelated from './schemaPlugins/methods/populateRelated.mjs';
import transform from './schemaPlugins/options/transform.mjs';

export { sortable };
export { autokey };
export { track };
export { history };

export const methods = {
	getRelated,
	populateRelated,
};

export const options = {
	transform,
};

export default { sortable, autokey, track, history, methods: { getRelated, populateRelated }, options: { transform } };
