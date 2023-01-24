export class ListSelect extends HTMLSelectElement {
	/**
	 * @type {ListWithAccounts}
	 */
	#lists;

	constructor() {
		super();
		this.disabled = true;
	}

	set lists(value) {
		this.#lists = value;
		for (const list of this.#lists.keys()) {
			const option = document.createElement("option");
			option.value = list.id;
			option.text = list.title;
			this.add(option);
		}
		this.disabled = false;
	}
}

customElements.define('list-select', ListSelect, {extends: 'select'});