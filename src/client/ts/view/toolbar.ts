import { createElement, createShadowRoot } from 'harmony-ui';
import { Controller } from '../controller';

import toolbarCSS from '../../css/toolbar.css';

export class Toolbar {
	#shadowRoot?: ShadowRoot;

	#initHTML() {
		this.#shadowRoot = createShadowRoot('div', {
			adoptStyle: toolbarCSS,
			innerText: 'this is the toolbar',
			childs: [
				createElement('div', {
					class: 'button',
					innerText: 'new file',
					events: {
						click: () => Controller.dispatchEvent(new CustomEvent('createnewfile')),
					},
				})

			],
		})
		return this.#shadowRoot;

	}

	get html(): HTMLElement {
		return (this.#shadowRoot ?? this.#initHTML()).host as HTMLElement;
	}
}
