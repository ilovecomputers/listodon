export class FetchUtil {

	//TODO: use Fetch instead of xhr
	static post(url, args, done) {
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var data = xhr.response;
				done(data);
			}
		}
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.responseType = "json";
		var postData = FetchUtil.#makePostData(args);
		xhr.send(postData);
	}

	static #makePostData(args) {
		var data = [];
		Object.keys(args).forEach(function (key) {
			data.push(encodeURIComponent(key) + '=' + encodeURIComponent(args[key]));
		});
		return data.join('&').replace(/%20/g, '+');
	}

	static get(url, done) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				var data = JSON.parse(request.responseText);
				done(data);
			} else {
				console.log("Error with get request");
			}
		};

		request.onerror = function () {
			// There was a connection error of some sort
		};

		request.send();
	}
}