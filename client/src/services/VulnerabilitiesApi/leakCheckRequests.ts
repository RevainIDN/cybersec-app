import axios, { AxiosError } from "axios";
import { LeakCheckSuccessResponse, LeakCheckFalseResponse, PwnedPasswordsResponse } from "../../types/VulnerabilitiesTypes/vulnerabilitiesTypes";
import store from "../../store";

const serverUrl = import.meta.env.VITE_SERVER_URL;

export const fetchLeakCheckEmail = async (value: string): Promise<LeakCheckSuccessResponse | LeakCheckFalseResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`${serverUrl}/api/leakcheck/check`, {
			params: { value },
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при запросе к LeakCheck: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};

export const fetchPwnedPassword = async (password: string): Promise<PwnedPasswordsResponse> => {
	const token = store.getState().auth.token;
	try {
		const response = await axios.get(`${serverUrl}/api/pwned/check`, {
			params: { password },
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при запросе к Pwned Passwords: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};

export const fetchExpandShortUrl = async (shortUrl: string): Promise<string> => {
	const token = store.getState().auth.token;
	const formattedUrl = shortUrl.startsWith('http://') || shortUrl.startsWith('https://')
		? shortUrl
		: `https://${shortUrl}`;
	try {
		const response = await axios.get(`${serverUrl}/api/expand/expand`, {
			params: { url: formattedUrl },
			headers: token ? { Authorization: `Bearer ${token}` } : {},
		});
		return response.data.longUrl;
	} catch (error) {
		const axiosError = error as AxiosError;
		console.error('Ошибка при расширении URL: ', axiosError.response?.data || axiosError.message);
		throw axiosError.response?.data || axiosError;
	}
};