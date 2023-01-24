import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";
import {MastoAuthForm} from "./modules/MastoAuthForm/MastoAuthForm.js";
import {ListSelect} from "./modules/ListSelect/ListSelect.js"

/**
 * @type {MastoAuthForm}
 */
const mastoAuthForm = document.querySelector('[is=masto-auth-form]');

/**
 * @type {ListSelect}
 */
const listSelect = document.querySelector('[is=list-select]');

const hasToken = await mastoAuthForm.getToken();
if (hasToken) {
	const fetchButton = document.querySelector('button[name=fetch]');
	fetchButton.style = "display:initial;";

	const mastoOAuth = mastoAuthForm.getMastOAuth();
	const mastoAPI = new MastodonAPI(mastoOAuth);
	fetchButton.addEventListener("click", async () => {
		await mastoAPI.getUserID();
		const followings = await mastoAPI.fetchFollowings();
		console.log('Following:', followings);
		const lists = await mastoAPI.fetchLists();
		listSelect.lists = lists;
		console.log('Lists:', lists);
	});
	mastoAuthForm.addEventListener(MastoAuthForm.CLEAR_EVENT, () => fetchButton.style = "display:none;");
}

