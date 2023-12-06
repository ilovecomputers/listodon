export class RandomUtil {
	static getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
	}

	static getArrayOfRandomItems(sourceArray, numberOfItems) {
		const copyToSplice = [...sourceArray];
		const result = [];
		for (let index = 0; index < numberOfItems; index++) {
			result.push(copyToSplice.splice(RandomUtil.getRandomInt(0, copyToSplice.length - 1), 1)[0]);
		}
		return result;
	}
}