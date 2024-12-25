import { Editor } from './view/editor';
import { Statusbar } from './view/statusbar';
import { Toolbar } from './view/toolbar';
import { Controller } from './controller';
import { HexFile } from './file/hexfile';

import '../css/application.css';
import '../css/vars.css';

class Application {
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
		document.body.append(this.#appToolbar.html);
		document.body.append(this.#editor.html);
		document.body.append(this.#appStatusbar.html);
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
