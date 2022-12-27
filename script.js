import {MastodonOAuth} from './modules/MastodonOAuth/MastodonOAuth.js'
import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";

const mastodonOAuth = new MastodonOAuth();
const mastodonAPI = new MastodonAPI(mastodonOAuth);

if (mastodonOAuth.isRedirected()) {
	document.querySelector("input").value = localStorage.getItem("MASTODON_URL");
}
await mastodonOAuth.getTokenOnRedirect();

if (mastodonOAuth.isAuthorized()) {
	document.querySelector("input").value = localStorage.getItem("MASTODON_URL");
	document.querySelector("button[name=fetch]").style = "display:initial;";
	document.querySelector("button[type=submit]").style = "display:none;";
	document.querySelector("button[name=clear]").style = "display:initial;";
}


//TODO: create custom element of OAuth form
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

document.querySelector('button[name=fetch]').addEventListener("click", async () => {
	let url = localStorage.getItem("MASTODON_URL") + "/api/v1/accounts/" + localStorage.getItem("MASTODON_USER") + "/following?limit=80";
	const followings = await mastodonAPI.fetchFollowings(url);
	console.log('Following:', followings)
});
