import '../AccountListItem/AccountListItem.js';

export class AccountMultiselect extends HTMLElement {
	/**
	 * @type {Array.<Account>}
	 */
	#accounts;

	constructor() {
		super();
	}

	set accounts(value) {
		this.#accounts = value;
		const accounts = document.createDocumentFragment();
		for (const account of this.#accounts) {
			const option = document.createElement('account-list-item');
			option.account = account;
			accounts.appendChild(option);
		}
		this.appendChild(accounts);
	}
}

customElements.define('account-multiselect', AccountMultiselect);