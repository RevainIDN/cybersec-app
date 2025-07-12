import axios from 'axios';
import { AutoCheckItem, AutoCheckSubType, AutoCheckType } from '../../types/AccountTypes/autoCheckTypes';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const API_URL = `${serverUrl}/auth`;

// Получение всех автопроверок
export const fetchAutoChecks = async (token: string): Promise<AutoCheckItem[]> => {
	try {
		const response = await axios.get(`${API_URL}/autochecks`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка получения автопроверок:', error);
		throw error;
	}
};

// Запуск всех автопроверок
export const runAutoChecks = async (token: string): Promise<AutoCheckItem[]> => {
	try {
		const response = await axios.post(`${API_URL}/autochecks/run`, {}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка запуска автопроверок:', error);
		throw error;
	}
};

// Создание новой автопроверки
export const createAutoCheck = async (
	token: string,
	data: {
		type: AutoCheckType;
		subType: AutoCheckSubType;
		input: string;
		checkOnLogin: boolean;
	}
): Promise<AutoCheckItem> => {
	try {
		const response = await axios.post(`${API_URL}/autocheck`, data, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.autoCheck;
	} catch (error) {
		console.error('Ошибка создания автопроверки:', error);
		throw error;
	}
};

// Запуск одной автопроверки
export const runSingleAutoCheck = async (token: string, id: string): Promise<AutoCheckItem> => {
	try {
		const response = await axios.post(`${API_URL}/autochecks/run/${id}`, {}, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка выполнения проверки:', error);
		throw error;
	}
};

// Удаление автопроверки
export const deleteAutoCheck = async (token: string, id: string): Promise<void> => {
	try {
		await axios.delete(`${API_URL}/autocheck/${id}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
	} catch (error) {
		console.error('Ошибка удаления автопроверки:', error);
		throw error;
	}
};