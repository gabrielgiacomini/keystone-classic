/**
 * @fileoverview This script provides in-place editing functionality for Keystone
 * content. It scans the page for elements with the `data-ks-editable`
 * attribute and adds an edit button to them.
 *
 * The `data-ks-editable` attribute should contain a JSON object with the
 * following properties:
 *
 * - `type`: The type of editable content. Currently, only `list` is supported.
 * - `path`: The path to the list in the Admin UI.
 * - `plural`: The plural name of the list.
 * - `singular`: The singular name of the list.
 * - `id`: (Optional) The ID of the item to edit.
 */
jQuery(function ($) {

	var refs = $('[data-ks-editable]');

	/**
	 * Adds an edit button to an editable element.
	 *
	 * @param {jQuery} $editable The editable element.
	 * @param {string} href The URL for the edit button.
	 * @param {string} label The label for the edit button.
	 */
	function addButton ($editable, href, label) {

		// Set the position of the editable element to relative so that the edit
		// button can be positioned absolutely within it.
		$editable.css({ position: 'relative' });

		// Keep track of whether the button is visible.
		var visible = false;

		// Create the edit button.
		var $btn = $('<a class="ks-editable-btn" href="' + href + '" target="_blank">' + label + '</a>')
			.css({
				opacity: 0,
				top: 0,
				right: 0,
			})
			.appendTo($editable);

		// Show and hide the button on mouseover and mouseout.
		$editable.on('mouseenter mousemove', function (e) { // eslint-disable-line no-unused-vars
			if (visible) return;
			visible = true;
			$btn.css({ opacity: 1 });
		}).on('mouseleave', function (e) { // eslint-disable-line no-unused-vars
			visible = false;
			$btn.css({ opacity: 0 });
		});

	}

	// Iterate over all the editable elements on the page.
	refs.each(function (i, editable) {

		var $editable = $(editable);
		var data = $editable.data('ks-editable');

		// Check the type of the editable element.
		switch (data.type) {

			// If it's a list, add a "Manage" or "Edit" button.
			case 'list':
				var href = data.path;
				var label = 'Manage ' + data.plural;

				if (data.id) {
					href += '/' + data.id;
					label = 'Edit ' + data.singular;
				}

				addButton($editable, href, label);
				break;

			// If it's a content block, do nothing for now.
			case 'content':
				// TODO
				break;

			// If it's an error, do nothing for now.
			case 'error':
				// TODO
				break;

		}

	});

});
