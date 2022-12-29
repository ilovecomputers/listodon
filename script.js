import {MastodonOAuth} from './modules/MastodonOAuth/MastodonOAuth.js'
import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";

const mastoOAuth = new MastodonOAuth();
const mastoAPI = new MastodonAPI(mastoOAuth);

if (mastoOAuth.isRedirected()) {
	document.querySelector("input").value = mastoOAuth.getURL();
}
await mastoOAuth.getTokenOnRedirect();

if (mastoOAuth.isAuthorized()) {
	document.querySelector("input").value = mastoOAuth.getURL();
	document.querySelector("button[name=fetch]").style = "display:initial;";
	document.querySelector("button[type=submit]").style = "display:none;";
	document.querySelector("button[name=clear]").style = "display:initial;";
}


//TODO: create custom element of OAuth form
document.querySelector("form").addEventListener("submit", async event => {
	event.preventDefault();
	const mastoURL = document.querySelector("input").value.replace(/\/$/, '');
	await mastoOAuth.authorize(mastoURL);
});

let clearButtonElement = document.querySelector("button[name=clear]");
clearButtonElement.addEventListener("click", () => {
	document.querySelector("input").value = "";
	document.querySelector("button[type=submit]").style = "display:initial;";
	clearButtonElement.style = "display:none;";
	mastoOAuth.clearStoredFields();
});

document.querySelector('button[name=fetch]').addEventListener("click", async () => {
	let url = mastoOAuth.getURL() + "/api/v1/accounts/" + mastoOAuth.getUser() + "/following?limit=80";
	const followings = await mastoAPI.fetchFollowings(url);
	console.log('Following:', followings)
});
