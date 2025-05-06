import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { showNotification } from '../../store/generalSlice';
import { setIsLoading, setIpAnalysisResults, setDomainAnalysisResults, setUrlAnalysisResults, setFileAnalysisResults } from '../../store/analysisSlice';
import { fetchVirusTotalIp, fetchVirusTotalDomain, fetchVirusTotalUrlScan, fetchVirusTotalFileScan, fetchVirusTotalFileReport } from '../../services/AnalysisApi/virusTotalRequests';

// Кастомный хук для управления логикой ввода и анализа
export const useAnalysisInput = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch<AppDispatch>();
	const { selectedOption } = useSelector((state: RootState) => state.analysis);

	// Локальное состояние
	const [enteredValue, setEnteredValue] = useState<string>('');
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isFileUploading, setIsFileUploading] = useState<boolean>(false);

	// Валидация ввода
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

	const isValidFile = (file: File | null): { isValid: boolean; message: string } => {
		const MAX_FILE_SIZE = 32 * 1024 * 1024;
		if (!file) {
			return { isValid: false, message: t('analysisPage.analysisInput.fileErrorMessage') };
		}
		if (file.size > MAX_FILE_SIZE) {
			return { isValid: false, message: t('analysisPage.analysisInput.fileSizeErrorMessage') };
		}
		return { isValid: true, message: 'analysisPage.analysisInput.fileOk' };
	};

	// Отправка запроса на анализ
	const handleAnalysis = async () => {
		if (!enteredValue && selectedOption !== 'file') {
			dispatch(showNotification({
				message: t('analysisPage.analysisInput.generalErrorMessage'),
				type: 'error'
			}))
			return;
		}

		if (selectedOption === 'ip' && !isValidIp(enteredValue)) {
			dispatch(showNotification({
				message: t('analysisPage.analysisInput.ipErrorMessage'),
				type: 'error'
			}))
			return;
		}
		if (selectedOption === 'domain' && !isValidDomain(enteredValue)) {
			dispatch(showNotification({
				message: t('analysisPage.analysisInput.domainErrorMessage'),
				type: 'error'
			}))
			return;
		}
		if (selectedOption === 'url' && !isValidUrl(enteredValue)) {
			dispatch(showNotification({
				message: t('analysisPage.analysisInput.urlErrorMessage'),
				type: 'error'
			}))
			return;
		}
		if (selectedOption === 'file') {
			const fileValidation = isValidFile(selectedFile);
			if (!fileValidation.isValid) {
				dispatch(showNotification({
					message: fileValidation.message,
					type: 'error'
				}))
				return;
			}
		}

		dispatch(setIsLoading(true));

		try {
			if (selectedOption === 'ip') {
				const ipData = await fetchVirusTotalIp(enteredValue);
				dispatch(setIpAnalysisResults(ipData));
			} else if (selectedOption === 'domain') {
				const domainData = await fetchVirusTotalDomain(enteredValue);
				dispatch(setDomainAnalysisResults(domainData));
			} else if (selectedOption === 'url') {
				const urlData = await fetchVirusTotalUrlScan(enteredValue);
				dispatch(setUrlAnalysisResults(urlData));
			} else if (selectedOption === 'file' && selectedFile) {
				setSelectedFile(null);
				setIsFileUploading(true);
				try {
					const fileDataId = await fetchVirusTotalFileScan(selectedFile);
					const analysisId = fileDataId?.data?.id;
					if (!analysisId) {
						dispatch(showNotification({
							message: "Не удалось получить ID анализа файла",
							type: 'error'
						}))
						return;
					}
					const fileData = await fetchVirusTotalFileReport(analysisId);
					if (fileData) {
						dispatch(setFileAnalysisResults(fileData));
					} else {
						dispatch(showNotification({
							message: "Анализ файла не завершён или данные недоступны",
							type: 'error'
						}))
					}
				} catch (error) {
					dispatch(showNotification({
						message: "Ошибка при анализе файла",
						type: 'error'
					}))
				} finally {
					setIsFileUploading(false);
				}
			}
		} catch (error: any) {
			console.error("Error while querying VirusTotal:", error);
		} finally {
			dispatch(setIsLoading(false));
		}
	};

	return {
		enteredValue,
		setEnteredValue,
		selectedFile,
		setSelectedFile,
		isFileUploading,
		handleAnalysis,
	};
};