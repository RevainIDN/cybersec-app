export function timeAgo(timestamp: number): string {
	const now = Math.floor(Date.now() / 1000);
	const diff = now - timestamp;

	if (diff < 60) return `${diff} сек. назад`;
	if (diff < 3600) return `${Math.floor(diff / 60)} мин. назад`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} ч. назад`;
	if (diff < 604800) return `${Math.floor(diff / 86400)} дн. назад`;
	if (diff < 2592000) return `${Math.floor(diff / 604800)} нед. назад`;
	if (diff < 31536000) return `${Math.floor(diff / 2592000)} мес. назад`;

	const years = Math.floor(diff / 31536000);
	return years === 1 ? "год назад" : `${years} л. назад`;
}