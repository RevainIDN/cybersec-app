import { useState } from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';

export const usePasswordImprovement = (initialPassword: string) => {
	const [improvedPassword, setImprovedPassword] = useState<string | null>(null);

	const improvePassword = (password: string): string => {
		if (!password) return '';

		const result: ZXCVBNResult = zxcvbn(password);
		let improved = password;

		// Покращуємо лише якщо score < 3
		if (result.score < 3) {
			// Зберігаємо оригінальний пароль як основу
			improved = password;

			// Додаємо велику літеру, якщо її немає (змінюємо першу, якщо вже є)
			if (!/[A-Z]/.test(improved)) {
				improved = improved.charAt(0).toUpperCase() + improved.slice(1);
			} else if (improved.charAt(0) === improved.charAt(0).toLowerCase()) {
				improved = improved.charAt(0).toUpperCase() + improved.slice(1);
			}

			// Випадкова заміна 1-2 літер на символи (обмежена кількість)
			const lettersToReplace = ['i', 'o', 'a', 'e', 's']; // Літер, які можна замінити
			const replacements = {
				'i': '1',
				'o': '@',
				'a': '@',
				'e': '3',
				's': '$'
			};
			const chars = improved.split('');
			let replaceCount = Math.floor(Math.random() * 2) + 1; // 1 або 2 заміни
			for (let i = 0; i < chars.length && replaceCount > 0; i++) {
				if (lettersToReplace.includes(chars[i].toLowerCase())) {
					chars[i] = replacements[chars[i].toLowerCase() as keyof typeof replacements] || chars[i];
					replaceCount--;
				}
			}
			improved = chars.join('');

			// Додаємо символ, якщо його немає (крім тих, що додані заміною)
			if (!/[!@#$%^&*]/.test(password) && !/[!@#$%^&*]/.test(improved.slice(password.length))) {
				improved += '!';
			}

			// Додаємо цифри (по 1 на початку та в кінці, якщо їх менше 2)
			const digitCount = (improved.match(/\d/g) || []).length;
			if (digitCount < 2) {
				improved = '1' + improved + '2';
			} else if (digitCount === 1) {
				improved += '2';
			}

			// Довжина не менше 12 символів (додаємо літери чи символи, якщо потрібно)
			if (improved.length < 12) {
				const extraChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';
				while (improved.length < 12) {
					improved += extraChars.charAt(Math.floor(Math.random() * extraChars.length));
				}
			}
		}

		return improved;
	};

	const handleImprove = () => {
		const newImprovedPassword = improvePassword(initialPassword);
		setImprovedPassword(newImprovedPassword);
		return newImprovedPassword; // Повертаємо для синхронного використання
	};

	return { improvedPassword, handleImprove };
};