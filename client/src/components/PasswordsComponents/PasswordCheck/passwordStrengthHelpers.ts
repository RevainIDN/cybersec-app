export const passwordStrengthStyles = [
	{ boxShadow: "0 0 5px red, 0 0 20px 5px #f73f29", outline: "2px #f73f29 solid" },
	{ boxShadow: "0 0 5px orange, 0 0 20px 5px #ff9938", outline: "2px #ff9938 solid" },
	{ boxShadow: "0 0 5px yellow, 0 0 20px 5px yellow", outline: "2px yellow solid" },
	{ boxShadow: "0 0 5px lightgreen, 0 0 20px 5px #99c92a", outline: "2px #99c92a solid" },
	{ boxShadow: "0 0 5px green, 0 0 20px 5px #58b44e", outline: "2px #58b44e solid" },
	{ boxShadow: "", outline: "" }
];

export const getTranslatedCrackTime = (time: string | number) => {
	const timeStr = typeof time === 'number' ? time.toString() : time;

	if (!timeStr) return '';

	return timeStr
		.replace(/(\d+)\s*minute(s)?/, (p1, p2) => `${p1} ${p2 ? 'minutes' : 'minute'}`)
		.replace(/(\d+)\s*hour(s)?/, (p1, p2) => `${p1} ${p2 ? 'hours' : 'hour'}`)
		.replace(/(\d+)\s*day(s)?/, (p1, p2) => `${p1} ${p2 ? 'days' : 'day'}`)
		.replace(/(\d+)\s*week(s)?/, (p1, p2) => `${p1} ${p2 ? 'weeks' : 'week'}`)
		.replace(/(\d+)\s*month(s)?/, (p1, p2) => `${p1} ${p2 ? 'months' : 'month'}`)
		.replace(/(\d+)\s*year(s)?/, (p1, p2) => `${p1} ${p2 ? 'years' : 'year'}`)
		.replace(/(\d+)\s*centur(y)?(ies)?/, (p1, p2) => `${p1} ${p2 ? 'centuries' : 'century'}`);
};