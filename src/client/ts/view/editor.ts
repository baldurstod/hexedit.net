import { createElement, createShadowRoot } from 'harmony-ui';

import editorCSS from '../../css/editor.css';
import { HexFile } from '../file/hexfile';

export class Editor {
	#shadowRoot?: ShadowRoot;
	#htmlOffset!: HTMLElement;
	#hexFile?: HexFile;
	#bytesPerRow = 16;

	#initHTML() {
		this.#shadowRoot = createShadowRoot('div', {
			adoptStyle: editorCSS,
			class: 'editor',
			childs: [
				this.#htmlOffset = createElement('div', {
					class: 'offset',
				})

			],
		})
		this.#refresh();
		return this.#shadowRoot;

	}

	setFile(file: HexFile) {
		this.#hexFile = file;
		this.#refresh();
	}

	get html(): HTMLElement {
		return (this.#shadowRoot ?? this.#initHTML()).host as HTMLElement;
	}

	#refresh() {
		this.#refreshOffset();
	}

	#refreshOffset() {
		const length = (this.#hexFile?.length ?? 0) + 1/* account for eof */;
		const offset = this.#hexFile?.offset ?? 0;
		const offsetChars = Math.max(8, (length).toString(16).length);
		const rows = Math.max(1, Math.ceil(length / this.#bytesPerRow));
		console.log(offsetChars, rows);

		this.#htmlOffset.innerText = '';
		let lineOffset = Math.floor(offset / this.#bytesPerRow) * this.#bytesPerRow;
		for (let i = 0; i < rows; ++i) {

			this.#htmlOffset.append(createElement('div', {
				innerText: (lineOffset).toString(16).padStart(offsetChars, '0'),
			}));



			lineOffset += this.#bytesPerRow;
		}

	}

	setBytesPerRow(bytesPerRow: number) {
		this.#bytesPerRow = Math.max(bytesPerRow, 1);
	}
}
