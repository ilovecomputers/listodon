export class AccountMultiselect extends HTMLSelectElement {
	/**
	 * @type {Array.<Account>}
	 */
	#accounts;

	constructor() {
		super();
		this.multiple = true;
	}

	set accounts(value) {
		this.#accounts = value;
		if (this.#accounts.length > 15) {
			this.size = 15
		} else {
			this.size = this.#accounts.length;
		}
		for (const account of this.#accounts) {
			const option = document.createElement("option");
			option.value = account.id;
			option.text = account.acct;
			this.add(option);
		}
	}
}

customElements.define('account-multiselect', AccountMultiselect, {extends: 'select'});