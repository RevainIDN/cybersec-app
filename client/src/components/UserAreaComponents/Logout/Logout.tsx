import './Logout.css'
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { clearToken } from '../../../store/authSlice';
import { Link } from 'react-router-dom';

export default function Logout() {
	const dispatch = useDispatch<AppDispatch>();

	const logout = () => {
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');
		dispatch(clearToken())
	}

	return (
		<div className='logout'>
			<h1 className='logout-title'>Выйти из аккаунта?</h1>
			<Link
				className='logout-btn'
				to={'/'}
				onClick={logout}
			>
				Да
			</Link>
		</div>
	)
}