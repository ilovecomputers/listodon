import '../ListSelect/ListSelect.js';
import '../AccountMultiselect/AccountMultiselect.js';
import {render, html} from 'https://esm.run/uhtml/index.js';

export class AccountList extends HTMLElement {

	/**
	 * @type {ListWithAccounts}
	 */
	#listWithAccounts;

	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
	}

	set listWithAccounts(value) {
		this.#listWithAccounts = value;
		this.render();
	}

	render() {
		render(this, html`
				${this.#listWithAccounts ? html`
						 <select
											 is="list-select"
											 @change=${this.#onListChange.bind(this)}
											 .lists=${this.#listWithAccounts}
						 />
						 <account-multiselect />
				` : null}
		`);
		if (!this.#listWithAccounts) {
			return;
		}

		const listSelect = this.querySelector('select');
		const accountMultiselect = this.querySelector('account-multiselect');
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