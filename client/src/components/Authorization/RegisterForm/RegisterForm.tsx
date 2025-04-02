import '../Authorization.css'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchRegister } from '../../../services/Authorization/authorization'

export default function RegisterForm() {
	const { t } = useTranslation();

	const [email, setEmail] = useState<string>('');
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordConfirm, setPasswordConfirm] = useState<string>('');

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [serverMessage, setServerMessage] = useState<string>('');
	const [serverStatus, setServerStatus] = useState<number | null>(null);

	const [typePasswordInput, setTypePasswordInput] = useState<boolean>(false);

	const validateForm = () => {
		const newErrors: { [key: string]: string } = {};

		// Email
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			newErrors.email = 'Введите корректный email';
		}

		// Username
		if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
			newErrors.username = 'Никнейм должен быть минимум 3 символа (буквы, цифры, _)';
		}

		// Password
		if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
			newErrors.password = 'Пароль должен быть минимум 8 символов, содержать буквы и цифры';
		}

		// Password Confirm
		if (password !== passwordConfirm) {
			newErrors.passwordConfirm = 'Пароли не совпадают';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleChangeInputType = () => {
		setTypePasswordInput(prev => !prev)
	}

	const handleSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!validateForm()) return

		try {
			const data = await fetchRegister(email, username, password, passwordConfirm);
			setServerMessage(data.message);
			setServerStatus(data.status);
		} catch (error) {
			console.error('Ошибка:', error);
		}
	};

	return (
		<form
			className='form-signup'
			method='post'
			name='form'
			onSubmit={handleSubmitRegister}
		>
			{serverMessage && serverStatus !== 201 && <span className="server-message">{serverMessage}</span>}
			<label className='signup-label' htmlFor="email">
				{t('authorization.registration.email')}
				<input
					className={`input signup-input ${errors.email ? 'signup-input--error' : ''}`}
					type="email"
					id='email'
					onChange={(e) => { setEmail(e.target.value) }}
				/>
				{errors.email && <span className="signup-error">{errors.email}</span>}
			</label>
			<label className='signup-label' htmlFor="username">
				{t('authorization.registration.username')}
				<input
					className={`input signup-input ${errors.username ? 'signup-input--error' : ''}`}
					type="text"
					id='username'
					onChange={(e) => { setUsername(e.target.value) }}
				/>
				{errors.username && <span className="signup-error">{errors.username}</span>}
			</label>
			<label className='signup-label' htmlFor="password">
				{t('authorization.registration.password')}
				<div className='password-wrapper'>
					<input
						className={`input signup-input ${errors.password ? 'signup-input--error' : ''}`}
						type={typePasswordInput ? 'text' : 'password'}
						id='password'
						onChange={(e) => { setPassword(e.target.value) }}
					/>
					<button className='input-btn auth-btn-password button' type='button' onClick={handleChangeInputType}>
						<img src="icons/hide-password.svg" alt="Hide" />
					</button>
				</div>
				{errors.password && <span className="signup-error">{errors.password}</span>}
			</label>
			<label className='signup-label' htmlFor="confirm-password">
				{t('authorization.registration.confirmPassword')}
				<div className='password-wrapper'>
					<input
						className={`input signup-input ${errors.passwordConfirm ? 'signup-input--error' : ''}`}
						type={typePasswordInput ? 'text' : 'password'}
						id='confirm-password'
						onChange={(e) => { setPasswordConfirm(e.target.value) }}
					/>
					<button className='input-btn auth-btn-password button' type='button' onClick={handleChangeInputType}>
						<img src="icons/hide-password.svg" alt="Hide" />
					</button>
				</div>
				{errors.passwordConfirm && <span className="signup-error">{errors.passwordConfirm}</span>}
			</label>
			<button
				className={`button signup-btn ${serverStatus === 201 ? 'signup-btn-200' : ''}`}
				type='submit'
			>
				{serverStatus === 201
					? t('authorization.registration.signUpSuccess')
					: t('authorization.registration.signUp')}
			</button>
		</form>
	)
}