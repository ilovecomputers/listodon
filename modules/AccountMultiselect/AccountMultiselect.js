import {ACCOUNT_SELECTED_EVENT} from "../AccountListItem/AccountListItem.js";

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
		this.addEventListener(ACCOUNT_SELECTED_EVENT, this.#onAccountSelect);
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

	#onAccountSelect(event) {
		this.#toggleItem(event.target);
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
		this.#focusItem('nextElementSibling');
	}

	#focusPreviousItem() {
		this.#focusItem('previousElementSibling');
	}

	#focusItem(whichSibling) {
		const focusedItems = this.querySelectorAll('account-list-item[data-focused="true"]');
		if (focusedItems.length === 0) {
			this.querySelector('account-list-item').dataset.focused = 'true';
			return;
		}

		const currentFocusedItem = focusedItems[focusedItems.length - 1];
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
		const focusedItems = this.querySelectorAll('account-list-item[data-focused="true"]');
		const currentFocusedItem = focusedItems[focusedItems.length - 1];
		this.#toggleItem(currentFocusedItem);
	}
}

customElements.define('account-multiselect', AccountMultiselect);