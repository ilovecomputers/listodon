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
	 * These TODOs apply to post as well
	 * @param {string|URL} url
	 * @returns {Promise<Response>}
	 */
	static async get(url) {
		return FetchUtil.#fetchResponse(url);
	}

	/**
	 * TODO: throw error if response is not ok
	 * @param {string|URL} url
	 * @param {RequestInit} [init]
	 * @returns {Promise<Response>}
	 */
	static async #fetchResponse(url, init) {
		try {
			const response = await fetch(url, init);
			if (!response.ok) {
				console.log("Error with get request");
			}

			return response;
		} catch (error) {
			console.log("There was a connection error of some sort", error);
		}
	}
}