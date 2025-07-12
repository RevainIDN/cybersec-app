import axios from 'axios';
import { LoginResponse, RegisterResponse } from '../../types/AuthTypes/authTypes';

const serverUrl = import.meta.env.VITE_SERVER_URL;
const API_URL = `${serverUrl}/auth`;

// Запрос для регистрации пользователя
export const fetchRegister = async (
	email: string,
	username: string,
	password: string,
	passwordConfirm: string
): Promise<RegisterResponse> => {
	try {
		const response = await axios.post(`${API_URL}/registration`, {
			email,
			username,
			password,
			passwordConfirm,
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при регистрации: ', error);
		throw error;
	}
};

// Запрос для авторизации пользователя
export const fetchLogin = async (
	username: string,
	password: string,
	keepSignedIn: boolean
): Promise<LoginResponse> => {
	try {
		const response = await axios.post(`${API_URL}/login`, {
			username,
			password,
		});
		const { token, userId } = response.data;

		if (keepSignedIn) {
			localStorage.setItem('token', token);
		} else {
			sessionStorage.setItem('token', token);
		}

		return { token, userId };
	} catch (error) {
		console.error('Ошибка при авторизации: ', error);
		throw error;
	}
};

// Запрос для получения активности пользователя
export const fetchUserActivity = async (): Promise<any[]> => {
	const token = localStorage.getItem('token') || sessionStorage.getItem('token');
	try {
		const response = await axios.get(`${API_URL}/activity`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error('Ошибка при получении активности: ', error);
		throw error;
	}
};

// Запрос для удаления всех активностей пользователя
export const deleteAllUserActivities = async (): Promise<void> => {
	const token = localStorage.getItem('token') || sessionStorage.getItem('token');
	try {
		await axios.delete(`${API_URL}/activity`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	} catch (error) {
		console.error('Ошибка при удалении активностей: ', error);
		throw error;
	}
};