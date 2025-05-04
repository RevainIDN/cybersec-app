import './Navbar.css';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { setCurrentLink } from '../../../store/generalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { Link } from 'react-router-dom';

const navLinks = [
	{ label: "navbar.home", path: "/", key: "home" },
	{ label: "navbar.ip", path: "/analysis", key: "ip" },
	{ label: "navbar.leaks", path: "/vulnerabilities", key: "leaks" },
	{ label: "navbar.passwords", path: "/passwords", key: "passwords" },
	{ label: "navbar.reports", path: "/reports", key: "reports" },
];

export default function Navbar() {
	const dispatch = useDispatch<AppDispatch>();
	const { currentLink } = useSelector((state: RootState) => state.general);
	const { t } = useTranslation();

	return (
		<nav className="navbar">
			{navLinks.map(({ label, path, key }) => (
				<Link
					key={key}
					className="navbar-link"
					to={path}
					onClick={() => dispatch(setCurrentLink(path))}
				>
					{t(label)}
					{currentLink === path && (
						<motion.div
							className='navbar-active-bg'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
						/>
					)}
				</Link>
			))}
		</nav>
	);
}