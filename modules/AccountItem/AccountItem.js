import {render, html} from 'https://esm.run/uhtml/index.js';

export const ACCOUNT_TOGGLED_EVENT = 'accountToggled';
export const RANGE_OF_ACCOUNTS_TOGGLED_EVENT = 'rangeOfAccountsToggled';

export class AccountItem extends HTMLElement {
	/**
	 * @type {Account}
	 */
	#account;

	constructor() {
		super();
		this.addEventListener('click', this.#onClick);
		this.addEventListener('mousedown', this.#preventTextSelection);
	}

	/**
	 * @param {Account} account
	 */
	set account(account) {
		this.#account = account;
		this.render(account);
	}

	/**
	 * @param {Account} account
	 */
	render(account) {
		render(this, html`
      <img src=${account.avatar} alt=${`Avatar of the account @${account.acct}`}/>
      <article>
        <bdi><strong>${account.display_name}</strong></bdi>
        <p>${account.acct}</p>
      </article>
		`);
	}

	#onClick(event) {
		if (event.shiftKey) {
			this.dispatchEvent(new CustomEvent(RANGE_OF_ACCOUNTS_TOGGLED_EVENT, {bubbles: true}));
		} else {
			this.dispatchEvent(new CustomEvent(ACCOUNT_TOGGLED_EVENT, {bubbles: true}));
		}
	}

	#preventTextSelection(event) {
		if (event.shiftKey) {
			event.preventDefault();
		}
	}
}

customElements.define("account-item", AccountItem);