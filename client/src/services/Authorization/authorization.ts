import { LoginResponse, RegisterResponse } from '../../types/AuthTypes/authTypes'

export const fetchRegister = async (email: string, username: string, password: string, passwordConfirm: string): Promise<RegisterResponse> => {
	try {
		const response = await fetch('http://localhost:5000/auth/registration', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, username, password, passwordConfirm }),
		});
		const data = await response.json();
		return { ...data, status: response.status };
	} catch (error) {
		console.error('Ошибка при регистрации: ' + error);
		throw error;
	}
}

export const fetchLogin = async (username: string, password: string, keepSignedIn: boolean): Promise<LoginResponse> => {
	try {
		const response = await fetch('http://localhost:5000/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		const data = await response.json();
		if (data.token && keepSignedIn) {
			localStorage.setItem('token', data.token);
		} else if (data.token && !keepSignedIn) {
			sessionStorage.setItem('token', data.token);
		};
		return { ...data, status: response.status };
	} catch (error) {
		console.error('Ошибка при авторизации: ' + error);
		throw error;
	}
}