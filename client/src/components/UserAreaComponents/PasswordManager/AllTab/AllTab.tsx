import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../../store';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { showNotification } from '../../../../store/generalSlice';
import { Password } from '../../../../types/AccountTypes/passwordManagerTypes';
import { usePasswordEncryption } from '../../../../hooks/usePasswordEncryption';
import axios from 'axios';
import Notification from '../../../GeneralComponents/Notification/Notification';
const serverUrl = import.meta.env.VITE_SERVER_URL;

interface AllTabProps {
	selectedTab: string,
	passwords: Password[],
	setPasswords: React.Dispatch<React.SetStateAction<Password[]>>,
	remaining: number,
	setRemaining: React.Dispatch<React.SetStateAction<number>>,
}

export default function AllTab({ selectedTab, passwords, setPasswords, remaining, setRemaining }: AllTabProps) {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);
	const notification = useSelector((state: RootState) => state.general.notification)
	const { decryptData } = usePasswordEncryption();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [search, setSearch] = useState<string>('');

	// Загрузка паролей
	useEffect(() => {
		if (token && selectedTab === 'all') {
			fetchPasswords();
		}
	}, [token, selectedTab, passwords]);

	const fetchPasswords = async () => {
		try {
			const response = await axios.get(`${serverUrl}/api/passwords`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const decryptedPasswords = response.data.passwords.map((p: Password) => {
				const site = decryptData(p.site);
				const login = decryptData(p.login);
				return {
					...p,
					site: site || '',
					login: login || '',
					encryptedPassword: p.encryptedPassword,
				};
			});
			setPasswords(decryptedPasswords);
			setRemaining(response.data.remaining);
		} catch (error: any) {
			dispatch(
				showNotification({
					message: error.response?.data?.message || t('accountPage.passwordManager.errorFetch'),
					type: 'error',
				})
			);
		}
	};

	// Копирование пароля
	const handleCopy = async (encryptedPassword: string) => {
		try {
			const decryptedPassword = decryptData(encryptedPassword);
			if (!decryptedPassword) {
				dispatch(
					showNotification({
						message: t('accountPage.passwordManager.errorDecrypt'),
						type: 'error',
					})
				);
				return;
			}
			await navigator.clipboard.writeText(decryptedPassword);
			dispatch(
				showNotification({
					message: t('accountPage.passwordManager.passwordCopied'),
					type: 'success',
				})
			);
		} catch (error: any) {
			dispatch(
				showNotification({
					message: error.response?.data?.message || t('accountPage.passwordManager.errorCopy'),
					type: 'error',
				})
			);
		}
	};

	// Удаление пароля
	const handleDelete = async (id: string) => {
		try {
			await axios.delete(`${serverUrl}/api/passwords/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setPasswords(passwords.filter((p) => p._id !== id));
			setRemaining(remaining + 1);
			dispatch(
				showNotification({
					message: t('accountPage.passwordManager.passwordDeleted'),
					type: 'success',
				})
			);
		} catch (error: any) {
			dispatch(
				showNotification({
					message: error.response?.data?.message || t('accountPage.passwordManager.errorDelete'),
					type: 'error',
				})
			);
		}
	};

	// Фильтрация по логину и сайту
	const filteredPasswords = useMemo(
		() =>
			passwords.filter(
				(p) =>
					p.site.toLowerCase().includes(search.toLowerCase()) ||
					p.login.toLowerCase().includes(search.toLowerCase())
			),
		[passwords, search]
	);

	return (
		<motion.div
			className="pass-manager-all-cont"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className="pass-manager-options">
				<div className='pass-manager-limit'>{remaining}/100</div>
				<div className='pass-manager-filter'>
					<input
						className="pass-manager-filter-input"
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t('accountPage.passwordManager.allTab.searchPlaceholder')}
					/>
				</div>
				<div
					className='button pass-manager-show-pass'
					onClick={() => setShowPassword((prev) => !prev)}
				>
					<img src="icons/hide-password.svg" alt="Hide" />
				</div>
			</div>
			<div className="pass-manager-list">
				{filteredPasswords.map((p) => (
					<div
						key={p._id}
						className="pass-manager-item"
					>
						<div className='pass-manager-item-info'>
							<div className='pass-manager-additional-info'>
								<div
									className={`pass-manager-password ${p.strength === 'weak'
										? 'text-red-500'
										: p.strength === 'medium'
											? 'text-yellow-500'
											: 'text-green-500'
										}`}
								>
									<strong>{t('accountPage.passwordManager.strength')}</strong> {t(`accountPage.passwordManager.strenghtLevel.${p.strength}`)}
								</div>
								<div className='pass-manager-date'><strong>{t('accountPage.passwordManager.allTab.date')}</strong> {new Date(p.createdAt).toLocaleString()}</div>
							</div>
							<div className="pass-manager-site"><strong>{t('accountPage.passwordManager.allTab.site')}</strong> {p.site || 'Без сайта'}</div>
							<div className='pass-manager-login'><strong>{t('accountPage.passwordManager.allTab.login')}</strong> {p.login}</div>
							<div className='pass-manager-password'>
								<p>
									<strong>{t('accountPage.passwordManager.allTab.password')} </strong>
									{!showPassword
										? decryptData(p.encryptedPassword).replace(/./g, "*")
										: decryptData(p.encryptedPassword)}
								</p>
							</div>
						</div>
						<div className="pass-manager-item-btns">
							<button
								className="pass-manager-btn pass-manager-btn-copy"
								onClick={() => handleCopy(p.encryptedPassword)}
							>
								{t('accountPage.passwordManager.allTab.copy')}
							</button>
							<button
								className="pass-manager-btn pass-manager-btn-delete"
								onClick={() => handleDelete(p._id)}
							>
								{t('accountPage.passwordManager.allTab.delete')}
							</button>
						</div>
					</div>
				))}
			</div>
			{notification && <Notification message={notification.message} time={3000} />}
		</motion.div>
	)
}