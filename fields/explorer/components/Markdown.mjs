import { marked } from 'marked';
import React from 'react';

export default function Markdown({ className, source }) {
	return React.createElement('div', {
		className,
		dangerouslySetInnerHTML: { __html: marked(source || '') },
	});
}
