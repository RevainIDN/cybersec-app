import './Notification.css';
import { useEffect, useState } from 'react';

interface NotificationProps {
	message: string;
}

export default function Notification({ message }: NotificationProps) {
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	if (!isVisible) return null;

	return (
		<div className="notification">
			{message}
		</div>
	);
}