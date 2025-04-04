import './UserAccount.css'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { setCurrentLink } from '../../../store/generalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';

export default function UserAccount() {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);

	return (
		<>
			{token ? (
				<Link
					className='navbar-user-btn'
					to={'/account'}
					onClick={() => dispatch(setCurrentLink('/auth'))}
				>
					<img src="account/default_avatar.svg" alt="Avatar" />
				</Link>
			) : (
				<Link
					className='navbar-auth'
					to={'/auth'}
					onClick={() => dispatch(setCurrentLink('/auth'))}
				>
					{t('authorization.navbarLogin')}
				</Link>
			)}
		</>
	)
}