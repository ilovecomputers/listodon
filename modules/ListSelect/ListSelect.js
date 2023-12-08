export class ListSelect extends HTMLSelectElement {
	/**
	 * @type {ListWithAccounts}
	 */
	#lists;

	/**
	 * @type {Map<String, List>}
	 */
	#listsMap;

	constructor() {
		super();
		this.disabled = true;
	}

	set lists(value) {
		this.#lists = value;
		this.#listsMap = new Map();
		for (const list of this.#lists.keys()) {
			this.#listsMap.set(list.id, list);
			const option = document.createElement("option");
			option.value = list.id;
			option.text = list.title;
			this.add(option);
		}
		this.disabled = false;
	}

	/**
	 * @return {List}
	 */
	get value() {
		return this.#listsMap.get(super.value);
	}

	/**
	 * @return {Array<Account>}
	 */
	get accountsValue() {
		return this.#lists.get(this.value);
	}
}

customElements.define('list-select', ListSelect, {extends: 'select'});