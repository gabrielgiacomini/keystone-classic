/**
 * @fileoverview This file defines the `getPages` function, which generates an
 * array of page numbers for pagination, including ellipsis for truncated pages.
 */

/**
 * Generate page array for pagination.
 *
 * @param {Object} options Page options.
 * @param {number} maxPages The maximum number of pages to display in the pagination.
 */
function getPages (options, maxPages) {
	// Calculate the number of pages to show before and after the current page
	var surround = Math.floor(maxPages / 2);
	// Calculate the first page to show
	var firstPage = maxPages ? Math.max(1, options.currentPage - surround) : 1;
	// Calculate the padding on the right side
	var padRight = Math.max(((options.currentPage - surround) - 1) * -1, 0);
	// Calculate the last page to show
	var lastPage = maxPages ? Math.min(options.totalPages, options.currentPage + surround + padRight) : options.totalPages;
	// Calculate the padding on the left side
	var padLeft = Math.max(((options.currentPage + surround) - lastPage), 0);
	// Initialize the pages array
	options.pages = [];
	// Adjust the first page based on the left padding
	firstPage = Math.max(Math.min(firstPage, firstPage - padLeft), 1);

	// Generate the page numbers
	for (var i = firstPage; i <= lastPage; i++) {
		options.pages.push(i);
	}

	// Add ellipsis to the beginning if the first page is not 1
	if (firstPage !== 1) {
		options.pages.shift();
		options.pages.unshift('...');
	}

	// Add ellipsis to the end if the last page is not the total number of pages
	if (lastPage !== Number(options.totalPages)) {
		options.pages.pop();
		options.pages.push('...');
	}
}

module.exports = getPages;
