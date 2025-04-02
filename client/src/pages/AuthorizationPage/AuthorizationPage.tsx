import './AuthorizationPage.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import LoginForm from '../../components/Authorization/LoginForm/LoginForm';
import RegisterForm from '../../components/Authorization/RegisterForm/RegisterForm';

export default function AuthorizationPage() {
	const { t } = useTranslation();

	const [isLogin, setIsLogin] = useState<'signin' | 'signup'>('signin');

	return (
		<div className='section'>
			<div className='auth'>
				<div className='switch-auth'>
					<button
						className={`switch-auth-btn ${isLogin === 'signin' ? 'switch-auth-btn--active' : ''}`}
						onClick={() => setIsLogin('signin')}
					>
						{t('authorization.signIn')}
					</button>
					<button
						className={`switch-auth-btn ${isLogin === 'signup' ? 'switch-auth-btn--active' : ''}`}
						onClick={() => setIsLogin('signup')}
					>
						{t('authorization.signUp')}
					</button>
				</div>
				{isLogin === 'signin' ? (
					<LoginForm />
				) : (
					<RegisterForm />
				)}
			</div>
		</div>
	)
}

