import './Notification.css';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { showNotification } from '../../../store/generalSlice';

interface NotificationProps {
	message: string;
	time: number;
}

export default function Notification({ message, time }: NotificationProps) {
	const dispatch = useDispatch<AppDispatch>();
	const notification = useSelector((state: RootState) => state.general.notification)
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
		}, time);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (notification && !isVisible) {
			const timer = setTimeout(() => {
				dispatch(showNotification(null));
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [notification, isVisible, dispatch]);

	return (
		<div className={`notification ${isVisible ? 'visible' : 'hidden'}`}>
			{message}
		</div>
	);
}