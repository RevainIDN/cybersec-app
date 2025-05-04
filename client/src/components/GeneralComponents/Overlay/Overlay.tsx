import './Overlay.css';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Overlay() {
	useEffect(() => {
		document.body.classList.add('overlay-active');
		return () => {
			document.body.classList.remove('overlay-active');
		};
	}, []);

	return (
		<motion.div
			className="overlay"
			initial={{ opacity: 0 }}
			animate={{ opacity: 0.7 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
		/>
	);
}