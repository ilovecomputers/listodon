import {ACCOUNTS, getRandomInt} from "../AccountItem/mock.js";

const lists = ['Artists', 'Scientists', 'Writers', 'Programmers', 'Designers'];

//TODO: move to RandomUtil class
function getArrayOfRandomItems(sourceArray, numberOfItems) {
	const copyToSplice = [...sourceArray];
	const result = [];
	for (let index = 0; index < numberOfItems; index++) {
		result.push(copyToSplice.splice(getRandomInt(0, copyToSplice.length - 1), 1)[0]);
	}
	return result;
}

/**
 * @type {ListWithAccounts}
 */
export const LIST_WITH_ACCOUNTS = new Map(lists.map((list, index) => {
	const accountsInList = getArrayOfRandomItems(ACCOUNTS, getRandomInt(1, ACCOUNTS.length / 2));
	return [{id: list.toLowerCase(), title: list}, accountsInList];
}));

