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