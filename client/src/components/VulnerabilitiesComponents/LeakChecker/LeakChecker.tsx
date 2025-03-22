import './LeakChecker.css'
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchLeakCheckEmail, fetchPwnedPassword } from '../../../services/VulnerabilitiesApi/leakCheckRequests';
import { LeakCheckSuccessResponse, LeakCheckFalseResponse, PwnedPasswordsResponse } from '../../../types/VulnerabilitiesTypes/vulnerabilitiesTypes';

export default function LeakChecker() {
	const { t } = useTranslation();

	const [selectPwnedBtn, setSelectPwnedBtn] = useState<'email' | 'password'>('email');
	const [typePasswordInput, setTypePasswordInput] = useState<boolean>(false);
	const [enteredValue, setEnteredValue] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [emailLeakData, setEmailLeakData] = useState<LeakCheckSuccessResponse | LeakCheckFalseResponse | null>(null);
	const [passwordLeakData, setPasswordLeakData] = useState<PwnedPasswordsResponse | null>(null);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			checkLeack();
		}
	};

	const handleChangeInputType = () => {
		setTypePasswordInput(prev => !prev)
	}

	const handleSelectPwndBtn = (btn: 'email' | 'password') => {
		setSelectPwnedBtn(btn);
		setTypePasswordInput(false);
		setEnteredValue('');
		if (selectPwnedBtn === 'email') {
			setPasswordLeakData(null)
		} else {
			setEmailLeakData(null);
		}
	}

	const validateInput = (value: string, type: 'email' | 'password' | 'url'): boolean => {
		if (type === 'email') {
			const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
			return emailRegex.test(value);
		}
		if (type === 'password') {
			return value.trim().length > 0;
		}
		return false;
	};

	const checkLeack = async () => {
		setErrorMessage(null);
		const type = selectPwnedBtn === 'email' ? 'email' : 'password';
		if (!validateInput(enteredValue, type)) {
			setErrorMessage(`Пожалуйста, введите корректный ${type === 'email' ? 'email' : 'пароль'}.`);
			return;
		}
		try {
			const responseData = selectPwnedBtn === 'email'
				? await fetchLeakCheckEmail(enteredValue)
				: await fetchPwnedPassword(enteredValue);
			if (selectPwnedBtn === 'email') {
				setEmailLeakData(responseData as LeakCheckSuccessResponse | LeakCheckFalseResponse);
			} else {
				setPasswordLeakData(responseData as PwnedPasswordsResponse);
			}
		} catch (error) {
			setErrorMessage('Ошибка при проверке данных.');
			console.error('Ошибка:', error);
		}
	};

	const isLeakCheckSuccess = (data: LeakCheckSuccessResponse | LeakCheckFalseResponse | null): data is LeakCheckSuccessResponse => {
		return data !== null && 'success' in data && data.success;
	};

	return (
		<div className='leak-pwnd'>
			<div className='leak-desc'>
				<h1 className='leak-desc-title'>
					<div className='leak-desc-icon-cont'>
						<img className='leak-desc-icon' src="icons/lock_icon.svg" alt="" />
					</div>
					{t('vulnerabilitiesPage.leakChecker.title')}
				</h1>
				<p className='leak-desc-text'>{t('vulnerabilitiesPage.leakChecker.text')}</p>
			</div>
			<div className='leak-input-cont'>
				<div className='leak-input-wrapper'>
					<div className='leak-select'>
						<button
							className={`leak-select-btn ${selectPwnedBtn === 'email' ? 'select-email' : ''}`}
							onClick={() => handleSelectPwndBtn('email')}
						>
							{t('vulnerabilitiesPage.leakChecker.email')}
						</button>
						<button
							className={`leak-select-btn ${selectPwnedBtn === 'password' ? 'select-password' : ''}`}
							onClick={() => handleSelectPwndBtn('password')}
						>
							{t('vulnerabilitiesPage.leakChecker.password')}
						</button>
					</div>
					<input
						className='leak-input'
						type={typePasswordInput === true ? "password" : "text"}
						value={enteredValue}
						maxLength={50}
						placeholder={selectPwnedBtn === 'email' ? 'example@gmail.com' : 'qwerty123'}
						onChange={handleInput}
						onKeyDown={handleKeyDown}
					/>
					<button className='input-btn leak-btn button' onClick={checkLeack}>
						<img src="icons/magnifying-glass_icon.svg" alt="Check" />
					</button>
					{selectPwnedBtn === 'password' && <button className='input-btn leak-btn-password button' onClick={handleChangeInputType}>
						<img src="icons/hide-password.svg" alt="Hide" />
					</button>}
				</div>
			</div>
			{/* Рендер результата для email */}
			{emailLeakData && selectPwnedBtn === 'email' && errorMessage === null && (
				<motion.div
					className={`leak-result ${isLeakCheckSuccess(emailLeakData) && emailLeakData.found > 0 ? 'leak-found' : 'leak-not-found'}`}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<h2 className='leak-result-title'>
						{isLeakCheckSuccess(emailLeakData) && emailLeakData.found > 0
							? t('vulnerabilitiesPage.leakChecker.mailResult.leak.title')
							: t('vulnerabilitiesPage.leakChecker.mailResult.noLeak.title')}
					</h2>
					<p className='leak-result-subtitle'>
						{isLeakCheckSuccess(emailLeakData) && emailLeakData.found > 0
							? t('vulnerabilitiesPage.leakChecker.mailResult.leak.description')
							: t('vulnerabilitiesPage.leakChecker.mailResult.noLeak.description')}
					</p>
					{isLeakCheckSuccess(emailLeakData) && emailLeakData.found > 0 && (
						<div className='leak-result-desc'>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.info')}</strong></p>
							<ul>
								{emailLeakData.sources.map((source, index) => (
									<li key={index}>{source.name} ({t('vulnerabilitiesPage.leakChecker.mailResult.leak.date')} {source.date})</li>
								))}
							</ul>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.compromisedData')}</strong> {emailLeakData.fields.join(', ')}</p>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.recommendations')}</strong></p>
							<ul>
								<li>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.recommendation1')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.recommendation2')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.mailResult.leak.recommendation3')}</li>
							</ul>
						</div>
					)}
					{(!isLeakCheckSuccess(emailLeakData) || emailLeakData.found === 0) && (
						<div className='leak-result-desc'>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.adviсe')}</strong></p>
							<ul>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe1')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe2')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe3')}</li>
							</ul>
						</div>
					)}
				</motion.div>
			)}

			{/* Рендер результата для пароля */}
			{passwordLeakData && selectPwnedBtn === 'password' && errorMessage === null && (
				<motion.div
					className={`leak-result ${passwordLeakData.data.found ? 'leak-found' : 'leak-not-found'}`}
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				>
					<h2 className='leak-result-title'>
						{passwordLeakData.data.found
							? t('vulnerabilitiesPage.leakChecker.passwordResult.leak.title')
							: t('vulnerabilitiesPage.leakChecker.passwordResult.noLeak.title')}
					</h2>
					<p className='leak-result-subtitle'>
						{passwordLeakData.data.found
							? t('vulnerabilitiesPage.leakChecker.passwordResult.leak.description')
							: t('vulnerabilitiesPage.leakChecker.passwordResult.noLeak.description')}
					</p>
					{passwordLeakData.data.found && (
						<div className='leak-result-desc'>
							<p><strong>
								{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.info1')}
								{enteredValue}
								{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.info2')}
								{passwordLeakData.data.count}
								{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.info3')}
							</strong></p>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.recommendations')}</strong></p>
							<ul>
								<li>{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.recommendation1')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.recommendation2')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.passwordResult.leak.recommendation3')}</li>
							</ul>
						</div>
					)}
					{!passwordLeakData.data.found && (
						<div className='leak-result-desc'>
							<p><strong>{t('vulnerabilitiesPage.leakChecker.adviсe')}</strong></p>
							<ul>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe1')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe2')}</li>
								<li>{t('vulnerabilitiesPage.leakChecker.adviсe3')}</li>
							</ul>
						</div>
					)}
				</motion.div>
			)}
			{errorMessage && (
				<p className="leak-error-message">{errorMessage}</p>
			)}
		</div>
	)
}