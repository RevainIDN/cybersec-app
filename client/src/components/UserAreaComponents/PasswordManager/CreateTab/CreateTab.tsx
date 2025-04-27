import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { showNotification } from '../../../../store/generalSlice';
import { Password } from '../../../../types/AccountTypes/passwordManagerTypes';
import { usePasswordEncryption } from '../../../../hooks/usePasswordEncryption';
import axios from 'axios';
import zxcvbn from 'zxcvbn';
import Notification from '../../../GeneralComponents/Notification/Notification';

interface CreateTabProps {
	passwords: Password[],
	setPasswords: React.Dispatch<React.SetStateAction<Password[]>>,
	remaining: number,
	setRemaining: React.Dispatch<React.SetStateAction<number>>,
}

export default function CreateTab({ passwords, setPasswords, remaining, setRemaining }: CreateTabProps) {
	const dispatch = useDispatch<AppDispatch>()
	const token = useSelector((state: RootState) => state.auth.token);
	const notification = useSelector((state: RootState) => state.general.notification)

	const { t } = useTranslation();
	const { encryptData } = usePasswordEncryption();
	const [site, setSite] = useState<string>('');
	const [login, setLogin] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordStrength, setPasswordStrength] = useState<'' | 'weak' | 'medium' | 'strong'>('');

	// Проверка надёжности пароля
	useEffect(() => {
		if (password) {
			const result = zxcvbn(password);
			const strength = result.score < 2 ? 'weak' : result.score < 4 ? 'medium' : 'strong';
			setPasswordStrength(strength);
		} else {
			setPasswordStrength('');
		}
	}, [password]);

	// Сохранение пароля
	const handleSave = async () => {
		if (!login || !password) {
			dispatch(
				showNotification({
					message: t('accountPage.passwordManager.fillRequiredFields'),
					type: 'error',
				})
			);
			return;
		}

		try {
			const encryptedSite = site ? encryptData(site) : '';
			const encryptedLogin = encryptData(login);
			const encryptedPassword = encryptData(password);
			if (!encryptedLogin || !encryptedPassword) return;

			const response = await axios.post(
				'http://localhost:5000/api/passwords',
				{
					site: encryptedSite,
					login: encryptedLogin,
					encryptedPassword,
					strength: passwordStrength,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setPasswords([...passwords, { ...response.data.password, site, login, encryptedPassword }]);
			setSite('');
			setLogin('');
			setPassword('');
			setPasswordStrength('');
			setRemaining(remaining - 1);
			dispatch(
				showNotification({
					message: t('accountPage.passwordManager.passwordSaved'),
					type: 'success',
				})
			);
		} catch (error: any) {
			dispatch(
				showNotification({
					message: error.response?.data?.message || t('accountPage.passwordManager.errorSave'),
					type: 'error',
				})
			);
		}
	};

	return (
		<motion.div
			className="pass-manager-create-cont"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
		>
			<h1 className='pass-manager-title'>{t('accountPage.passwordManager.createTab.siteTitle')}</h1>
			<input
				className="pass-manager-input"
				type="text"
				value={site}
				onChange={(e) => setSite(e.target.value)}
				placeholder={t('accountPage.passwordManager.createTab.sitePlaceholder')}
			/>

			<h1 className='pass-manager-title'>{t('accountPage.passwordManager.createTab.loginTitle')}</h1>
			<input
				className="pass-manager-input"
				type="text"
				value={login}
				autoComplete="off"
				onChange={(e) => setLogin(e.target.value)}
				placeholder={t('accountPage.passwordManager.createTab.loginPlaceholder')}
			/>

			<h1 className='pass-manager-title'>{t('accountPage.passwordManager.createTab.passwordTitle')}</h1>
			<input
				className="pass-manager-input"
				type="password"
				value={password}
				autoComplete='off'
				onChange={(e) => setPassword(e.target.value)}
				placeholder={t('accountPage.passwordManager.createTab.passwordPlaceholder')}
			/>
			{passwordStrength && (
				<div>
					{t('accountPage.passwordManager.strength')}
					<strong className={`${passwordStrength === 'weak'
						? 'pass-manager-input--weak'
						: passwordStrength === 'medium'
							? 'pass-manager-input--medium'
							: 'pass-manager-input--strong'
						}`}>{t(`accountPage.passwordManager.strenghtLevel.${passwordStrength}`)}</strong>
				</div>
			)}

			<button
				className='pass-manager-btn'
				onClick={handleSave}
			>
				{t('accountPage.passwordManager.createTab.save')}
			</button>

			{notification && <Notification message={notification.message} time={3000} />}
		</motion.div>
	)
}