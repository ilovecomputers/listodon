export class FetchUtil {

	static async post(url, args) {
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': "application/json"
				},
				body: JSON.stringify(args)
			});
			if (response.ok) {
				return response.json();
			}
		} catch (error) {
			console.log("There was a connection error of some sort", error);
		}
	}

	/**
	 * These TODOs apply to post as well
	 * TODO: return response so {@link MastodonAPI#fetchFollowings} can use this method
	 * TODO: throw error if response is not ok
	 * @param {string|URL} url
	 * @returns {Promise<Object>}
	 */
	static async get(url) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return response.json();
			} else {
				console.log("Error with get request");
			}
		} catch (error) {
			console.log("There was a connection error of some sort", error);
		}
	}
}