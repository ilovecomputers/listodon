import {RandomUtil} from "../RandomUtil/RandomUtil.js";
import {ACCOUNT} from "../AccountItem/mock.js";

const attributes = ['Strong', 'Brave', 'Intelligent', 'Creative', 'Kind', 'Energetic', 'Honest', 'Ambitious', 'Confident', 'Patient'];
const nouns = ['Cat', 'Dog', 'Tree', 'Mountain', 'Ocean', 'Book', 'Car', 'Computer', 'Phone', 'Sun'];
const emojis = ['👾', '🦖', '🧠', '🦠', '🧪', '🕳️', '🧸', '🦄', '👻', '🔬'];
/**
 * @type {Array<Account>}
 */
export const ACCOUNTS = [...Array(20).keys()].map((account, index) => {
	const firstName = attributes[RandomUtil.getRandomInt(0, attributes.length)];
	const secondName = nouns[RandomUtil.getRandomInt(0, nouns.length)];
	return {
		...ACCOUNT,
		acct: `${firstName.toLowerCase()}${secondName.toLowerCase()}@example.com`,
		avatar: `https://picsum.photos/seed/${index + 1}/200`,
		display_name: `${firstName} ${secondName} ${emojis[RandomUtil.getRandomInt(0, emojis.length)]}`
	};
});