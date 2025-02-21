// Функция копирования пароля в буфер обмена
export const copyToClipboard = (text: string, callback: () => void) => {
	navigator.clipboard.writeText(text).then(() => {
		callback();
	});
};