import { TFunction } from "i18next";

export function timeAgo(timestamp: number, t: TFunction): string {
	const now = Math.floor(Date.now() / 1000);
	const diff = now - timestamp;

	if (diff < 60) return `${diff} ${t('utils.timeAgo.seconds')}`;
	if (diff < 3600) return `${Math.floor(diff / 60)} ${t('utils.timeAgo.minutes')}`;
	if (diff < 86400) return `${Math.floor(diff / 3600)} ${t('utils.timeAgo.hours')}`;
	if (diff < 604800) return `${Math.floor(diff / 86400)} ${t('utils.timeAgo.days')}`;
	if (diff < 2592000) return `${Math.floor(diff / 604800)} ${t('utils.timeAgo.weeks')}`;
	if (diff < 31536000) return `${Math.floor(diff / 2592000)} ${t('utils.timeAgo.months')}`;

	const years = Math.floor(diff / 31536000);
	return years === 1 ? `${years} ${t('utils.timeAgo.years1')}` : `${years} ${t('utils.timeAgo.years2')}`;
}