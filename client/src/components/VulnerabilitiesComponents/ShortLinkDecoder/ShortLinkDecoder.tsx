import './ShortLinkDecoder.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchExpandShortUrl } from '../../../services/VulnerabilitiesApi/leakCheckRequests';
import { copyToClipboard } from '../../../utils/copyToClipboard';

export default function ShortLinkDecoder() {
	const { t } = useTranslation();

	const [enteredValue, setEnteredValue] = useState<string>('');
	const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
	const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			expandUrlHandler();
		}
	};

	const handleCopyLink = () => {
		if (expandedUrl) {
			copyToClipboard(expandedUrl, () => setIsCopiedLink(true));
			setTimeout(() => setIsCopiedLink(false), 1000);
		}
	};

	const validateInput = (value: string, type: 'email' | 'password' | 'url'): boolean => {
		if (type === 'url') {
			const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
			return urlRegex.test(value.trim());
		}
		return false;
	};

	const expandUrlHandler = async () => {
		setErrorMessage(null);
		if (!validateInput(enteredValue, 'url')) {
			setErrorMessage('Пожалуйста, введите корректный короткий URL (например, bit.ly/xxx).');
			return;
		}
		try {
			const result = await fetchExpandShortUrl(enteredValue);
			setExpandedUrl(result);
		} catch (error) {
			setErrorMessage('Ошибка при расширении URL.');
			console.error('Ошибка:', error);
		}
	};

	return (
		<div className='leak-shorturl'>
			<div className='leak-desc'>
				<h1 className='leak-desc-title'>
					<div className='leak-desc-icon-cont'>
						<img className='leak-desc-icon' src="icons/url_icon.svg" alt="" />
					</div>
					{t('vulnerabilitiesPage.shortLinkDecoder.title')}
				</h1>
				<p className='leak-desc-text'>{t('vulnerabilitiesPage.shortLinkDecoder.text')}</p>
			</div>
			<div className='leak-input-cont'>
				<div className='leak-input-wrapper'>
					<input
						className='leak-input'
						type="text"
						placeholder='https://bit.ly/3xyz123'
						onChange={handleInput}
						onKeyDown={handleKeyDown}
					/>
					<button
						className='input-btn leak-btn button'
						onClick={expandUrlHandler}
					>
						<img src="icons/magnifying-glass_icon.svg" alt="Check" />
					</button>
				</div>
			</div>
			{expandedUrl && errorMessage === null && (
				<div className="leak-result">
					<div className='leak-result-url'>
						<p>{t('vulnerabilitiesPage.shortLinkDecoder.resultTitle')}</p>
						<strong className={`${isCopiedLink ? 'copied-password--visible' : ''}`} onClick={handleCopyLink}>
							{expandedUrl}
							<span className={`copied-text ${isCopiedLink ? 'visible' : ''}`}>
								{t('passwordPage.PasswordGenerator.copied')}
							</span>
						</strong>
					</div>
					<p className='leak-result-url'>{t('vulnerabilitiesPage.shortLinkDecoder.resultAdvice')}</p>
				</div>
			)}
			{errorMessage && (
				<p className="leak-error-message">{errorMessage}</p>
			)}
		</div>
	)
}