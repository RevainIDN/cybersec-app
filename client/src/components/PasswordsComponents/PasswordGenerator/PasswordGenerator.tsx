import './PasswordGenerator.css'
import { useState } from 'react';
import { passwordGeneratorValues, passwordCharacterSet } from './passwordGeneratorHeplers';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { setListGeneratedPasswords } from '../../../store/passwordsSlice';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import SettingCheckbox from './SettingsCheckbox/SettingsCheckbox';

export default function PasswordGenerator() {
	const dispatch = useDispatch<AppDispatch>()

	const { t } = useTranslation();

	// Локальные логические состояния
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [passwordLength, setPasswordLength] = useState<number>(8);
	const [passwordQuantity, setPasswordQuantity] = useState<number>(1);
	const [generatedPassword, setGeneratedPassword] = useState<string>('');

	// Локальные состояния анимаций
	const [rotation, setRotation] = useState(0);
	const [isCopiedPassword, setIsCopiedPassword] = useState<boolean>(false);

	// Обработчик настроек пароля
	const handlePasswordSettings = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
		setSelectedOptions((prev) =>
			e.target.checked ? [...prev, value] : prev.filter((opt) => opt !== value)
		);
	};

	// Обработчик длины пароля
	const handleChangeLength = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = Number(e.target.value);
		if (value > 32) value = 32;
		if (value < 4) value = 4;
		setPasswordLength(value);
	}

	// Обработчик количества паролей
	const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = Number(e.target.value);
		if (value > 20) value = 20;
		if (value < 1) value = 1;
		setPasswordQuantity(value);
	}

	// Функция генерации пароля/паролей
	const generatePassword = () => {
		setRotation((prev) => prev + 360);
		let characters = '';

		if (selectedOptions.includes('uppercaseLetters')) characters += passwordCharacterSet.upperLetters;
		if (selectedOptions.includes('lowercaseLetters')) characters += passwordCharacterSet.lowerLetters;
		if (selectedOptions.includes('numbers')) characters += passwordCharacterSet.numbers;
		if (selectedOptions.includes('symbols')) characters += passwordCharacterSet.symbols;

		if (!characters) return;

		const generateSinglePassword = () => {
			let password = '';
			for (let i = 0; i < passwordLength; i++) {
				const randomIndex = Math.floor(Math.random() * characters.length);
				password += characters[randomIndex];
			}
			return password;
		};

		const firstPassword = generateSinglePassword();
		const passwords = [];

		for (let i = 1; i < passwordQuantity; i++) {
			passwords.push(generateSinglePassword());
		}

		setGeneratedPassword(firstPassword);
		dispatch(setListGeneratedPasswords(passwords));
	};

	// Обработчик копирования пароля в буфер обмена
	const handleCopyPassword = () => {
		if (generatedPassword) {
			copyToClipboard(generatedPassword, () => setIsCopiedPassword(true));
			setTimeout(() => setIsCopiedPassword(false), 1000);
		}
	};

	return (
		<div className='password-generator'>
			<h1 className='password-generator-title'>{t('passwordPage.PasswordGenerator.userPasswords')}</h1>
			<div className='generate-input-cont'>
				<input
					className='passwords-input generate-input'
					type="text"
					readOnly
					maxLength={32}
					value={generatedPassword} />
				<button
					className='generate-btn btn-generate'
					onClick={generatePassword}>
					<img
						className='generate-img'
						src="passwords/generate.svg"
						alt="generate"
						style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 1s ease' }} />
				</button>
				<button
					className={`generate-btn btn-copy ${isCopiedPassword ? 'copied-password--visible' : ''}`}
					onClick={handleCopyPassword}>
					<img
						className='copy-img'
						src="passwords/copy.svg"
						alt="copy" />
				</button>
			</div>
			<div className='generate-settings'>
				<h2 className='password-generator-title'>{t('passwordPage.PasswordGenerator.passwordLength')}</h2>
				<div className='setting-range-cont'>
					<input
						className='setting-range-value'
						type="number"
						min={4} max={32} maxLength={2}
						value={passwordLength}
						onChange={handleChangeLength} />
					<input
						className='setting-range'
						type="range"
						min={4} max={32}
						value={passwordLength}
						onChange={handleChangeLength} />
				</div>
				<h2 className='password-generator-title'>{t('passwordPage.PasswordGenerator.passwordQuantity')}</h2>
				<div className='setting-range-cont'>
					<input
						className='setting-range-value'
						type="number"
						min={1} max={20} maxLength={2}
						value={passwordQuantity}
						onChange={handleChangeQuantity} />
					<input
						className='setting-range'
						type="range"
						min={1} max={20}
						value={passwordQuantity}
						onChange={handleChangeQuantity} />
				</div>
				<ul className='settings-list'>
					{passwordGeneratorValues.map((value, key) => (
						<SettingCheckbox
							key={key}
							checked={selectedOptions.includes(value)}
							onChange={(e) => handlePasswordSettings(e, value)}
							label={t(`passwordPage.PasswordGenerator.${value}`)}
						/>
					))}
				</ul>
			</div>
		</div>
	)
}