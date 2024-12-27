import { Editor } from './view/editor';
import { Statusbar } from './view/statusbar';
import { Toolbar } from './view/toolbar';
import { Controller } from './controller';
import { HexFile } from './file/hexfile';
import { createShadowRoot, documentStyle } from 'harmony-ui';
import appCSS from '../css/app.css';

import htmlCSS from '../css/html.css';
import varsCSS from '../css/vars.css';

documentStyle(htmlCSS);
documentStyle(varsCSS);

class Application {
	#shadowRoot?: ShadowRoot;
	#editor = new Editor();
	#appStatusbar = new Statusbar();
	#appToolbar = new Toolbar();
	#files = new Set();
	constructor() {
		this.#initListeners();
		this.#initHTML();
	}

	#initListeners() {
		Controller.addEventListener('createnewfile', event => this.#createNewFile());
	}

	#initHTML() {
		this.#shadowRoot = createShadowRoot('div', {
			adoptStyle: appCSS,
			parent: document.body,
			childs: [
				this.#appToolbar.html,
				this.#editor.html,
				this.#appStatusbar.html,
			],
		});
	}

	#createNewFile() {
		console.log('create new file');
		//const file = new File(['azertyuiop'], 'untitled');
		const file = new File([new Uint8Array(1024)], 'untitled');
		const hexFile = new HexFile(file);
		this.#editor.setFile(hexFile);
	}
}
new Application();
