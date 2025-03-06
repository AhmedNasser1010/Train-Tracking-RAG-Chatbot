export default function afterThinkTagText(text: string): {
	matched: boolean;
	afterTag: null | string;
	beforeTag: null | string;
	error: null | string;
} {

	const regex = /<\/think>\s*(.*)/s;
	const match = text.match(regex);

	if (match === null && text.length) {
		return {
			matched: true,
			afterTag: text,
			beforeTag: text,
			warning: "No message found after </think>, but got clear text",
			error: null
		}
	}

	if (!match && !match[1]) {
		return {
			matched: false,
			afterTag: null,
			beforeTag: null,
			error: "No message found after </think>"
		}
	}

	return {
		matched: true,
		afterTag: match[1],
		beforeTag: match[0],
		error: null
	}
}