import './UserAccount.css'
import { Link } from 'react-router-dom'
import { setCurrentLink } from '../../../store/reportsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';

export default function UserAccount() {
	const dispatch = useDispatch<AppDispatch>();
	const token = useSelector((state: RootState) => state.auth.token);
	console.log(token);

	return (
		<>
			{token !== null ? (
				<div style={{ width: '20px', height: '20px', backgroundColor: 'blue' }}></div>
			) : (
				<Link
					className='navbar-auth'
					to={'/auth'}
					onClick={() => dispatch(setCurrentLink('/auth'))}
				>
					Войти
				</Link>
			)}
		</>
	)
}