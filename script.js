import {MastodonAPI} from "./modules/MastodonAPI/MastodonAPI.js";
import {MastoAuthForm} from "./modules/MastoAuthForm/MastoAuthForm.js";
import {ListSelect} from "./modules/ListSelect/ListSelect.js"
import {AccountMultiselect} from "./modules/AccountMultiselect/AccountMultiselect.js";

/**
 * @type {MastoAuthForm}
 */
const mastoAuthForm = document.querySelector('[is=masto-auth-form]');

/**
 * @type {ListSelect}
 */
const listSelect = document.querySelector('[is=list-select]');

/**
 * @type {AccountMultiselect}
 */
const accountMultiselect = document.querySelector('account-multiselect')

const hasToken = await mastoAuthForm.getToken();
if (hasToken) {
	const fetchButton = document.querySelector('button[name=fetch]');
	fetchButton.style = "display:initial;";

	const mastoOAuth = mastoAuthForm.getMastOAuth();
	const mastoAPI = new MastodonAPI(mastoOAuth);
	fetchButton.addEventListener("click", async () => {
		await mastoAPI.setUserID();
		const followings = await mastoAPI.fetchFollowings();
		console.log('Following:', followings);
		const lists = await mastoAPI.fetchLists(followings);
		listSelect.lists = lists;
		console.log('Lists:', lists);
		accountMultiselect.accounts = lists.values().next().value;
	});
	mastoAuthForm.addEventListener(MastoAuthForm.CLEAR_EVENT, () => fetchButton.style = "display:none;");
}

