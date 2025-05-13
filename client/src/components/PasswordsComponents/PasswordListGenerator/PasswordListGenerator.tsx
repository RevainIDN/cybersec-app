import './PasswordListGenerator.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { copyToClipboard } from '../../../utils/copyToClipboard';

export default function PasswordListGenerator() {
	const { t } = useTranslation();

	// Глобальное состояние
	const { listGeneratedPasswords } = useSelector((state: RootState) => state.passwords);
	// Логическое ui состояние
	const [copiedPasswordIndex, setCopiedPasswordIndex] = useState<number | null>(null);

	// Обработчик копирования пароля в буфер обмена
	const handleCopy = (password: string, index: number) => {
		copyToClipboard(password, () => setCopiedPasswordIndex(index));
		setTimeout(() => setCopiedPasswordIndex(null), 1000);
	};

	return (
		<div className='password-list-generator'>
			<h1 className='password-generator-title'>{t('passwordPage.PasswordGenerator.otherPasswords')}</h1>
			<ul className='passwords-list'>
				{listGeneratedPasswords.length < 1 &&
					<p className='password-indication'>{t('passwordPage.PasswordGenerator.indication')}</p>
				}
				{listGeneratedPasswords?.map((password, index) => (
					<li key={index} className='password-item' onClick={() => handleCopy(password, index)}>
						{password}
						<span className={`copied-text ${copiedPasswordIndex === index ? 'visible' : ''}`}>
							{t('passwordPage.PasswordGenerator.copied')}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}