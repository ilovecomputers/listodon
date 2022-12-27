import {FetchUtil} from '../FetchUtil/FetchUtil.js';

export class MastodonOAuth {

	static #URL_LOCALSTORAGE_KEY = "MASTODON_URL";
	static #ID_LOCALSTORAGE_KEY = "MASTODON_CLIENT_ID";
	static #SECRET_LOCALSTORAGE_KEY = "MASTODON_CLIENT_SECRET";
	static #USER_LOCALSTORAGE_KEY = "MASTODON_USER";
	static #ACCESS_TOKEN_LOCALSTORAGE_KEY = "MASTODON_ACCESS_TOKEN";
	static #REDIRECT_URL = "https://listodon.glitch.me/";

	/**
	 * @type {string}
	 */
	#mastoURL;

	/**
	 * @type {string}
	 */
	#clientID;

	/**
	 * @type {string}
	 */
	#clientSecret;

	/**
	 * @type {string}
	 */
	#userID;

	/**
	 * @type {string}
	 */
	#accessToken;


	constructor() {
		this.#mastoURL = localStorage.getItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY);
		this.#clientID = localStorage.getItem(MastodonOAuth.#ID_LOCALSTORAGE_KEY);
		this.#clientSecret = localStorage.getItem(MastodonOAuth.#SECRET_LOCALSTORAGE_KEY);
		this.#userID = localStorage.getItem(MastodonOAuth.#USER_LOCALSTORAGE_KEY);
		this.#accessToken = localStorage.getItem(MastodonOAuth.#ACCESS_TOKEN_LOCALSTORAGE_KEY);
	}

	/**
	 * Register app and redirect user to ask them for authorization
	 * @param {string} mastoURL instance url of this format https://example.com (no ending '/')
	 */
	async authorize(mastoURL) {
		const appsURL = mastoURL + "/api/v1/apps";
		const scopes = "read:accounts read:lists write:lists";
		const args = {
			client_name: "Listodon",
			redirect_uris: MastodonOAuth.#REDIRECT_URL,
			website: MastodonOAuth.#REDIRECT_URL,
			scopes: scopes
		};
		const data = await FetchUtil.post(appsURL, args);
		if (!data) {
			return;
		}

		this.#mastoURL = mastoURL;
		localStorage.setItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY, this.#mastoURL);
		this.#clientID = data.client_id;
		localStorage.setItem(MastodonOAuth.#ID_LOCALSTORAGE_KEY, this.#clientID);
		this.#clientSecret = data.client_secret;
		localStorage.setItem(MastodonOAuth.#SECRET_LOCALSTORAGE_KEY, this.#clientSecret);
		window.location.href = mastoURL + "/oauth/authorize?client_id=" + this.#clientID + "&redirect_uri="
				+ MastodonOAuth.#REDIRECT_URL + "&response_type=code&scope=" + scopes;
	}

	async getTokenOnRedirect() {
		if (!this.isRedirected()) {
			return;
		}

		const code = window.location.href.replace(
				window.location.origin + window.location.pathname + "?code=",
				""
		);
		const url2 = this.#mastoURL + "/oauth/token";
		const args2 = {
			client_id: this.#clientID,
			client_secret: this.#clientSecret,
			redirect_uri: MastodonOAuth.#REDIRECT_URL,
			grant_type: "authorization_code",
			code: code
		};
		const data = await FetchUtil.post(url2, args2);
		if (!data) {
			return;
		}

		localStorage.setItem("MASTODON_ACCESS_TOKEN", data.access_token);

		const user = await FetchUtil.get(
				localStorage.getItem("MASTODON_URL")
				+ "/api/v1/accounts/verify_credentials/?access_token="
				+ localStorage.getItem("MASTODON_ACCESS_TOKEN")
		);
		if (!user) {
			return;
		}

		localStorage.setItem("MASTODON_USER", user.id);
	}

	isRedirected() {
		return window.location.href.indexOf("?code=") !== -1 && this.isAuthorized();
	}

	isAuthorized() {
		return !!this.#mastoURL
				&& !!this.#clientID
				&& !!this.#clientSecret;
	}

	clearStoredFields() {
		this.#userID = undefined;
		localStorage.removeItem(MastodonOAuth.#USER_LOCALSTORAGE_KEY);
		this.#mastoURL = undefined;
		localStorage.removeItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY);
		this.#accessToken = undefined;
		localStorage.removeItem(MastodonOAuth.#ACCESS_TOKEN_LOCALSTORAGE_KEY);
		this.#clientID = undefined;
		localStorage.removeItem(MastodonOAuth.#ID_LOCALSTORAGE_KEY);
		this.#clientSecret = undefined;
		localStorage.removeItem(MastodonOAuth.#SECRET_LOCALSTORAGE_KEY);
	}

	getAccessToken() {
		return this.#accessToken;
	}
}