import './ShortLinkDecoder.css'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { showNotification } from '../../../store/generalSlice';
import { useTranslation } from 'react-i18next';
import { fetchExpandShortUrl } from '../../../services/VulnerabilitiesApi/leakCheckRequests';
import { copyToClipboard } from '../../../utils/copyToClipboard';
import Notification from '../../GeneralComponents/Notification/Notification';

export default function ShortLinkDecoder() {
	const { t } = useTranslation();

	const dispatch = useDispatch<AppDispatch>();
	const { notification } = useSelector((state: RootState) => state.general)

	const [enteredValue, setEnteredValue] = useState<string>('');
	const [expandedUrl, setExpandedUrl] = useState<string | null>(null);
	const [isCopiedLink, setIsCopiedLink] = useState<boolean>(false);

	// Обработка ввода
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
	}

	// Обработка нажатия Enter
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			expandUrlHandler();
		}
	};

	// Копирование расширенного URL
	const handleCopyLink = () => {
		if (expandedUrl) {
			copyToClipboard(expandedUrl, () => setIsCopiedLink(true));
			setTimeout(() => setIsCopiedLink(false), 1000);
		}
	};

	// Валидация URL
	const validateInput = (value: string, type: 'email' | 'password' | 'url'): boolean => {
		if (type === 'url') {
			const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/;
			return urlRegex.test(value.trim());
		}
		return false;
	};

	// Запрос на расширение URL
	const expandUrlHandler = async () => {
		if (!validateInput(enteredValue, 'url')) {
			dispatch(showNotification({
				message: t('vulnerabilitiesPage.shortLinkDecoder.errors.inputError'),
				type: 'error'
			}))
			return;
		}
		try {
			const result = await fetchExpandShortUrl(enteredValue);
			setExpandedUrl(result);
		} catch (error) {
			dispatch(showNotification({
				message: t('vulnerabilitiesPage.shortLinkDecoder.errors.checkError'),
				type: 'error'
			}))
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
			{expandedUrl && (
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
			{notification && <Notification message={notification.message} time={5000} />}
		</div>
	)
}