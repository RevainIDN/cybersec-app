import './Activities.css';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../store';
import { fetchUserActivity, deleteAllUserActivities } from '../../../services/Authorization/authorization';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from '../../../types/AccountTypes/activityTypes';

export default function Activities() {
	const { t } = useTranslation();
	const token = useSelector((state: RootState) => state.auth.token);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [filterType, setFilterType] = useState<string | null>(null);
	const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);

	useEffect(() => {
		const loadActivity = async () => {
			if (!token) return;
			try {
				const data = await fetchUserActivity();
				setActivities(data);
			} catch (err) {
				console.error(err);
			}
		};
		loadActivity();
	}, [token]);

	const activityTypes = Array.from(new Set(activities.map((activity) => activity.type)));

	const handleSortByTime = () => {
		setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
	};

	const handleFilterByType = (type: string | null) => {
		setFilterType(type);
		setIsTypeFilterOpen(false);
	};

	const toggleTypeFilter = () => {
		setIsTypeFilterOpen(!isTypeFilterOpen);
	};

	const deleteAllActivity = () => {
		deleteAllUserActivities();
		setActivities([]);
	};

	const filteredAndSortedActivities = activities
		.filter((activity) => (filterType ? activity.type === filterType : true))
		.sort((a, b) => {
			const dateA = new Date(a.createdAt).getTime();
			const dateB = new Date(b.createdAt).getTime();
			return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
		});

	return (
		<div className="activities">
			<div className='activities-options'>
				<div className="activities-filters">
					<div className="activities-filter-type">
						<button
							className="activities-filter-type-button"
							onClick={toggleTypeFilter}
						>
							{t(`accountPage.activity.${filterType}`) || t('accountPage.activity.null')} ▼
						</button>
						<AnimatePresence>
							{isTypeFilterOpen && (
								<motion.ul
									className="activities-filter-type-dropdown"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.2 }}
								>
									<li
										className="activities-filter-type-item"
										onClick={() => handleFilterByType(null)}
									>
										{t('accountPage.activity.null')}
									</li>
									{activityTypes.map((type) => (
										<li
											key={type}
											className="activities-filter-type-item"
											onClick={() => handleFilterByType(type)}
										>
											{t(`accountPage.activity.${type}`)}
										</li>
									))}
								</motion.ul>
							)}
						</AnimatePresence>
					</div>
					<button
						className="activities-filter-time"
						onClick={handleSortByTime}
					>
						{sortOrder === 'desc' ? t('accountPage.activity.timeNew') : t('accountPage.activity.timeOld')}
					</button>
				</div>
				<button
					className='activities-clear'
					onClick={deleteAllActivity}
				>{t('accountPage.activity.clear')}</button>
			</div>

			<ul className="activities-list">
				{filteredAndSortedActivities.length === 0 ? (
					<p>{t('accountPage.activity.noActivities')}</p>
				) : (
					filteredAndSortedActivities.map((activity) => (
						<motion.li
							key={activity._id}
							className={`activity-item ${activity.result === 'leaked' || activity.result === 'suspicious'
								? 'bg-item--suspicious'
								: 'bg-item--clear'}`}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							<div className="activity-item-info">
								<p>
									<strong>{t('accountPage.activity.type')}</strong> {t(`accountPage.activity.${activity.type}`)}
								</p>
								<p>
									<strong>{t('accountPage.activity.date')}</strong> {new Date(activity.createdAt).toLocaleString()}
								</p>
							</div>
							<div className="activity-item-result">
								<p>
									<strong>{t('accountPage.activity.input')}</strong> {activity.input}
								</p>
								<p>
									<strong>{t('accountPage.activity.result')}</strong> {t(`accountPage.activity.results.${activity.result}`)}
								</p>
							</div>
						</motion.li>
					))
				)}
			</ul>
		</div>
	);
}