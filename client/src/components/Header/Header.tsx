import './Header.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { setCurrentLink } from '../../store/generalSlice';
import { Link } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import UserAccount from './UserAccount/UserAccount';

export default function Header() {
	const dispatch = useDispatch<AppDispatch>();

	return (
		<div className='header'>
			<Link
				to={'/'}
				className='logo'
				onClick={() => dispatch(setCurrentLink('/'))}
			>
				<h1><strong>Secure</strong>Net</h1>
			</Link>
			<Navbar />
			<div className='header-cont'>
				<LanguageSelector />
				<UserAccount />
			</div>
		</div>
	)
}