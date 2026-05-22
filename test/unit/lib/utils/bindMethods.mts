import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import bindMethods from '../../../../lib/utils/bindMethods.mts';

interface BoundTree {
	[key: string]: BoundTree | ((...args: unknown[]) => unknown) | undefined;
}

function call(tree: BoundTree, path: string): unknown {
	const parts = path.split('.');
	let cursor: BoundTree | ((...args: unknown[]) => unknown) | undefined = tree;
	for (const part of parts) {
		if (typeof cursor === 'function') {
			throw new Error('Cannot traverse through bound method ' + part);
		}
		cursor = cursor?.[part];
	}
	if (typeof cursor !== 'function') {
		throw new Error('Expected bound method at ' + path);
	}
	return cursor();
}

describe('lib/utils/bindMethods', function () {
	it('matches legacy recursive method binding behavior', function () {
		const scope = { value: 'bound value' };
		const inherited = Object.create({
			inherited(this: typeof scope) {
				return this.value;
			},
		}) as Record<string, unknown>;
		inherited['top'] = function (this: typeof scope) {
			return this.value;
		};
		inherited['nested'] = {
			child(this: typeof scope) {
				return this.value;
			},
			ignored: 'not a method',
		};
		inherited['ignored'] = 'not a method';
		inherited['ignoredDate'] = new Date();

		const local = bindMethods(inherited, scope) as BoundTree;
		const legacy = legacyUtils.bindMethods(inherited, scope) as BoundTree;

		expect(Object.keys(local)).to.deep.equal(Object.keys(legacy));
		expect(Object.keys(local['nested'] as BoundTree)).to.deep.equal(Object.keys(legacy['nested'] as BoundTree));
		expect(call(local, 'top')).to.equal(call(legacy, 'top'));
		expect(call(local, 'nested.child')).to.equal(call(legacy, 'nested.child'));
		expect(call(local, 'inherited')).to.equal(call(legacy, 'inherited'));
		expect(local['ignored']).to.equal(undefined);
		expect(local['ignoredDate']).to.equal(undefined);
	});
});
