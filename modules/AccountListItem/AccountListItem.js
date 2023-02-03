/**
 * @type {HTMLTemplateElement}
 */
const TEMPLATE = document.querySelector('#account-list-item');

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
}

customElements.define("account-list-item", AccountListItem);