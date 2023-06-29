import {ACCOUNT_TOGGLED_EVENT} from "../AccountListItem/AccountListItem.js";

export class AccountMultiselect extends HTMLElement {
	/**
	 * @type {Array.<Account>}
	 */
	#accounts = [];

	/**
	 * Toggle accounts as you move the focus
	 * @type {boolean}
	 */
	#toggleWithMovement = false;

	constructor() {
		super();
		this.tabIndex = 0;
		this.addEventListener(ACCOUNT_TOGGLED_EVENT, this.#onAccountToggled);
		this.addEventListener('keydown', this.#onKeyDown);
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

	#onAccountToggled(event) {
		this.#toggleItem(event.target);
		this.#focusItem(event.target);
	}

	/**
	 * @param {AccountListItem} accountListItem
	 */
	#toggleItem(accountListItem) {
		if (accountListItem.getAttribute('aria-selected') === 'true') {
			accountListItem.removeAttribute('aria-selected');
		} else {
			accountListItem.setAttribute('aria-selected', 'true');
		}
	}

	/**
	 * @param {AccountListItem} accountListItem
	 */
	#focusItem(accountListItem) {
		const currentFocusedItem = this.querySelector('account-list-item[data-focused="true"]');
		if (currentFocusedItem) {
			currentFocusedItem.dataset.focused = 'false';
		}
		accountListItem.dataset.focused = 'true';
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		if (event.shiftKey) {
			event.preventDefault()
			this.#toggleWithMovement = true;
		}
		switch (event.key) {
			case 'ArrowDown':
				this.#focusNextItem();
				break;
			case 'ArrowUp':
				this.#focusPreviousItem();
				break;
			case ' ':
				event.preventDefault();
				this.#toggleCurrentItem();
				break;
		}
		this.#toggleWithMovement = false;
	}

	#focusNextItem() {
		this.#focusAdjacentItem('nextElementSibling');
	}

	#focusPreviousItem() {
		this.#focusAdjacentItem('previousElementSibling');
	}

	#focusAdjacentItem(whichSibling) {
		const currentFocusedItem = this.querySelector('account-list-item[data-focused="true"]');
		if (!currentFocusedItem) {
			this.querySelector('account-list-item').dataset.focused = 'true';
			return;
		}

		const nextFocusedItemElement = currentFocusedItem[whichSibling];
		if (nextFocusedItemElement === null) {
			return;
		}

		currentFocusedItem.dataset.focused = 'false';
		nextFocusedItemElement.dataset.focused = 'true';
		if (this.#toggleWithMovement) {
			this.#toggleItem(nextFocusedItemElement);
		}
	}

	#toggleCurrentItem() {
		const currentFocusedItem = this.querySelector('account-list-item[data-focused="true"]');
		this.#toggleItem(currentFocusedItem);
	}
}

customElements.define('account-multiselect', AccountMultiselect);