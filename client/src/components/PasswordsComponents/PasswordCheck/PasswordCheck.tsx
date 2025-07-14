import './PasswordCheck.css'
import { useState, useEffect } from 'react';
import zxcvbn, { ZXCVBNResult } from 'zxcvbn';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { passwordStrengthStyles, getTranslatedCrackTime } from './passwordStrengthHelpers';
import { usePasswordImprovement } from '../../../hooks/usePasswordImprovement';

export default function PasswordCheck() {
	const { t } = useTranslation();

	// Локальное логическое состояние
	const [userPassword, setUserPassword] = useState<string>('');
	// Локальное ui состояние
	const [checkedPassword, setCheckedPassword] = useState<ZXCVBNResult | null>(null);
	// Використання хука для покращення пароля
	const { handleImprove } = usePasswordImprovement(userPassword);

	const handleClickImprove = () => {
		const newImprovedPassword = handleImprove();
		if (newImprovedPassword) {
			setUserPassword(newImprovedPassword);
			setCheckedPassword(zxcvbn(newImprovedPassword));
		}
	};

	// Обработчик ввода пароля
	const handleInputUserPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newPassword = e.target.value;
		setUserPassword(newPassword);
		setCheckedPassword(zxcvbn(newPassword));
	}

	// Обработчик изменения внешний отступов поля ввода пароля
	useEffect(() => {
		if (userPassword === '') { setCheckedPassword(null) };
	}, [userPassword])

	return (
		<div className='password-check'>
			{/* Поле ввода пароля */}
			<div className='input-cont'>
				<input
					className='passwords-input'
					type="text"
					placeholder='Qwerty123!'
					style={passwordStrengthStyles[checkedPassword?.score ?? 5]}
					value={userPassword}
					onChange={handleInputUserPassword}
				/>
				<div className='password-check-btns-cont'>
					<button
						className='input-btn button password-check-upgrade-btn'
						disabled={!userPassword}
						onClick={handleClickImprove}>
						{t('passwordPage.passwordCheck.improve')}
					</button>
					<button
						className='input-btn button password-check-clear-btn'
						onClick={() => setUserPassword('')}>
						<img src='trash.svg' alt='clear' />
					</button>
				</div>
			</div>

			{/* Основной контейнер информации */}
			<div className='password-info'>
				{/* Надёжность пароля */}
				<div className='password-block password-strength'>
					<p>{t('passwordPage.passwordCheck.strengthLabel')}
						<AnimatePresence mode="wait">
							{checkedPassword && (
								<motion.span
									key={checkedPassword.score}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.3 }}
								>
									<strong>{userPassword ? ' ' + t(`passwordPage.passwordCheck.passwordStrength.${checkedPassword.score}`) : null}</strong>
								</motion.span>
							)}
						</AnimatePresence>
					</p>
				</div>

				{/* Время взлома */}
				<div className='password-block password-cracktime'>
					<p>{t('passwordPage.passwordCheck.crackTimeLabel')}
						<AnimatePresence mode="wait">
							{checkedPassword && (
								<motion.span
									key={checkedPassword.crack_times_display.online_throttling_100_per_hour}
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									transition={{ duration: 0.3 }}
								>
									<strong>
										{userPassword && checkedPassword.crack_times_display.online_throttling_100_per_hour ? (
											checkedPassword.crack_times_display.online_throttling_100_per_hour === "centuries" ? (
												`${t(`passwordPage.passwordCheck.timeToCrack.${getTranslatedCrackTime(checkedPassword.crack_times_display.online_throttling_100_per_hour)}`)}`
											) : (
												`${checkedPassword.crack_times_display.online_throttling_100_per_hour.toString().split(' ')[0]} 
      										${t(`passwordPage.passwordCheck.timeToCrack.${getTranslatedCrackTime(checkedPassword.crack_times_display.online_throttling_100_per_hour.toString().split(' ')[1])}`)}`
											)
										) : null}
									</strong>
								</motion.span>
							)}
						</AnimatePresence>
					</p>
				</div>

				{/* Подсказки по улучшению пароля */}
				<div className='password-block password-alert'>
					{t('passwordPage.passwordCheck.recommendationsLabel')}
					<AnimatePresence>
						{checkedPassword?.feedback.suggestions.map((suggestion, key) => (
							<motion.h2
								className='password-suggestion'
								key={suggestion}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.3, delay: key * 0.2 }}
							>
								{userPassword ? t(`passwordPage.passwordCheck.recommendations.${suggestion.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}`) : null}
							</motion.h2>
						))}
					</AnimatePresence>

					<AnimatePresence>
						{checkedPassword?.feedback.warning && (
							<motion.h2
								className='password-warning'
								key={checkedPassword.feedback.warning}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.3, delay: 0.6 }}
							>
								{userPassword ? t(`passwordPage.passwordCheck.warnings.${checkedPassword.feedback.warning.replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase()}`) : null}
							</motion.h2>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}