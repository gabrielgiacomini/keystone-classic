export default function addPresenceToQuery (presence: string, currentPathQuery: Record<string, unknown>): Record<string, unknown> {
	let newQuery: Record<string, unknown> | undefined;
	if (presence === 'some') {
		newQuery = { $elemMatch: currentPathQuery };
	} else if (presence === 'none') {
		newQuery = { $not: currentPathQuery };
	}
	return newQuery ?? currentPathQuery;
}
