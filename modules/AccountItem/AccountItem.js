/**
 * @type {HTMLTemplateElement}
 */
const TEMPLATE = document.querySelector('#account-item');

export const ACCOUNT_TOGGLED_EVENT = 'accountToggled';
export const RANGE_OF_ACCOUNTS_TOGGLED_EVENT = 'rangeOfAccountsToggled';

export class AccountItem extends HTMLElement {
	/**
	 * @type {Account}
	 */
	#account;

	constructor() {
		super();
		if (!TEMPLATE) {
			throw new Error('No template found for <account-item>');
		}
		this.addEventListener('click', this.#onClick);
		this.addEventListener('mousedown', this.#preventTextSelection);
	}

	/**
	 * @param {Account} account
	 */
	set account(account) {
		this.#account = account;
		this.appendChild(this.populateTemplate(account));
	}

	/**
	 *
	 * @param {Account} account
	 * @return {Node}
	 */
	populateTemplate(account) {
		const template = TEMPLATE.content.cloneNode(true);
		const avatar = template.querySelector('img');
		avatar.src = account.avatar;
		avatar.alt = `Avatar of the account @${account.acct}`;
		const displayName = template.querySelector('strong');
		displayName.textContent = account.display_name;
		const address = template.querySelector('p');
		address.textContent = account.acct;
		return template;
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