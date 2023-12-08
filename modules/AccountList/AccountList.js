import '../ListSelect/ListSelect.js';
import '../AccountMultiselect/AccountMultiselect.js';

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
		const fragment = document.createDocumentFragment();

		/**
		 * @type {ListSelect}
		 */
		const listSelect = document.createElement('select', {is: 'list-select'});
		listSelect.lists = this.#listWithAccounts;
		fragment.appendChild(listSelect);

		/**
		 * @type {AccountMultiselect}
		 */
		const accountMultiselect = document.createElement('account-multiselect');
		accountMultiselect.accounts = listSelect.accountsValue;
		fragment.appendChild(accountMultiselect);
		this.appendChild(fragment);
	}
}

customElements.define('account-list', AccountList);