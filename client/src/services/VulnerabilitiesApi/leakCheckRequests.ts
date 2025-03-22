import axios, { AxiosError } from "axios";
import { LeakCheckSuccessResponse, LeakCheckFalseResponse, PwnedPasswordsResponse } from "../../types/VulnerabilitiesTypes/vulnerabilitiesTypes";

export const fetchLeakCheckEmail = async (value: string): Promise<LeakCheckSuccessResponse | LeakCheckFalseResponse> => {
	try {
		const response = await axios.get('http://localhost:5000/api/leakcheck/check', {
			params: { value },
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при запросе к LeakCheck: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};

export const fetchPwnedPassword = async (password: string): Promise<PwnedPasswordsResponse> => {
	try {
		const response = await axios.get('http://localhost:5000/api/pwned/check', {
			params: { password },
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при запросе к Pwned Passwords: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};

export const fetchExpandShortUrl = async (shortUrl: string): Promise<string> => {
	const formattedUrl = shortUrl.startsWith('http://') || shortUrl.startsWith('https://')
		? shortUrl
		: `https://${shortUrl}`;
	try {
		const response = await axios.get('http://localhost:5000/api/expand/expand', {
			params: { shortUrl: formattedUrl },
		});
		return response.data.expandedUrl;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при расширении URL: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};