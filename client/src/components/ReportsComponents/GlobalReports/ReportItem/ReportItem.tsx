import './ReportItem.css';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { ReportItemData } from '../../../../types/ReportsTypes/globalReportsTypes';
import { Link } from 'react-router-dom';
import { setCurrentLink } from '../../../../store/reportsSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store';
import { useTranslation } from 'react-i18next';
import {
	Chart as ChartJS,
	ArcElement,
	LineElement,
	BarElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Tooltip,
	Legend,
	Title,
	Filler,
	ChartData,
	ChartOptions,
} from 'chart.js';

// Регистрируем необходимые компоненты
ChartJS.register(ArcElement, LineElement, BarElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Title, Filler);

interface ReportItemProps {
	item: ReportItemData;
	index: number;
}

export default function ReportItem({ item, index }: ReportItemProps) {
	const dispatch = useDispatch<AppDispatch>();

	const { t } = useTranslation();

	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

	const isEven = index % 2 === 0;
	const shouldReverse = item.type === 'stat' && !isEven;

	// Типизированные опции для графиков
	const chartOptions: ChartOptions<'pie' | 'line' | 'bar'> = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top' as const,
			},
			title: {
				display: true,
				text: t(`${item.title}`) || '',
			},
			tooltip: {
				callbacks: {
					label: (context) => `${context.dataset.label}: ${context.raw}`,
				},
			},
		},
	};

	// Типизированные данные для графиков
	const chartData: ChartData<'pie' | 'line' | 'bar'> | undefined =
		item.type === 'chart' && item.labels && item.data && item.colors
			? {
				labels: item.labels.map((label) => t(label)),
				datasets: [
					{
						label: t(`${item.title}`),
						data: item.data,
						backgroundColor: item.colors,
						borderColor: item.colors,
						borderWidth: 1,
						fill: item.chartType === 'line' ? false : true,
					},
				],
			}
			: undefined;

	// Рендеринг графика в зависимости от типа
	const renderChart = () => {
		if (!chartData || !item.chartType) return null;
		switch (item.chartType) {
			case 'pie':
				return <Pie data={chartData as ChartData<'pie'>} options={chartOptions as ChartOptions<'pie'>} />;
			case 'line':
				return <Line data={chartData as ChartData<'line'>} options={chartOptions as ChartOptions<'line'>} />;
			case 'bar':
				return <Bar data={chartData as ChartData<'bar'>} options={chartOptions as ChartOptions<'bar'>} />;
			default:
				return null;
		}
	};

	const infoBlock = (
		<div className={`info-block ${item.type === 'stat' ? 'stat' : ''}`}>
			<h3>{item.type === 'stat' ? t(`${item.value}`) : t(`${item.title}`)}</h3>
			<p>{t(item.info)}</p>
			<Link
				className='report-link'
				to={item.linkUrl}
				onClick={() => dispatch(setCurrentLink(item.linkUrl))}
			>
				{t(`${item.advice}`)} <strong>{t(item.linkText)}</strong>
			</Link>
			<p style={{ fontSize: '0.9rem', color: '#888', marginTop: '10px' }}>
				{t(`reportsPage.source`)} <a href={item.source} target="_blank" rel="noopener noreferrer">{t(`reportsPage.details`)}</a>
			</p>
		</div>
	);

	const chartBlock = item.type === 'chart' ? (
		<div className="chart-block">{renderChart()}</div>
	) : null;

	return (
		<motion.div
			ref={ref}
			className={`report-item ${shouldReverse ? 'reverse' : ''} ${item.type === 'chart' ? 'report-item-chart' : ''}`}
			initial={{ opacity: 0, y: 50 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ duration: 0.5, ease: "easeOut" }}
		>
			{isEven ? infoBlock : chartBlock}
			{isEven ? chartBlock : infoBlock}
		</motion.div>
	);
};