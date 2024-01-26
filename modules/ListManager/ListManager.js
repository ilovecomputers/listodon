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
        <button>⬅️</button>
        <button>➡️</button>
        <account-list .listWithAccounts=${this.#rhsListWithAccounts}></account-list>
		`);
	}
}

customElements.define('list-manager', ListManager);