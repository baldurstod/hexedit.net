import { createShadowRoot } from 'harmony-ui';

import '../../css/statusbar.css';

export class Statusbar {
	#shadowRoot?: ShadowRoot;

	#initHTML() {
		this.#shadowRoot = createShadowRoot('div', {
			class: 'statusbar',
			innerText: 'this is the statusbar',
		})
		return this.#shadowRoot;

	}

	get html(): HTMLElement {
		return (this.#shadowRoot ?? this.#initHTML()).host as HTMLElement;
	}

}
