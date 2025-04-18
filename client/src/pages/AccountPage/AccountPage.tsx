import './AccountPage.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Activities from '../../components/UserAreaComponents/Activities/Activities';
import AutoCheck from '../../components/UserAreaComponents/AutoCheck/AutoCheck';
import Logout from '../../components/UserAreaComponents/Logout/Logout';

const accountNavOptions = [
	{ key: "1", name: "activity", label: "activities" },
	{ key: "2", name: "autoCheck", label: "auto-check" },
	{ key: "3", name: "passwordManager", label: "password-manager" },
	{ key: "4", name: "settings", label: "settings" },
	{ key: "5", name: "logout", label: "logout" },
];

// Компоненты-заглушки
const PasswordManager = () => <h2>Менеджер паролей (в разработке)</h2>;
const Settings = () => <h2>Настройки (в разработке)</h2>;

export default function AccountPage() {
	const { t } = useTranslation();
	const token = useSelector((state: RootState) => state.auth.token);
	const [selectedOption, setSelectedOption] = useState<string>('activities');
	const [username, setUsername] = useState<string>('Some user');

	useEffect(() => {
		const fetchUserData = async () => {
			if (!token) return;
			try {
				const response = await axios.get(`http://localhost:5000/auth/me`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUsername(response.data.username);
			} catch (error) {
				console.error('Ошибка при получении данных пользователя:', error);
			}
		};
		fetchUserData();
	}, [token]);

	// Функция для рендеринга контента в зависимости от выбранной опции
	const renderContent = () => {
		switch (selectedOption) {
			case 'activities':
				return <Activities />;
			case 'auto-check':
				return <AutoCheck />;
			case 'password-manager':
				return <PasswordManager />;
			case 'settings':
				return <Settings />;
			case 'logout':
				return <Logout />
			default:
				return <p>Выберите опцию</p>;
		}
	};

	return (
		<div className="section">
			<div className="account-page">
				<div className="account-options">
					<div className="account-edit-settings">
						<img className="account-avatar" src="account/default_avatar.svg" alt="Avatar" />
						<h1 className="account-username">{username}</h1>
					</div>
					<ul className="account-options-btns">
						{accountNavOptions.map((option) => (
							<li
								key={option.key}
								className={`account-option-btn ${selectedOption === option.label ? 'account-option-btn--active' : ''}`}
								onClick={() => setSelectedOption(option.label)}
							>
								{t(`accountPage.tabs.${option.name}`)}
							</li>
						))}
					</ul>
				</div>
				<div className="account-content">
					<AnimatePresence mode="wait">
						<motion.div
							key={selectedOption}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.3 }}
						>
							{renderContent()}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}