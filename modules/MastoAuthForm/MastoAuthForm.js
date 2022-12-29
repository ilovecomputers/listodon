import {MastodonOAuth} from "../MastodonOAuth/MastodonOAuth.js";

export class MastoAuthForm extends HTMLFormElement {

	/**
	 * @type MastodonOAuth
	 */
	#mastoOAuth;

	/**
	 * @type Element
	 */
	#clearButtonElement;

	constructor() {
		super();
		this.#mastoOAuth = new MastodonOAuth();
		if (this.#mastoOAuth.isRedirected()) {
			this.querySelector("input").value = this.#mastoOAuth.getURL();
		}
		this.#mastoOAuth.getTokenOnRedirect().then(() => {
			if (this.#mastoOAuth.isAuthorized()) {
				this.querySelector("input").value = this.#mastoOAuth.getURL();
				this.querySelector("button[name=fetch]").style = "display:initial;";
				this.querySelector("button[type=submit]").style = "display:none;";
				this.querySelector("button[name=clear]").style = "display:initial;";
			}
		});

		this.addEventListener('submit', this.#authorize);

		this.#clearButtonElement = this.querySelector("button[name=clear]");
		this.#clearButtonElement.addEventListener("click", this.#clear.bind(this));
	}

	async #authorize(event) {
		event.preventDefault();
		const mastoURL = this.querySelector("input").value.replace(/\/$/, '');
		await this.#mastoOAuth.authorize(mastoURL);
	}

	#clear() {
		this.querySelector("input").value = "";
		this.querySelector("button[type=submit]").style = "display:initial;";
		this.#clearButtonElement.style = "display:none;";
		this.#mastoOAuth.clearStoredFields();
	}
}