import './AnalysisInput.css'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setSelectedOption } from '../../../store/analysisSlice';
import { buttonsValues } from './analysisInputHelpers';
import { useAnalysisInput } from '../../../hooks/Analysis/useAnalysisInput';
import Notification from '../../GeneralComponents/Notification/Notification';

export default function AnalysisInput() {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();

	// Глобальные состояния
	const { selectedOption } = useSelector((state: RootState) => state.analysis)
	const { notification } = useSelector((state: RootState) => state.general)

	// Использование кастомного хука для управления вводом и анализом
	const { enteredValue, setEnteredValue, selectedFile, setSelectedFile, isFileUploading, handleAnalysis } = useAnalysisInput();

	// Обработчик переключения типа анализируемых данных
	const handleClickOption = (e: React.MouseEvent<HTMLElement>) => {
		const value = e.currentTarget.getAttribute('data-value');
		dispatch(setSelectedOption(value));
		setEnteredValue('');
		setSelectedFile(null);
	}

	// Обрааботчик ввода данных и их сохранение
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
	}

	// ООбработчик загрузки файла
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
		}
	};

	// Обработчик отправки запроса на сервер при нажатие "Enter"
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleAnalysis();
		}
	};

	// Логика динамичного изменения placeholder'а
	const selectedButton = buttonsValues.find(button => button.value === selectedOption);

	return (
		<div className='analysis-cont'>
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
			{selectedOption === 'file' ? (
				<div className='file-upload-cont'>
					<label htmlFor="file-input">
						<img
							className='file-upload-img'
							src="download.svg"
							alt="Upload file"
						/>
					</label>
					<input
						id="file-input"
						className='file-upload-input'
						type="file"
						onChange={handleFileChange}
					/>
					{selectedFile?.name &&
						<div
							className='file-name'
							onClick={() => setSelectedFile(null)}
						>
							<p>{selectedFile.name}</p>
							<img
								src="cross.svg"
								alt="Cross"
							/>
						</div>}
					<button
						className='file-upload-btn'
						onClick={handleAnalysis}
						disabled={!selectedFile || isFileUploading}
					>
						{isFileUploading
							? t('analysisPage.analysisInput.isFileUploaded')
							: t('analysisPage.analysisInput.isFileUploading')}
					</button>
				</div>
			) : (
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
						onClick={handleAnalysis}
					>
						{t('analysisPage.analysisInput.inputButton')}
					</button>
				</div>
			)}
			{notification && <Notification message={notification.message} time={3000} />}
		</div>
	)
}