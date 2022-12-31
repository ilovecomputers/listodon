import {FetchUtil} from '../FetchUtil/FetchUtil.js';

export class MastodonOAuth {

	static #URL_LOCALSTORAGE_KEY = "MASTODON_URL";
	static #ID_LOCALSTORAGE_KEY = "MASTODON_CLIENT_ID";
	static #SECRET_LOCALSTORAGE_KEY = "MASTODON_CLIENT_SECRET";
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
	#accessToken;


	constructor() {
		this.#mastoURL = localStorage.getItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY);
		this.#clientID = localStorage.getItem(MastodonOAuth.#ID_LOCALSTORAGE_KEY);
		this.#clientSecret = localStorage.getItem(MastodonOAuth.#SECRET_LOCALSTORAGE_KEY);
		this.#accessToken = localStorage.getItem(MastodonOAuth.#ACCESS_TOKEN_LOCALSTORAGE_KEY);
	}

	/**
	 * Register app and redirect user to ask them for authorization
	 * TODO: turn mastoURL into {@link URL}
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

		this.#setURL(mastoURL);
		this.#setClientID(data.client_id);
		this.#setClientSecret(data.client_secret);
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

		this.#setAccessToken(data.access_token);
	}

	isRedirected() {
		return window.location.href.indexOf("?code=") !== -1 && this.isAuthorized();
	}

	isAuthorized() {
		return !!this.#mastoURL
				&& !!this.#clientID
				&& !!this.#clientSecret;
	}

	hasToken() {
		return !!this.#accessToken;
	}

	clearStoredFields() {
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

	#setAccessToken(accessToken) {
		this.#accessToken = accessToken;
		localStorage.setItem("MASTODON_ACCESS_TOKEN", accessToken);
	}

	getURL() {
		return this.#mastoURL;
	}

	#setURL(mastoURL) {
		this.#mastoURL = mastoURL;
		localStorage.setItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY, this.#mastoURL);
	}

	#setClientID(clientID) {
		this.#clientID = clientID;
		localStorage.setItem(MastodonOAuth.#ID_LOCALSTORAGE_KEY, this.#clientID);
	}

	#setClientSecret(clientSecret) {
		this.#clientSecret = clientSecret;
		localStorage.setItem(MastodonOAuth.#SECRET_LOCALSTORAGE_KEY, this.#clientSecret);
	}
}