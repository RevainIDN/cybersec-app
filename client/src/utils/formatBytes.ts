export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 B';

	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const value = (bytes / Math.pow(1024, i)).toFixed(decimals);

	return `${value} ${sizes[i]}`;
}