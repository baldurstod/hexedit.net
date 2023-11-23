export class HexFile {
	#file;
	#cursorOffset = 0;
	#offset = 0;
	constructor(file) {
		this.#file = file;
	}

	get length() {
		return this.#file?.size ?? 0;
	}

	get cursorOffset() {
		return this.#cursorOffset;
	}

	get offset() {
		return this.#offset;
	}
}
