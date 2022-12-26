
// parse a Link header by https://gist.github.com/deiu/9335803
//
// Link:<https://example.org/.meta>; rel=meta
//
// var r = parseLinkHeader(xhr.getResponseHeader('Link');
// r['meta'] outputs https://example.org/.meta
//
function parseLinkHeader(header) {
	if (!header) return "";
	var linkexp = /<[^>]*>\s*(\s*;\s*[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*")))*(,|$)/g;
	var paramexp = /[^\(\)<>@,;:"\/\[\]\?={} \t]+=(([^\(\)<>@,;:"\/\[\]\?={} \t]+)|("[^"]*"))/g;

	var matches = header.match(linkexp);
	var rels = {};
	for (var i = 0; i < matches.length; i++) {
		var split = matches[i].split('>');
		var href = split[0].substring(1);
		var ps = split[1];
		var s = ps.match(paramexp);
		for (var j = 0; j < s.length; j++) {
			var p = s[j];
			var paramsplit = p.split('=');
			var rel = paramsplit[1].replace(/["']/g, '');
			rels[rel] = href;
		}
	}
	return rels;
}

function fetch_followings(url, done) {
	let api_url = url + "&access_token=" + localStorage.getItem("MASTODON_ACCESS_TOKEN");

	var request = new XMLHttpRequest();
	request.open('GET', api_url, true);

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			done(data);

			let next = (parseLinkHeader(request.getResponseHeader('Link'))['next']);
			if (next) {
				fetch_followings(next, done);
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

import {MastodonOAuth} from './modules/MastodonAPI/MastodonOAuth.js'

const mastodonOAuth = new MastodonOAuth();

if (mastodonOAuth.isRedirected()) {
	document.querySelector("input").value = mastodon_url;
}
await mastodonOAuth.getTokenOnRedirect();

if (mastodonOAuth.isAuthorized()) {
	document.querySelector("input").value = localStorage.getItem("MASTODON_URL");
	document.querySelector("button[name=fetch]").style = "display:initial;";
	document.querySelector("button[type=submit]").style = "display:none;";
	document.querySelector("button[name=clear]").style = "display:initial;";
}


document.querySelector("form").addEventListener("submit", async event => {
	event.preventDefault();
	const mastodonURL = document.querySelector("input").value.replace(/\/$/, '');
	await mastodonOAuth.authorize(mastodonURL);
});

let clearButtonElement = document.querySelector("button[name=clear]");
clearButtonElement.addEventListener("click", () => {
	document.querySelector("input").value = "";
	document.querySelector("button[type=submit]").style = "display:initial;";
	clearButtonElement.style = "display:none;";
	mastodonOAuth.clearStoredFields();
});

document.querySelector('button[name=fetch]').addEventListener("click", () => {
	let url = localStorage.getItem("MASTODON_URL") + "/api/v1/accounts/" + localStorage.getItem("MASTODON_USER") + "/following?limit=80";
	fetch_followings(url, (follows) => {
		console.log('Follows', follows)
	});
});
