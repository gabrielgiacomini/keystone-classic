import { expect } from 'chai';
import legacyUtils from 'keystone-utils';
import { optionsMap } from '../../../../lib/utils/optionsMap.mts';

describe('lib/utils/optionsMap', function () {
	it('matches legacy optionsMap behavior for whole-option maps, property maps, and clones', function () {
		const options = [
			{ value: 'draft', label: 'Draft', meta: { order: 1 } },
			{ value: 2, label: 'Published', meta: { order: 2 } },
		];

		expect(optionsMap(options)).to.deep.equal(legacyUtils.optionsMap(options));
		expect(optionsMap(options, 'label')).to.deep.equal(legacyUtils.optionsMap(options, 'label'));
		const cloned = optionsMap(options, true);
		expect(cloned).to.deep.equal(legacyUtils.optionsMap(options, true));
		expect((cloned.draft as { meta: { order: number } }).meta).not.to.equal(options[0]!.meta);
	});
});
