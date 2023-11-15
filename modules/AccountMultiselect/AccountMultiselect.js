import {ACCOUNT_TOGGLED_EVENT, RANGE_OF_ACCOUNTS_TOGGLED_EVENT} from "../AccountListItem/AccountListItem.js";

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
		this.addEventListener(RANGE_OF_ACCOUNTS_TOGGLED_EVENT, this.#onRangeOfAccountsToggled);
		this.addEventListener('keydown', this.#onKeyDown);
	}

	set accounts(value) {
		this.#accounts = value;
		const accounts = document.createDocumentFragment();
		for (const [index, account] of this.#accounts.entries()) {
			const option = document.createElement('account-list-item');
			option.account = account;
			option.dataset.index = index.toString();
			accounts.appendChild(option);
		}
		this.appendChild(accounts);
	}

	#onAccountToggled(event) {
		this.#toggleItem(event.target);
		this.#focusItem(event.target);
	}

	#onRangeOfAccountsToggled(event) {
		let currentFocusedItem = this.querySelector('account-list-item[data-focused="true"]');

		// if no focused item, then consider the first item focused
		if (!currentFocusedItem) {
			currentFocusedItem = this.querySelector('account-list-item');
		}
		const currentFocusedItemIndex = Number(currentFocusedItem.dataset.index);
		const selectedItemIndex = Number(event.target.dataset.index);
		let item = currentFocusedItem;

		// if we range select an item before the focused
		if (currentFocusedItemIndex > selectedItemIndex) {
			item = event.target;
		}

		for (let i = Math.min(currentFocusedItemIndex, selectedItemIndex); i <= Math.max(currentFocusedItemIndex, selectedItemIndex); i++) {
			this.#toggleItem(item);
			item = item.nextSibling;
		}

		currentFocusedItem.dataset.focused = 'false';
		event.target.dataset.focused = 'true';
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
			event.preventDefault();
			this.#toggleWithMovement = true;
		}
		switch (event.key) {
			case 'ArrowDown':
				this.#focusNextItem();
				break;
			case 'ArrowUp':
				this.#focusPreviousItem();
				break;
			case 'Home':
				this.#focusItem(this.querySelector('account-list-item'))
				break;
			case 'End':
				this.#focusItem(Array.from(this.querySelectorAll('account-list-item')).at(-1))
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