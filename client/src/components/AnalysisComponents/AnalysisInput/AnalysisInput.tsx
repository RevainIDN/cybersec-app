import './AnalysisInput.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setIsLoading, setIpAnalysisResults, setDomainAnalysisResults, setSelectedOption } from '../../../store/analysisSlice';
import { fetchVirusTotalIp, fetchVirusTotalDomain } from '../../../services/AnalysisApi/apiIp';
import { buttonsValues } from './analysisInputHelpers';

export default function AnalysisInput() {
	const dispatch = useDispatch<AppDispatch>();
	// Глобальное состояние
	const { selectedOption } = useSelector((state: RootState) => state.analysis)

	// Локальное логическое состояние
	const [enteredValue, setEnteredValue] = useState<string>('');

	// Обработчик переключения типа анализируемых данных
	const handleClickOption = (e: React.MouseEvent<HTMLElement>) => {
		const value = e.currentTarget.getAttribute('data-value');
		dispatch(setSelectedOption(value));
		setEnteredValue('');
	}

	// Обрааботчик ввода данных и их сохранение
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
	}

	// Обработчик отправки запроса на сервер при нажатие "Enter"
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};

	// Обработчик отправки запроса на сервер
	const handleClick = async () => {
		if (!enteredValue) return;

		dispatch(setIsLoading(true));

		try {
			if (selectedOption === 'ip') {
				const ipData = await fetchVirusTotalIp(enteredValue);
				dispatch(setIpAnalysisResults(ipData));
			} else if (selectedOption === 'domain') {
				const domainData = await fetchVirusTotalDomain(enteredValue);
				dispatch(setDomainAnalysisResults(domainData));
			}
		} catch (error) {
			console.error("Error while querying VirusTotal:", error);
		} finally {
			dispatch(setIsLoading(false));
		}
	};

	// Логика динамичного изменения placeholder'а
	const selectedButton = buttonsValues.find(button => button.value === selectedOption);

	return (
		<div className='analysis-cont section'>
			<div className='analysis-btns'>
				{buttonsValues.map((button) => (
					<button
						key={button.id}
						data-value={button.value}
						data-endpoint={button.endpoint}
						className={`analysis-btn ${selectedOption === button.value ? 'analysis-btn--active' : ''}`}
						onClick={handleClickOption}>{button.value.toUpperCase()}
					</button>
				))}
			</div>
			<div className='analysis-input-cont'>
				<input
					className='analysis-input'
					type="text"
					placeholder={selectedButton ? selectedButton.placeholder : ''}
					value={enteredValue}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
				/>
				<button
					className='input-btn button'
					onClick={handleClick}
				>
					Анализ
				</button>
			</div>
		</div>
	)
}