import './Navbar.css';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
	{ label: "navbar.home", path: "/", key: "" },
	{ label: "navbar.ip", path: "/ip", key: "ip" },
	{ label: "navbar.leaks", path: "/leaks", key: "leaks" },
	{ label: "navbar.passwords", path: "/passwords", key: "passwords" },
	{ label: "navbar.reports", path: "/reports", key: "reports" },
];

export default function Navbar() {
	const location = useLocation();
	const { t } = useTranslation();
	const [currentLink, setCurrentLink] = useState(location.pathname);

	return (
		<nav className="navbar">
			{navLinks.map(({ label, path, key }) => (
				<Link
					key={key}
					className="navbar-link"
					to={path}
					onClick={() => setCurrentLink(path)}
				>
					{t(label)}
					{currentLink === path && (
						<motion.div
							className="navbar-active-bg"
							layoutId="activeNavBg"
							transition={{ type: "spring", stiffness: 500, damping: 40 }}
						/>
					)}
				</Link>
			))}
		</nav>
	);
}