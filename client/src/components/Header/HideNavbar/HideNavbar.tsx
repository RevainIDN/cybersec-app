import './HideNavbar.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setOpenHideNavbar } from '../../../store/generalSlice';
import Navbar from '../Navbar/Navbar';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import UserAccount from '../UserAccount/UserAccount';

export default function HideNavbar() {
	const { openHideNavbar } = useSelector((state: RootState) => state.general);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		document.body.style.overflow = openHideNavbar ? 'hidden' : '';
		return () => {
			document.body.style.overflow = '';
		};
	}, [openHideNavbar]);

	return (
		<div className='hide-navbar'>
			<button onClick={() => dispatch(setOpenHideNavbar(false))} className="hide-close burger-button">
				<span></span>
				<span></span>
			</button>
			<Navbar />
			<div className='header-cont hide-header-cont'>
				<UserAccount />
				<LanguageSelector />
			</div>
		</div>
	)
}