import '../ListSelect/ListSelect.js';
import '../AccountMultiselect/AccountMultiselect.js';

export class AccountList extends HTMLElement {

	/**
	 * @type {ListWithAccounts}
	 */
	#listWithAccounts;

	constructor() {
		super();
		const fragment = document.createDocumentFragment();

		/**
		 * @type {ListSelect}
		 */
		const listSelect = document.createElement('select', {is: 'list-select'});
		listSelect.style.display = 'none';
		listSelect.addEventListener('change', this.#onListChange.bind(this));
		fragment.appendChild(listSelect);

		/**
		 * @type {AccountMultiselect}
		 */
		const accountMultiselect = document.createElement('account-multiselect');
		accountMultiselect.style.display = 'none';
		fragment.appendChild(accountMultiselect);
		this.appendChild(fragment);
	}


	set listWithAccounts(value) {
		this.#listWithAccounts = value;
		const listSelect = this.querySelector('select');
		listSelect.lists = this.#listWithAccounts;
		listSelect.style.display = null;
		const accountMultiselect = this.querySelector('account-multiselect');
		accountMultiselect.style.display = null;
		accountMultiselect.accounts = listSelect.accountsValue;
	}


	#onListChange(event) {
		/**
		 * @type {ListSelect}
		 */
		const listSelect = event.target;
		/**
		 * @type {AccountMultiselect}
		 */
		const accountMultiselect = this.querySelector('account-multiselect');
		accountMultiselect.accounts = listSelect.accountsValue;
	}

}

customElements.define('account-list', AccountList);