import {FetchUtil} from "../FetchUtil/FetchUtil.js";

export class MastodonAPI {
	/**
	 * @type {MastodonOAuth}
	 */
	#mastoOAuth;

	/**
	 * @type {string}
	 */
	#userID;

	constructor(mastoOAuth) {
		this.#mastoOAuth = mastoOAuth;
	}

	async fetchFollowings() {
		return this.#fetchListOfUsers(this.#getAccessedURL("/api/v1/accounts/" + this.#userID + "/following"));
	}

	/**
	 * @typedef {Map<List, Array.<Account>>} ListWithAccounts
	 */
	/**
	 * @returns {Promise<ListWithAccounts>}
	 */
	async fetchLists() {
		const lists = new Map();
		const response = await FetchUtil.get(this.#getAccessedURL("/api/v1/lists"));
		const listsResponse = await response.json();
		for (const list of listsResponse) {
			const accounts = await this.#fetchListOfUsers(this.#getAccessedURL(`api/v1/lists/${list.id}/accounts`));
			lists.set(list, accounts);
		}
		return lists;
	}

	async #fetchListOfUsers(url) {
		if (!url.searchParams.has('limit')) {
			url.searchParams.set('limit', '80');
		}
		const response = await FetchUtil.get(url);
		let users = await response.json();
		let next = (MastodonAPI.#parseLinkHeader(response.headers.get('link'))['next']);
		if (next) {
			const moreUsers = await this.#fetchListOfUsers(new URL(next));
			if (Array.isArray(moreUsers)) {
				return users.concat(moreUsers);
			}
		}
		return users;
	}

	async getUserID() {
		if (!!this.#userID) {
			return;
		}

		const response = await FetchUtil.get(this.#getAccessedURL("/api/v1/accounts/verify_credentials/"));
		const user = await response.json();
		this.#userID = user.id;
	}

	/**
	 * @param {string} pathname
	 * @returns {URL}
	 */
	#getAccessedURL(pathname) {
		const url = new URL(this.#mastoOAuth.getURL());
		url.pathname = pathname;
		url.searchParams.set('access_token', this.#mastoOAuth.getAccessToken());
		return url;
	}

	/**
	 * parse a Link header by https://gist.github.com/deiu/9335803
	 *
	 * Link:<https://example.org/.meta>; rel=meta
	 *
	 * var r = parseLinkHeader(xhr.getResponseHeader('Link');
	 * r['meta'] outputs https://example.org/.meta
	 *
	 * @param {string} header
	 */
	static #parseLinkHeader(header) {
		if (!header) return "";
		const linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
		const paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

		const matches = header.match(linkexp);
		const rels = {};
		for (let i = 0; i < matches.length; i++) {
			const split = matches[i].split('>');
			const href = split[0].substring(1);
			const ps = split[1];
			const s = ps.match(paramexp);
			for (let j = 0; j < s.length; j++) {
				const p = s[j];
				const paramsplit = p.split('=');
				const rel = paramsplit[1].replace(/["']/g, '');
				rels[rel] = href;
			}
		}
		return rels;
	}
}