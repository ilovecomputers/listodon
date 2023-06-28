import {ACCOUNT_SELECTED_EVENT} from "../AccountListItem/AccountListItem.js";

export class AccountMultiselect extends HTMLElement {
	/**
	 * @type {Array.<Account>}
	 */
	#accounts;

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
		if (event.target.getAttribute('aria-selected') === 'true') {
			event.target.removeAttribute('aria-selected');
		} else {
			event.target.setAttribute('aria-selected', 'true');
		}
	}

	#onKeyDown(event) {
		switch (event.key) {
			case 'ArrowDown':
				this.#focusNextItem();
				break;
			case 'ArrowUp':
				this.#focusPreviousItem();
				break;
			case ' ':
				event.preventDefault();
				this.#clickCurrentItem();
				break;
		}
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
	}

	#clickCurrentItem() {
		const focusedItems = this.querySelectorAll('account-list-item[data-focused="true"]');
		const currentFocusedItem = focusedItems[focusedItems.length - 1];
		currentFocusedItem.click();
	}
}

customElements.define('account-multiselect', AccountMultiselect);