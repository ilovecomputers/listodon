/**
 * @type {HTMLTemplateElement}
 */
const TEMPLATE = document.querySelector('#account-list-item');

export const ACCOUNT_TOGGLED_EVENT = 'accountToggled';

export class AccountListItem extends HTMLElement {
	/**
	 * @type {Account}
	 */
	#account;

	constructor() {
		super();
		if (!TEMPLATE) {
			throw new Error('No template found for <account-list-item>');
		}
		this.addEventListener('click', this.#onToggle);
	}

	/**
	 * @param {Account} account
	 */
	set account(account) {
		this.#account = account;
		this.appendChild(this.populateTemplate(account));
		this.addEventListener('click', this.#onToggle);
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

	#onToggle() {
		this.dispatchEvent(new CustomEvent(ACCOUNT_TOGGLED_EVENT, {bubbles: true}));
	}
}

customElements.define("account-list-item", AccountListItem);