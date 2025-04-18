import './AutoCheck.css'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AutoCheckItem, AutoCheckSubType, AutoCheckType } from '../../../types/AccountTypes/autoCheckTypes';
import { fetchAutoChecks, runAutoChecks, createAutoCheck, runSingleAutoCheck, deleteAutoCheck } from '../../../services/Authorization/autoCheck';
import Notification from '../../GeneralComponents/Notification/Notification';

export default function AutoCheck() {
	const { t } = useTranslation();
	const token = useSelector((state: RootState) => state.auth.token);
	const MAX_AUTO_CHECK_LIMIT = 5;

	const [selectedTab, setSelectedTab] = useState<'create' | 'all'>('create');
	const [isOpenTypeCheck, setIsOpenTypeCheck] = useState<boolean>(false);
	const [checkType, setCheckType] = useState<AutoCheckType>('analysis');
	const [subType, setSubType] = useState<AutoCheckSubType | ''>('');
	const [inputData, setInputData] = useState<string>('');
	const [checkOnLogin, setCheckOnLogin] = useState<boolean>(true);
	const [autoChecks, setAutoChecks] = useState<AutoCheckItem[]>([]);
	const [error, setError] = useState<string>('');

	const [showNotification, setShowNotification] = useState<boolean>(false);
	const [isAutoCheckCreated, setIsAutoCheckCreated] = useState<boolean>(false);

	const analysisOptions: AutoCheckSubType[] = ['ip', 'url', 'domain'];
	const leakOptions: AutoCheckSubType[] = ['email', 'password'];
	const subTypeOptions = checkType === 'analysis' ? analysisOptions : leakOptions

	// Валидация данных
	const validateInput = (subType: AutoCheckSubType | '', input: string): string => {
		if (!subType) return t('accountPage.autoCheck.errors.selectSubType');
		if (!input.trim()) return t('accountPage.autoCheck.errors.fillFields');

		switch (subType) {
			case 'ip':
				const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
				if (!ipRegex.test(input)) return t('accountPage.autoCheck.errors.invalidIp');
				break;
			case 'url':
				const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
				if (!urlRegex.test(input)) return t('accountPage.autoCheck.errors.invalidUrl');
				if (input.length > 2048) return t('accountPage.autoCheck.errors.urlTooLong');
				break;
			case 'domain':
				const domainRegex = /^([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}$/i;
				if (!domainRegex.test(input)) return t('accountPage.autoCheck.errors.invalidDomain');
				if (input.length > 255) return t('accountPage.autoCheck.errors.domainTooLong');
				break;
			case 'email':
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(input)) return t('accountPage.autoCheck.errors.invalidEmail');
				if (input.length > 254) return t('accountPage.autoCheck.errors.emailTooLong');
				break;
			case 'password':
				if (input.length < 6) return t('accountPage.autoCheck.errors.passwordTooShort');
				if (input.length > 128) return t('accountPage.autoCheck.errors.passwordTooLong');
				break;
			default:
				return t('accountPage.autoCheck.errors.invalidSubType');
		}
		return '';
	};

	// Загрузка автопроверок и запуск при входе
	useEffect(() => {
		if (!token) return;

		const loadAutoChecks = async () => {
			try {
				const data = await fetchAutoChecks(token);
				setAutoChecks(data);
				setError('');
			} catch (err) {
				console.error('Ошибка получения автопроверок:', err);
				setError(t('autoCheck.errors.fetchFailed'));
			}
		};

		const runLoginChecks = async () => {
			try {
				const updatedChecks = await runAutoChecks(token);
				setAutoChecks((prev) =>
					prev.map((check) => updatedChecks.find((updated) => updated._id === check._id) || check)
				);
			} catch (err) {
				console.error('Ошибка запуска автопроверок:', err);
				setError(t('autoCheck.errors.runFailed'));
			}
		};

		loadAutoChecks();
		runLoginChecks();
	}, [token, t]);

	useEffect(() => {
		if (showNotification || isAutoCheckCreated) {
			const timer = setTimeout(() => {
				setShowNotification(false);
				setIsAutoCheckCreated(false);
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [showNotification, isAutoCheckCreated]);

	// Создание новой автопроверки
	const handleCreate = () => {
		if (MAX_AUTO_CHECK_LIMIT - autoChecks.length === 0) {
			setShowNotification(true);
			return;
		}

		const validationError = validateInput(subType, inputData);
		if (validationError) {
			setError(validationError);
			return;
		}
		setError('');

		createAutoCheck(token!, {
			type: checkType,
			subType: subType as AutoCheckSubType,
			input: inputData,
			checkOnLogin,
		})
			.then(newCheck => {
				setAutoChecks([...autoChecks, newCheck]);
				setInputData('');
				setSubType('');
				setCheckType('analysis');
				setCheckOnLogin(true);
			})
			.catch(err => {
				console.error('Ошибка создания автопроверки:', err);
				setError(err.response?.data?.message || t('autoCheck.errors.createFailed'));
			});

		setIsAutoCheckCreated(true);
	};

	const toggleTypeCheck = () => {
		setIsOpenTypeCheck(!isOpenTypeCheck);
	};

	// Удаление автопроверки
	const handleDelete = (id: string) => {
		deleteAutoCheck(token!, id)
			.then(() => {
				setAutoChecks(autoChecks.filter(check => check._id !== id));
			})
			.catch(err => {
				console.error('Ошибка удаления автопроверки:', err);
				setError(err.response?.data?.message || t('autoCheck.errors.deleteFailed'));
			});
	};

	// Ручной запуск проверки
	const handleRunCheck = (id: string) => {
		runSingleAutoCheck(token!, id)
			.then(updatedCheck => {
				setAutoChecks(autoChecks.map(check => (check._id === id ? updatedCheck : check)));
			})
			.catch(err => {
				console.error('Ошибка выполнения проверки:', err);
				setError(err.response?.data?.message || t('autoCheck.errors.runFailed'));
			});
	};

	const remainingChecks = MAX_AUTO_CHECK_LIMIT - autoChecks.length;

	return (
		<div className='auto-check'>
			<div className='auto-check-btns'>
				<button
					className={`auto-check-btn ${selectedTab === 'create' ? 'auto-check-btn--active' : ''}`}
					onClick={() => setSelectedTab('create')}
				>
					{t('accountPage.autoCheck.tabButton1')}
				</button>
				<button
					className={`auto-check-btn ${selectedTab === 'all' ? 'auto-check-btn--active' : ''}`}
					onClick={() => setSelectedTab('all')}
				>
					{t('accountPage.autoCheck.tabButton2')}
				</button>
			</div>

			{selectedTab === 'create' && (
				<motion.div
					className="auto-check-create-cont"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					{error && <span className="auto-check-error">{error}</span>}

					<div className="auto-check-radios">
						<h1 className='auto-check-title'>{t(`accountPage.autoCheck.title1`)}</h1>
						<div className='auto-check-radios-wrapper'>
							<label>
								<input
									className='radio'
									type="radio"
									name="checkType"
									value="analysis"
									checked={checkType === 'analysis'}
									onChange={() => {
										setCheckType('analysis');
										setSubType('');
									}}
								/>
								<span className='custom-radio'></span>
								{t('accountPage.autoCheck.analysis')}
							</label>
							<label>
								<input
									className='radio'
									type="radio"
									name="checkType"
									value="leak"
									checked={checkType === 'leak'}
									onChange={() => {
										setCheckType('leak');
										setSubType('');
									}}
								/>
								<span className='custom-radio'></span>
								{t('accountPage.autoCheck.leak')}
							</label>
						</div>


						<div className="auto-check-type-select">
							<h1 className='auto-check-title'>{t(`accountPage.autoCheck.title2`)}</h1>
							<button className="auto-check-btn" onClick={toggleTypeCheck}>
								{subType ? t(`accountPage.autoCheck.subTypes.${subType}`) : t('accountPage.autoCheck.selectType')} ▼
							</button>
							<AnimatePresence>
								{isOpenTypeCheck && (
									<motion.ul
										className="auto-check-dropdown"
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
									>
										{subTypeOptions.map(opt => (
											<li
												key={opt}
												className="auto-check-dropdown-item"
												onClick={() => {
													setSubType(opt);
													toggleTypeCheck();
												}}
											>
												{t(`accountPage.autoCheck.subTypes.${opt}`)}
											</li>
										))}
									</motion.ul>
								)}
							</AnimatePresence>
						</div>
					</div>

					<h1 className='auto-check-title'>{t(`accountPage.autoCheck.title3`)}</h1>
					<input
						className="auto-check-input"
						type="text"
						value={inputData}
						onChange={(e) => setInputData(e.target.value)}
						placeholder={subType ? t(`accountPage.autoCheck.placeholders.${subType}`) : t('accountPage.autoCheck.enterData')}
					/>

					<label className="auto-check-checkbox">
						<input
							className='checkbox'
							type="checkbox"
							checked={checkOnLogin}
							onChange={() => setCheckOnLogin(!checkOnLogin)}
						/>
						<span className='custom-checkbox'></span>
						{t('accountPage.autoCheck.checkOnLogin')}
					</label>

					<button className="auto-check-btn auto-check-create-btn" onClick={handleCreate}>
						{t('accountPage.autoCheck.create')}
					</button>

					{showNotification && (
						<Notification message={'Достигнут лимит авто-проверок'} />
					)}

					{isAutoCheckCreated && (
						<Notification message='Авто-проверка создана' />
					)}
				</motion.div>
			)}
			{selectedTab === 'all' && (
				<motion.div
					className="auto-check-list-cont"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.3 }}
				>
					{autoChecks.length === 0 ? (
						<p>{t('accountPage.autoCheck.noChecks')}</p>
					) : (
						<>
							<h1 className="auto-check-limit">{t('accountPage.autoCheck.remainingChecks')} {remainingChecks}</h1>
							<ul className="auto-check-list">
								{autoChecks.map(check => (
									<motion.li
										key={check._id}
										className={`auto-check-item 
											${check.lastResult === 'leaked' || check.lastResult === 'suspicious'
												? 'bg-item--suspicious'
												: ''}
											${check.lastResult === 'clean' || check.lastResult === 'safe'
												? 'bg-item--clear'
												: ''}`}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
									>
										<div className='auto-check-item-wrapper'>
											<div className='auto-check-item-info'>
												<p>
													<strong>{t('accountPage.autoCheck.type')}:</strong> {t(`accountPage.autoCheck.${check.type}`)}
												</p>
												<p>
													<strong>{t('accountPage.autoCheck.subType')}:</strong> {t(`accountPage.autoCheck.subTypes.${check.subType}`)}
												</p>
											</div>
											<div className='auto-check-item-result'>
												<p>
													<strong>{t('accountPage.autoCheck.input')}:</strong> {check.input}
												</p>
												<p>
													<strong>{t('accountPage.autoCheck.result')}:</strong>{' '}
													{check.lastResult ? t(`accountPage.autoCheck.results.${check.lastResult}`) : t('accountPage.autoCheck.notChecked')}
												</p>
												<p>
													<strong>{t('accountPage.autoCheck.lastChecked')}:</strong>{' '}
													{check.lastChecked ? new Date(check.lastChecked).toLocaleString() : '-'}
												</p>
											</div>
										</div>
										<div className="auto-check-item-actions">
											<button
												className="auto-check-now-btn"
												onClick={() => handleRunCheck(check._id)}
											>
												{t('accountPage.autoCheck.runNow')}
											</button>
											<button
												className="auto-check-btn auto-check-delete-btn"
												onClick={() => handleDelete(check._id)}
											>
												{t('accountPage.autoCheck.delete')}
											</button>
										</div>
									</motion.li>
								))}
							</ul>
						</>
					)}
				</motion.div>
			)}
		</div>
	)
}