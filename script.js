import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";
import {MastoAuthForm} from "./modules/MastoAuthForm/MastoAuthForm.js";

customElements.define('masto-auth-form', MastoAuthForm, {extends: 'form'});

/**
 * @type {MastoAuthForm}
 */
const mastoAuthForm = document.querySelector('[is=masto-auth-form]');

const hasToken = await mastoAuthForm.getToken();
if (hasToken) {
	const fetchFollowersButton = document.querySelector('button[name=fetch]');
	fetchFollowersButton.style = "display:initial;";

	const mastoOAuth = mastoAuthForm.getMastOAuth();
	const mastoAPI = new MastodonAPI(mastoOAuth);
	fetchFollowersButton.addEventListener("click", async () => {
		await mastoAPI.getUserID();
		const followings = await mastoAPI.fetchFollowings();
		console.log('Following:', followings)
	});
	mastoAuthForm.addEventListener(MastoAuthForm.CLEAR_EVENT, () => fetchFollowersButton.style = "display:none;");
}

