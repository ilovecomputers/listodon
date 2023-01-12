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
	 * @param {string} mastoURLString instance url
	 */
	async authorize(mastoURLString) {
		const appsURL = new URL(mastoURLString);
		appsURL.pathname = "/api/v1/apps";
		const scopes = "read:accounts read:lists write:lists";
		const appsBody = {
			client_name: "Listodon",
			redirect_uris: MastodonOAuth.#REDIRECT_URL,
			website: MastodonOAuth.#REDIRECT_URL,
			scopes: scopes
		};
		const response = await FetchUtil.post(appsURL, appsBody);
		const data = await response.json();
		if (!data) {
			return;
		}

		this.#setURL(mastoURLString);
		this.#setClientID(data.client_id);
		this.#setClientSecret(data.client_secret);
		const redirectURL = new URL(mastoURLString);
		redirectURL.pathname = "/oauth/authorize";
		redirectURL.searchParams.set('client_id', this.#clientID);
		redirectURL.searchParams.set('redirect_uri', MastodonOAuth.#REDIRECT_URL);
		redirectURL.searchParams.set('response_type', 'code');
		redirectURL.searchParams.set('scope', scopes);
		window.location.href = redirectURL.toString();
	}

	async getTokenOnRedirect() {
		if (!this.isRedirected()) {
			return;
		}

		const code = new URL(window.location).searchParams.get('code');
		const tokenURL = new URL(this.#mastoURL);
		tokenURL.pathname = "/oauth/token";
		const tokenBody = {
			client_id: this.#clientID,
			client_secret: this.#clientSecret,
			redirect_uri: MastodonOAuth.#REDIRECT_URL,
			grant_type: "authorization_code",
			code: code
		};
		const response = await FetchUtil.post(tokenURL, tokenBody);
		const data = await response.json();
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
		localStorage.setItem(MastodonOAuth.#URL_LOCALSTORAGE_KEY, this.#mastoURL.toString());
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