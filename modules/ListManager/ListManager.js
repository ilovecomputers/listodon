import "../AccountList/AccountList.js";
import {render, html} from 'https://esm.run/uhtml/index.js';

export class ListManager extends HTMLElement {

	/**
	 * @type {ListWithAccounts}
	 */
	#lhsListWithAccounts;

	/**
	 * @type {ListWithAccounts}
	 */
	#rhsListWithAccounts;


	constructor() {
		super();
	}

	/**
	 *
	 * @param {ListWithAccounts} listWithAccounts
	 */
	set listWithAccounts(listWithAccounts) {
		this.#lhsListWithAccounts = listWithAccounts;
		this.#rhsListWithAccounts = new Map(listWithAccounts);
		this.#rhsListWithAccounts.delete(this.#lhsListWithAccounts.keys().next());
		this.render();
	}

	render() {
		render(this, html`
      <account-list .listWithAccounts=${this.#lhsListWithAccounts}></account-list>
      <div>
        <button onclick=${this.#moveItems.bind(this, 'right', 'left')}>⬅️</button>
        <button onclick=${this.#moveItems.bind(this, 'left', 'right')}>➡️</button>
      </div>
      <account-list .listWithAccounts=${this.#rhsListWithAccounts}></account-list>
		`);
	}

	#moveItems(fromSide, toSide) {
		const {
			accounts: fromAccounts,
			accountMultiselect: fromAccountMultiselect
		} = this.#getAccounts(fromSide);
		const selectedAccountItems = fromAccountMultiselect.getSelectedAccountItems();
		const itemsToMove = [];
		let numberOfItemsRemoved = 0;
		selectedAccountItems.forEach(selectedItem => {
			const index = Number.parseInt(selectedItem.dataset.index);
			const itemToMove = fromAccounts.splice(index - numberOfItemsRemoved, 1);
			if (itemToMove[0]) {
				numberOfItemsRemoved++;
				itemsToMove.push(itemToMove[0]);
			}
		});

		const {
			accounts: toAccounts,
			accountMultiselect: toAccountMultiselect
		} = this.#getAccounts(toSide);
		toAccounts.unshift(...itemsToMove);
		fromAccountMultiselect.accounts = fromAccounts;
		toAccountMultiselect.accounts = toAccounts;
	}

	/**
	 * @param {'left'|'right'} side
	 * @return {{accounts: [Account], accountMultiselect: AccountMultiselect}}
	 */
	#getAccounts(side) {
		const PARAMETERS = {
			left: {index: 0, listWithAccounts: this.#lhsListWithAccounts},
			right: {index: 1, listWithAccounts: this.#rhsListWithAccounts}
		};
		const {index, listWithAccounts} = PARAMETERS[side];
		const accountList = this.querySelectorAll('account-list').item(index);
		/** @type {ListSelect} */
		const listSelect = accountList.querySelector('select');
		/** @type {[Account]} */
		const accounts = listWithAccounts.get(listSelect.value);
		/** @type {AccountMultiselect} */
		const accountMultiselect = accountList.querySelector('account-multiselect');
		return {accounts, accountMultiselect};
	}
}

customElements.define('list-manager', ListManager);