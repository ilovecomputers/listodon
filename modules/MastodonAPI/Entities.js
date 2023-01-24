/**
 * This is just a typedef file for specifying the shape of the entities in the Mastodon API
 */

class Account {
	/**
	 * not guaranteed to be a number
	 * @type {string}
	 */
	id;
	/**
	 * @type {string}
	 */
	username;
	/**
	 * The Webfinger account URI. Equal to username for local users, or username@domain for remote users.
	 * @type {string}
	 */
	acct;
	/**
	 * @type {string}
	 */
	display_name;
	/**
	 * @type {string}
	 */
	avatar;
	/**
	 * Custom emoji entities to be used when rendering the profile.
	 * @type {Array.<CustomEmoji>}
	 */
	emojis;
}

class CustomEmoji {
	/**
	 * The name of the custom emoji.
	 * e.g. "blobaww"
	 * @type {string}
	 */
	shortcode;
	/**
	 * An image link to the custom emoji
	 * @type {string}
	 */
	url;
}

class List {
	id;
	title;
}