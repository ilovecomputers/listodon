import {ACCOUNT_SELECTED_EVENT} from "../AccountListItem/AccountListItem.js";

export class AccountMultiselect extends HTMLElement {
	/**
	 * @type {Array.<Account>}
	 */
	#accounts;

	constructor() {
		super();
		this.addEventListener(ACCOUNT_SELECTED_EVENT, this.#onAccountSelect);
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

	#onAccountSelect(event) {
		if (event.target.getAttribute('aria-selected') === 'true') {
			event.target.removeAttribute('aria-selected');
		} else {
			event.target.setAttribute('aria-selected', 'true');
		}
	}
}

customElements.define('account-multiselect', AccountMultiselect);