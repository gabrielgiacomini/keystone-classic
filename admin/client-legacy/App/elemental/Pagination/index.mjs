import { css } from 'glamor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Page from './page.mjs';
import theme from '../../../theme.mjs';

/**
 * Pagination component that renders a record count summary and a list of
 * page number buttons. Page buttons are windowed to at most `limit` items.
 */
class Pagination extends Component {
	/**
	 * Renders a text summary of which records are currently visible.
	 *
	 * When there are no records the text reads "No <plural|records>".
	 * When total exceeds pageSize it reads "Showing <start> to <end> of <total>".
	 * Otherwise it reads "Showing <total> [singular|plural]".
	 * @returns {React.Element} A div containing the count string.
	 */
	renderCount () {
		let count = '';
		const { currentPage, pageSize, plural, singular, total } = this.props;
		if (!total) {
			count = 'No ' + (plural || 'records');
		} else if (total > pageSize) {
			const start = (pageSize * (currentPage - 1)) + 1;
			const end = Math.min(start + pageSize - 1, total);
			count = `Showing ${start} to ${end} of ${total}`;
		} else {
			count = 'Showing ' + total;
			if (total > 1 && plural) {
				count += ' ' + plural;
			} else if (total === 1 && singular) {
				count += ' ' + singular;
			}
		}
		return (
			<div className={css(classes.count)} data-e2e-pagination-count>{count}</div>
		);
	}
	/**
	 * Renders the list of page number buttons.
	 *
	 * Returns null when all records fit on a single page. When `limit` is set
	 * and smaller than the total number of pages the window is centred on
	 * `currentPage`. Ellipsis buttons ("...") are added at the start and/or end
	 * to jump to the first or last page when the window does not include them.
	 * @returns {React.Element|null} A div of Page buttons, or null.
	 */
	renderPages () {
		const { currentPage, limit, onPageSelect, pageSize, total } = this.props;

		if (total <= pageSize) return null;

		const pages = [];
		const totalPages = Math.ceil(total / pageSize);
		let minPage = 1;
		let maxPage = totalPages;

		if (limit && (limit < totalPages)) {
			const rightLimit = Math.floor(limit / 2);
			const leftLimit = rightLimit + (limit % 2) - 1;
			minPage = currentPage - leftLimit;
			maxPage = currentPage + rightLimit;

			if (minPage < 1) {
				maxPage = limit;
				minPage = 1;
			}
			if (maxPage > totalPages) {
				minPage = totalPages - limit + 1;
				maxPage = totalPages;
			}
		}
		if (minPage > 1) {
			pages.push(<Page key="page_start" onClick={() => onPageSelect(1)}>...</Page>);
		}
		for (let page = minPage; page <= maxPage; page++) {
			const selected = (page === currentPage);
			pages.push(<Page key={'page_' + page} selected={selected} onClick={() => onPageSelect(page)}>{page}</Page>);
		}
		if (maxPage < totalPages) {
			pages.push(<Page key="page_end" onClick={() => onPageSelect(totalPages)}>...</Page>);
		}
		return (
			<div className={css(classes.list)}>
				{pages}
			</div>
		);
	}
	/**
	 * Renders the pagination container with the count summary and page buttons.
	 * @returns {React.Element} The root pagination div.
	 */
	render () {
		const className = css(classes.container, this.props.className);
		return (
			<div className={className} style={this.props.style}>
				{this.renderCount()}
				{this.renderPages()}
			</div>
		);
	}
};

const classes = {
	container: {
		display: 'block',
		lineHeight: theme.component.lineHeight,
		marginBottom: '2em',
	},
	count: {
		display: 'inline-block',
		marginRight: '1em',
		verticalAlign: 'middle',
	},
	list: {
		display: 'inline-block',
		verticalAlign: 'middle',
	},
};

Pagination.propTypes = {
	className: PropTypes.string,
	currentPage: PropTypes.number.isRequired,
	limit: PropTypes.number,
	onPageSelect: PropTypes.func,
	pageSize: PropTypes.number.isRequired,
	plural: PropTypes.string,
	singular: PropTypes.string,
	style: PropTypes.object,
	total: PropTypes.number.isRequired,
};

export default Pagination;
