function makePostData(args) {
	var data = [];
	Object.keys(args).forEach(function (key) {
		data.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
	});
	return data.join('&').replace(/%20/g, '+');
}

function post(url, args, done) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var data = xhr.response;
			done(data);
		}
	}
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.responseType = "json";
	var postData = makePostData(args);
	xhr.send(postData);
}

function get(url, done) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);

	request.onload = function () {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText);
			done(data);
		} else {
			console.log("Error with get request");
		}
	};

	request.onerror = function () {
		// There was a connection error of some sort
	};

	request.send();
}

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

document.addEventListener("DOMContentLoaded", function (event) {
	var redirect_uri = "https://listodon.glitch.me/";
	var mastodon_url = localStorage.getItem("MASTODON_URL");
	var client_id = localStorage.getItem("MASTODON_CLIENT_ID");
	var client_secret = localStorage.getItem("MASTODON_CLIENT_SECRET");

	// redirected
	if (window.location.href.indexOf("?code=") !== -1 && !!mastodon_url && !!client_id && !!client_secret) {
		document.querySelector("input").value = mastodon_url;

		var code = window.location.href.replace(window.location.origin + window.location.pathname + "?code=", "");
		var url2 = mastodon_url + "/oauth/token";
		var args2 = {
			client_id: client_id,
			client_secret: client_secret,
			redirect_uri: redirect_uri,
			grant_type: "authorization_code",
			code: code
		};
		post(url2, args2, data => {
			localStorage.setItem("MASTODON_ACCESS_TOKEN", data.access_token);
			get(localStorage.getItem("MASTODON_URL") + "/api/v1/accounts/verify_credentials/?access_token=" + localStorage.getItem("MASTODON_ACCESS_TOKEN"), (user) => {
				localStorage.setItem("MASTODON_USER", user.id);
			});
		})
	}

	// authorized
	if (mastodon_url) {
		document.querySelector("input").value = localStorage.getItem("MASTODON_URL");
		document.querySelector("button[name=fetch]").style = "display:initial;";
		document.querySelector("button[type=submit]").style = "display:none;";
		document.querySelector("button[name=clear]").style = "display:initial;";
	}


	document.querySelector("form").addEventListener("submit", event => {
		event.preventDefault();
		let inputElement = document.querySelector("input");
		var url = inputElement.value.replace(/\/$/, '') + "/api/v1/apps";
		var scopes = "read:follows read:lists write:lists";
		var args = {
			client_name: "Listodon",
			redirect_uris: redirect_uri,
			website: redirect_uri,
			scopes: scopes
		};
		post(url, args, data => {
			localStorage.setItem("MASTODON_URL", inputElement.value.replace(/\/$/, ''));
			localStorage.setItem("MASTODON_CLIENT_ID", data.client_id);
			localStorage.setItem("MASTODON_CLIENT_SECRET", data.client_secret);
			var redirectLink = inputElement.value + "/oauth/authorize?client_id=" + data.client_id + "&redirect_uri=" + redirect_uri + "&response_type=code&scope=" + scopes;
			window.location.href = redirectLink;
		});
	});

	let clearButtonElement = document.querySelector("button[name=clear]");
	clearButtonElement.addEventListener("click", () => {
		document.querySelector("input").value = "";
		document.querySelector("button[type=submit]").style = "display:initial;";
		clearButtonElement.style = "display:none;";
		localStorage.removeItem("MASTODON_USER");
		localStorage.removeItem("MASTODON_URL");
		localStorage.removeItem("MASTODON_ACCESS_TOKEN");
		localStorage.removeItem("MASTODON_CLIENT_ID");
		localStorage.removeItem("MASTODON_CLIENT_SECRET");
	});

	document.querySelector('button[name=fetch]').addEventListener("click", () => {
		let url = localStorage.getItem("MASTODON_URL") + "/api/v1/accounts/" + localStorage.getItem("MASTODON_USER") + "/following?limit=80";
		fetch_followings(url, (follows) => {
			console.log('Follows', follows)
		});
	});
});