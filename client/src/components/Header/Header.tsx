import './Header.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setCurrentLink, setOpenHideNavbar, setOverlay } from '../../store/generalSlice';
import { Link } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import UserAccount from './UserAccount/UserAccount';
import HideNavbar from './HideNavbar/HideNavbar';

export default function Header() {
	const { openHideNavbar } = useSelector((state: RootState) => state.general);
	const dispatch = useDispatch<AppDispatch>();

	const handleOpenHideNavbar = () => {
		dispatch(setOpenHideNavbar(true));
		dispatch(setOverlay(true));
	}

	return (
		<>
			<div className='header'>
				<div className='logo-cont'>
					<button onClick={handleOpenHideNavbar} className="burger-button">
						<span></span>
						<span></span>
						<span></span>
					</button>
					<Link
						to={'/'}
						className='logo'
						onClick={() => dispatch(setCurrentLink('/'))}
					>
						<h1><strong>Secure</strong>Net</h1>
					</Link>
				</div>
				<div className='screen-hide-navbar'>
					<Navbar />
				</div>
				<div className='header-cont screen-hide-header-cont'>
					<LanguageSelector />
					<UserAccount />
				</div>
			</div>
			{openHideNavbar && <HideNavbar />}
		</>
	)
}