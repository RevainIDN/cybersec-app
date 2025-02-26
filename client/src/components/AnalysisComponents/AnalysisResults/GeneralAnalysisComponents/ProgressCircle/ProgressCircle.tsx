interface ProgressCircleProps {
	totalChecks: number;
	infectedCount: number;
}

export default function ProgressCircle({ totalChecks, infectedCount }: ProgressCircleProps) {
	const radius = 50;
	const circumference = 2 * Math.PI * radius;

	// Рассчитываем прогресс
	const progress = (infectedCount / totalChecks) * 100;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<div className="progress-circle">
			<svg width="120" height="120" viewBox="0 0 120 120">
				{/* Фон круга */}
				<circle
					cx="60"
					cy="60"
					r={radius}
					fill="none"
					stroke="#58b44e"
					strokeWidth="10"
				/>
				{/* Прогресс круга */}
				<circle
					cx="60"
					cy="60"
					r={radius}
					fill="none"
					stroke={infectedCount === 0 ? '#58b44e' : '#FF5A50'}
					strokeWidth="10"
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					transform="rotate(-90 60 60)"
				/>
				{/* Текст с прогрессом */}
				<text x="50%" y="50%" textAnchor="middle" stroke='#FAFAFADE' strokeWidth="1px" dy=".3em">
					{infectedCount} / {totalChecks}
				</text>
			</svg>
		</div>
	);
};