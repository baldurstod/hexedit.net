import { createElement, createShadowRoot } from 'harmony-ui';
import editorCSS from '../../css/editor.css';
import { HexFile } from '../file/hexfile';

export class Editor {
	#shadowRoot: ShadowRoot;
	#htmlOffset: HTMLElement;
	#htmlHex: HTMLElement;
	#htmlText: HTMLElement;
	#hexFile?: HexFile;
	#bytesPerRow = 16;
	#firstVisibleRow = 0;
	#visibleRows = -1;
	#startOffset = 0;

	#dirty = false;
	//#hexDirty = false;
	//#TextDirty = false;

	#offsets = new Map<HTMLElement, number>();
	#hexes = new Map<HTMLElement, number>();
	#texts = new Map<HTMLElement, number>();

	#offsetArray: Array<HTMLElement> = [];
	#hexArray: Array<HTMLElement> = [];
	#textArray: Array<HTMLElement> = [];

	constructor() {
		this.#shadowRoot = createShadowRoot('div', {
			adoptStyle: editorCSS,
			childs: [
				this.#htmlOffset = createElement('div', {
					class: 'offset',
				}),
				this.#htmlHex = createElement('div', {
					class: 'hex',
				}),
				this.#htmlText = createElement('div', {
					class: 'text',
				}),

			],
		});
		this.#refresh();
		this.#initResizeObserver();
	}

	#initResizeObserver() {
		const callback: ResizeObserverCallback = (entries, observer) => {
			entries.forEach(entry => {
				this.#refresh();
			});
		};
		const resizeObserver = new ResizeObserver(callback);
		resizeObserver.observe(this.#shadowRoot.host);
	}

	setFile(file: HexFile) {
		this.#hexFile = file;

		this.#dirty = true;

		this.#startOffset = 0;

		this.#refresh();
	}

	setStartOffset(startOffset: number) {
		this.#startOffset = startOffset;
		this.#dirty = true;
	}

	get html(): HTMLElement {
		return this.#shadowRoot.host as HTMLElement;
	}

	#refresh() {
		const clientHeight = this.#shadowRoot!.host.clientHeight;

		const length = (this.#hexFile?.length ?? 0) + 1/* account for eof */;
		const offset = this.#hexFile?.offset ?? 0;
		//this.#visibleRows = 10;
		const rows = Math.max(1, Math.min(this.#shadowRoot!.host.clientHeight / 30, Math.ceil(length / this.#bytesPerRow)));

		this.#setVisibleRows(rows);


		this.#refreshOffset();
		this.#refreshHex();
	}

	#setVisibleRows(rows: number) {
		if (rows != this.#visibleRows) {
			this.#dirty = true;
			this.#visibleRows = rows;
			this.#rowCountChanged();
		}
	}

	#rowCountChanged() {
		this.#offsetArray = [];
		this.#hexArray = [];
		this.#textArray = [];

		this.#htmlOffset.innerHTML = '';
		this.#htmlHex.innerHTML = '';
		this.#htmlText.innerHTML = '';

		const length = (this.#hexFile?.length ?? 0) + 1/* account for eof */;
		const offset = this.#hexFile?.offset ?? 0;
		const offsetChars = Math.max(8, (length).toString(16).length);
		let lineOffset = Math.floor(offset / this.#bytesPerRow) * this.#bytesPerRow;

		let byteOffset = 0;
		for (let i = 0; i < this.#visibleRows; ++i) {
			//const html = this.#getOffset(i);

			const htmlOffset = createElement('div', {
				parent: this.#htmlOffset,
				innerText: (lineOffset).toString(16).padStart(offsetChars, '0'),
			});

			this.#offsetArray.push(htmlOffset);
			this.#offsets.set(htmlOffset, lineOffset);

			for (let j = 0; j < this.#bytesPerRow; j++) {
				if (j == 0 && byteOffset > 0) {
					createElement('br', { parent: this.#htmlHex, });
					createElement('br', { parent: this.#htmlText, });
				}

				const htmlHex = createElement('span', {
					parent: this.#htmlHex,
					innerText: '00',
				});

				this.#hexArray.push(htmlHex);
				this.#hexes.set(htmlHex, byteOffset);

				const htmlText = createElement('span', {
					parent: this.#htmlText,
					innerText: '.',
				});

				this.#textArray.push(htmlText);
				this.#texts.set(htmlText, byteOffset);

				++byteOffset;
			}


			lineOffset += this.#bytesPerRow;
		}

	}

	#refreshOffset() {
		const length = (this.#hexFile?.length ?? 0) + 1/* account for eof */;
		const offset = this.#hexFile?.offset ?? 0;
		const offsetChars = Math.max(8, (length).toString(16).length);
		//const rows = Math.max(1, Math.min(this.#visibleRows, Math.ceil(length / this.#bytesPerRow)));
		console.log(offsetChars, this.#visibleRows);
		/*
				this.#htmlOffset.innerText = '';
				let lineOffset = Math.floor(offset / this.#bytesPerRow) * this.#bytesPerRow;
				for (let i = 0; i < this.#visibleRows; ++i) {
					const html = this.#getOffset(i);


					//this.#htmlOffset.append(html);
					html.innerText = (lineOffset).toString(16).padStart(offsetChars, '0');

					/*
					createElement('div', {
						innerText: (lineOffset).toString(16).padStart(offsetChars, '0'),
					})
					* /
					//);
					lineOffset += this.#bytesPerRow;
				}*/
	}

	#refreshHex() {
		return;
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

	#getOffset(line: number): HTMLElement {
		let html = this.#offsetArray[line];
		if (html) {
			return html
		}

		html = createElement('div', { parent: this.#htmlOffset, });
		this.#offsetArray[line] = html;

		return html;
	}
}
