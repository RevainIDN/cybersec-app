import './ResultsSwitchingButtons.css'
import { SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

interface ResultsSwitchingButtonsProps {
	selectedResultsOption: string | null,
	setSelectedOption: React.Dispatch<SetStateAction<string | null>>
}

export default function ResultsSwitchingButtons({ selectedResultsOption, setSelectedOption }: ResultsSwitchingButtonsProps) {
	const { t } = useTranslation();

	// Обработчик переключения типа выводимых данных
	const handleClickOption = (e: React.MouseEvent<HTMLElement>) => {
		const value = e.currentTarget.getAttribute('data-value');
		setSelectedOption(value);
	}

	return (
		<div className='analysis-btns'>
			<button
				className={`analysis-btn ${selectedResultsOption === 'detection' ? 'analysis-btn--active' : ''}`}
				data-value='detection'
				onClick={handleClickOption}
			>
				{t('analysisPage.analyzedData.resultsSwitchingButtons.detection')}
			</button>
			<button
				className={`analysis-btn ${selectedResultsOption === 'details' ? 'analysis-btn--active' : ''}`}
				data-value='details'
				onClick={handleClickOption}
			>
				{t('analysisPage.analyzedData.resultsSwitchingButtons.details')}
			</button>
		</div>
	)
}