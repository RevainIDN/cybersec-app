export interface RegisterResponse {
	message: string;
	status: number;
}

export interface LoginResponse {
	userId: string;
	token: string;
}