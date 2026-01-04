function addPresenceToQuery (presence, currentPathQuery) {
	var newQuery;
	if (presence === 'some') {
		newQuery = {
			$elemMatch: currentPathQuery,
		};
	} else if (presence === 'none') {
		newQuery = {
			$not: currentPathQuery,
		};
	}
	return newQuery || currentPathQuery;
}

module.exports = addPresenceToQuery;
