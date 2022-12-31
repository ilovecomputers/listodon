import {MastodonOAuth} from './modules/MastodonOAuth/MastodonOAuth.js'
import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";
import {MastoAuthForm} from "./modules/MastoAuthForm/MastoAuthForm.js";

// TODO: have MastoAuthForm dispatch a MastodonOAuth object when it gets the token
const mastoOAuth = new MastodonOAuth();
const mastoAPI = new MastodonAPI(mastoOAuth);

customElements.define('masto-auth-form', MastoAuthForm, {extends: 'form'});

await document.querySelector('[is=masto-auth-form]').getToken();

document.querySelector('button[name=fetch]').addEventListener("click", async () => {
	let url = mastoOAuth.getURL() + "/api/v1/accounts/" + mastoOAuth.getUser() + "/following?limit=80";
	const followings = await mastoAPI.fetchFollowings(url);
	console.log('Following:', followings)
});
