export class MastodonAPI {

	/**
	 * @type MastodonOAuth
	 */
	#mastoOAuth;


	constructor(mastoOAuth) {
		this.#mastoOAuth = mastoOAuth;
	}

	async fetchFollowings(url) {
		let apiURL = url + "&access_token=" + this.#mastoOAuth.getAccessToken();
		const response = await fetch(apiURL);
		if (response.ok) {
			let followings = await response.json();
			let next = (MastodonAPI.#parseLinkHeader(response.headers.get('link'))['next']);
			if (next) {
				const moreFollowings = await this.fetchFollowings(next);
				if (Array.isArray(moreFollowings)) {
					return followings.concat(moreFollowings);
				}
			}
			return followings;
		} else {
			console.log("Error with " + url + " request");
		}
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