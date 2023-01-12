export class FetchUtil {

	/**
	 * @param {string|URL} url
	 * @param {Object} body
	 * @returns {Promise<Response>}
	 */
	static async post(url, body) {
		return FetchUtil.#fetchResponse(url, {
			method: 'POST',
			headers: {
				'Content-Type': "application/json"
			},
			body: JSON.stringify(body)
		});
	}

	/**
	 * @param {string|URL} url
	 * @returns {Promise<Response>}
	 */
	static async get(url) {
		return FetchUtil.#fetchResponse(url);
	}

	/**
	 * @param {string|URL} url
	 * @param {RequestInit} [init]
	 * @returns {Promise<Response>}
	 */
	static async #fetchResponse(url, init) {
		let response;
		try {
			response = await fetch(url, init);
		} catch (error) {
			error.message = "There was a connection error of some sort" + error.message
			throw error
		}

		if (!response.ok) {
			throw new Error("Error with get request")
		}

		return response;
	}
}