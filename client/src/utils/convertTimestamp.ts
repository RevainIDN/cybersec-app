export const convertTimestamp = (timestamp: number) => {
	const date = new Date(timestamp * 1000);
	return date.toISOString().replace('T', ' ').split('.')[0] + ' UTC';
};