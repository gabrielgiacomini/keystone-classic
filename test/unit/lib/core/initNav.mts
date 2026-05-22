import { expect } from 'chai';
import initNav from 'keystone/lib/core/initNav';
import type { Keystone } from 'keystone';

interface ListStub {
	key: string;
	label: string;
	path: string;
	get(key: string): unknown;
}

interface NavHarness {
	lists: Record<string, ListStub>;
	paths: Record<string, string>;
}

function createList(key: string, label: string, path: string, hidden = false): ListStub {
	return {
		key,
		label,
		path,
		get(name: string) {
			return name === 'hidden' ? hidden : undefined;
		},
	};
}

describe('initNav', function () {
	it('derives legacy section labels and external item labels/paths', function () {
		const harness: NavHarness = {
			lists: {
				Post: createList('Post', 'Posts', 'posts'),
			},
			paths: {
				posts: 'Post',
			},
		};

		const nav = initNav.call(harness as unknown as Keystone, {
			contentArea: ['Post', { key: 'externalFeed' }],
		});

		expect(nav.sections).to.have.length(1);
		expect(nav.sections[0]).to.include({ key: 'contentArea', label: 'Content Area' });
		expect(nav.sections[0]?.lists[0]).to.include({ key: 'Post', label: 'Posts', path: 'posts' });
		expect(nav.sections[0]?.lists[1]).to.include({
			key: 'externalFeed',
			label: 'External Feed',
			path: 'external-feed',
			external: true,
		});
	});

	it('uses the first visible list label for flat nav sections', function () {
		const harness: NavHarness = {
			lists: {
				Post: createList('Post', 'Published Posts', 'posts'),
			},
			paths: {
				posts: 'Post',
			},
		};

		const nav = initNav.call(harness as unknown as Keystone);

		expect(nav.flat).to.equal(true);
		expect(nav.sections).to.have.length(1);
		expect(nav.sections[0]).to.include({ key: 'posts', label: 'Published Posts' });
		expect(nav.sections[0]?.lists[0]).to.include({ key: 'Post', label: 'Published Posts', path: 'posts' });
	});

	it('preserves flat Cloom-style nav section and list insertion order', function () {
		const harness: NavHarness = {
			lists: {
				LandingRelease: createList('LandingRelease', 'Landing Releases', 'landing-releases'),
				LandingReleaseWorkingDraft: createList('LandingReleaseWorkingDraft', 'Landing Release Working Drafts', 'landing-release-working-drafts'),
				Administrator: createList('Administrator', 'Administrators', 'administrators'),
				Event: createList('Event', 'Events', 'events'),
				Log: createList('Log', 'Logs', 'logs'),
			},
			paths: {
				'landing-releases': 'LandingRelease',
				'landing-release-working-drafts': 'LandingReleaseWorkingDraft',
				administrators: 'Administrator',
				events: 'Event',
				logs: 'Log',
			},
		};

		const nav = initNav.call(harness as unknown as Keystone, {
			Landing: ['landing-releases', 'landing-release-working-drafts'],
			'Keystone Meta': ['administrators', 'events', 'logs'],
		});

		expect(nav.sections.map(section => section.key)).to.deep.equal(['Landing', 'Keystone Meta']);
		expect(nav.sections[0]?.lists.map(list => list.path)).to.deep.equal([
			'landing-releases',
			'landing-release-working-drafts',
		]);
		expect(nav.sections[1]?.lists.map(list => list.path)).to.deep.equal([
			'administrators',
			'events',
			'logs',
		]);
		expect(nav.by.list['Administrator']).to.equal(nav.sections[1]);
		expect(nav.by.section['Landing']).to.equal(nav.sections[0]);
	});
});
