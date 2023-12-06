import '../ListSelect/ListSelect.js';

export class AccountList extends HTMLElement {

	/**
	 * @type {ListWithAccounts}
	 */
	#listWithAccounts;

	constructor() {
		super();
	}


	set listWithAccounts(value) {
		this.#listWithAccounts = value;

		/**
		 * @type {ListSelect}
		 */
		const listSelect = document.createElement('select', {is: 'list-select'});
		listSelect.lists = this.#listWithAccounts;
		this.appendChild(listSelect);
	}
}

customElements.define('account-list', AccountList);