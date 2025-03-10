import './AnalysisInput.css'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { setIsLoading, setSelectedOption, setIpAnalysisResults, setDomainAnalysisResults, setUrlAnalysisResults, setFileAnalysisResults } from '../../../store/analysisSlice';
import { fetchVirusTotalIp, fetchVirusTotalDomain, fetchVirusTotalUrlScan, fetchVirusTotalUrlReport, fetchVirusTotalFileScan, fetchVirusTotalFileReport } from '../../../services/AnalysisApi/virusTotalRequests';
import { buttonsValues } from './analysisInputHelpers';

export default function AnalysisInput() {
	const { t } = useTranslation();

	const dispatch = useDispatch<AppDispatch>();
	// Глобальное состояние
	const { selectedOption } = useSelector((state: RootState) => state.analysis)

	// Локальное логическое состояние
	const [enteredValue, setEnteredValue] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Обработчик переключения типа анализируемых данных
	const handleClickOption = (e: React.MouseEvent<HTMLElement>) => {
		const value = e.currentTarget.getAttribute('data-value');
		dispatch(setSelectedOption(value));
		setEnteredValue('');
		setSelectedFile(null);
		setErrorMessage(null);
	}

	// Обрааботчик ввода данных и их сохранение
	const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setEnteredValue(value);
		setErrorMessage(null);
	}

	// ООбработчик загрузки файла
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setSelectedFile(e.target.files[0]);
			setErrorMessage(null);
		}
	};

	// Обработчик отправки запроса на сервер при нажатие "Enter"
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleClick();
		}
	};

	// Функции валидации
	const isValidIp = (value: string): boolean => {
		const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return ipRegex.test(value);
	};

	const isValidDomain = (value: string): boolean => {
		const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
		return domainRegex.test(value);
	};

	const isValidUrl = (value: string): boolean => {
		const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,}(\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
		return urlRegex.test(value);
	};

	const isValidFile = (file: File | null): { isValid: boolean; message?: string } => {
		const MAX_FILE_SIZE = 32 * 1024 * 1024;

		if (!file) {
			return { isValid: false, message: t('analysisPage.analysisInput.fileErrorMessage') };
		}
		if (file.size > MAX_FILE_SIZE) {
			return { isValid: false, message: t('analysisPage.analysisInput.fileSizeErrorMessage') };
		}
		return { isValid: true };
	};

	// Обработчик отправки запроса на сервер
	const handleClick = async () => {
		if (!enteredValue && selectedOption !== 'file') {
			setErrorMessage(t('analysisPage.analysisInput.generalErrorMessage'));
			return;
		}

		// Валидация ввода
		if (selectedOption === 'ip' && !isValidIp(enteredValue)) {
			setErrorMessage(t('analysisPage.analysisInput.ipErrorMessage'));
			return;
		}
		if (selectedOption === 'domain' && !isValidDomain(enteredValue)) {
			setErrorMessage(t('analysisPage.analysisInput.domainErrorMessage'));
			return;
		}
		if (selectedOption === 'url' && !isValidUrl(enteredValue)) {
			setErrorMessage(t('analysisPage.analysisInput.urlErrorMessage'));
			return;
		}
		if (selectedOption === 'file') {
			const fileValidation = isValidFile(selectedFile);
			if (!fileValidation.isValid) {
				setErrorMessage(fileValidation.message || null);
				return;
			}
		}

		dispatch(setIsLoading(true));
		setErrorMessage(null)

		try {
			if (selectedOption === 'ip') {
				const ipData = await fetchVirusTotalIp(enteredValue);
				dispatch(setIpAnalysisResults(ipData));
			} else if (selectedOption === 'domain') {
				const domainData = await fetchVirusTotalDomain(enteredValue);
				dispatch(setDomainAnalysisResults(domainData));
			} else if (selectedOption === 'url') {
				const urlDataId = await fetchVirusTotalUrlScan(enteredValue);
				const urlData = await fetchVirusTotalUrlReport(urlDataId.data.id);
				dispatch(setUrlAnalysisResults(urlData))
			} else if (selectedOption === 'file') {
				if (!selectedFile) {
					console.error("Файл не выбран!");
					return;
				}

				setIsFileUploading(true);
				console.log("Отправка файла для анализа...");

				try {
					const fileDataId = await fetchVirusTotalFileScan(selectedFile);
					const analysisId = fileDataId?.data?.id;
					if (!analysisId) {
						console.error("Ошибка: не получен ID анализа файла");
						return;
					}

					console.log("ID для запроса статуса:", analysisId);
					const fileData = await fetchVirusTotalFileReport(analysisId);
					console.log(fileData)
					dispatch(setFileAnalysisResults(fileData));
				} catch (error) {
					console.error("Error parsing file:", error);
				} finally {
					setIsFileUploading(false);
				}
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
						onClick={handleClick}
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
						onClick={handleClick}
					>
						{t('analysisPage.analysisInput.inputButton')}
					</button>
				</div>
			)}
			{errorMessage && <p className="error-message">{errorMessage}</p>}
		</div>
	)
}