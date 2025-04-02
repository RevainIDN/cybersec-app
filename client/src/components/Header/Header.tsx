import './Header.css';
import Navbar from './Navbar/Navbar';
import LanguageSelector from './LanguageSelector/LanguageSelector';
import UserAccount from './UserAccount/UserAccount';

export default function Header() {
	return (
		<div className='header'>
			<h1 className='logo'><strong>Secure</strong>Net</h1>
			<Navbar />
			<div className='header-cont'>
				<LanguageSelector />
				<UserAccount />
			</div>
		</div>
	)
}