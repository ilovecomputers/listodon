export class MastodonAPI {
	static fetchFollowings(url, done) {
		let api_url = url + "&access_token=" + localStorage.getItem("MASTODON_ACCESS_TOKEN");

		const request = new XMLHttpRequest();
		request.open('GET', api_url, true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				const data = JSON.parse(request.responseText);
				done(data);

				let next = (MastodonAPI.parseLinkHeader(request.getResponseHeader('Link'))['next']);
				if (next) {
					MastodonAPI.fetchFollowings(next, done);
				}

			} else {
				console.log("Error with " + url + " request");
			}
		};

		request.onerror = function () {
			// There was a connection error of some sort

		};
		request.send();
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
	static parseLinkHeader(header) {
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