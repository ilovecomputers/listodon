import {ACCOUNT_TOGGLED_EVENT, RANGE_OF_ACCOUNTS_TOGGLED_EVENT} from "../accountItem/AccountItem.js";

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
		this.addEventListener(ACCOUNT_TOGGLED_EVENT, this.#onAccountToggled);
		this.addEventListener(RANGE_OF_ACCOUNTS_TOGGLED_EVENT, this.#onRangeOfAccountsToggled);
		this.addEventListener('keydown', this.#onKeyDown);
	}

	connectedCallback() {
		this.tabIndex = 0;
	}

	set accounts(value) {
		this.#accounts = value;
		const accounts = document.createDocumentFragment();
		for (const [index, account] of this.#accounts.entries()) {
			const option = document.createElement('account-item');
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
		let currentFocusedItem = this.querySelector('account-item[data-focused="true"]');

		// if no focused item, then consider the first item focused
		if (!currentFocusedItem) {
			currentFocusedItem = this.querySelector('account-item');
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
	 * @param {AccountItem} accountItem
	 */
	#toggleItem(accountItem) {
		if (accountItem.getAttribute('aria-selected') === 'true') {
			accountItem.removeAttribute('aria-selected');
		} else {
			accountItem.setAttribute('aria-selected', 'true');
		}
	}

	/**
	 * @param {AccountItem} accountItem
	 */
	#focusItem(accountItem) {
		const currentFocusedItem = this.querySelector('account-item[data-focused="true"]');
		if (currentFocusedItem) {
			currentFocusedItem.dataset.focused = 'false';
		}
		accountItem.dataset.focused = 'true';
	}

	/**
	 * @param {KeyboardEvent} event
	 */
	#onKeyDown(event) {
		if (event.shiftKey && event.key !== 'Tab') {
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
				this.#focusItem(this.querySelector('account-item'))
				break;
			case 'End':
				this.#focusItem(Array.from(this.querySelectorAll('account-item')).at(-1))
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
		const currentFocusedItem = this.querySelector('account-item[data-focused="true"]');
		if (!currentFocusedItem) {
			this.querySelector('account-item').dataset.focused = 'true';
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
		const currentFocusedItem = this.querySelector('account-item[data-focused="true"]');
		this.#toggleItem(currentFocusedItem);
	}
}

customElements.define('account-multiselect', AccountMultiselect);