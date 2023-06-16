/**
 * @type {Account}
 */
export const ACCOUNT = {
	acct: 'foo@bar.com',
	avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cadbury-Bournville.jpg/320px-Cadbury-Bournville.jpg',
	display_name: 'Foo Bar 🍫'
};

const attributes = ['Strong', 'Brave', 'Intelligent', 'Creative', 'Kind', 'Energetic', 'Honest', 'Ambitious', 'Confident', 'Patient'];
const nouns = ['Cat', 'Dog', 'Tree', 'Mountain', 'Ocean', 'Book', 'Car', 'Computer', 'Phone', 'Sun'];
const emojis = ['👾', '🦖', '🧠', '🦠', '🧪', '🕳️', '🧸', '🦄', '👻', '🔬'];

/**
 * @type {Array<Account>}
 */
export const ACCOUNTS = [...Array(20).keys()].map((account, index) => {
	const firstName = attributes[getRandomInt(0, attributes.length)];
	const secondName = nouns[getRandomInt(0, nouns.length)];
	return {
		...ACCOUNT,
		acct: `${firstName.toLowerCase()}${secondName.toLowerCase()}@example.com`,
		avatar: `https://picsum.photos/seed/${index+1}/200`,
		display_name: `${firstName} ${secondName} ${emojis[getRandomInt(0, emojis.length)]}`
	};
});

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}