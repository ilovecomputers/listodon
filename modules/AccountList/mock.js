import {RandomUtil} from "../RandomUtil/RandomUtil.js";
import {ACCOUNTS} from "../AccountMultiselect/mock.js";

const lists = ['Artists', 'Scientists', 'Writers', 'Programmers', 'Designers'];

/**
 * @type {ListWithAccounts}
 */
export const LIST_WITH_ACCOUNTS = new Map(lists.map((list, index) => {
	const accountsInList = RandomUtil.getArrayOfRandomItems(ACCOUNTS, RandomUtil.getRandomInt(1, ACCOUNTS.length / 2));
	return [{id: list.toLowerCase(), title: list}, accountsInList];
}));

