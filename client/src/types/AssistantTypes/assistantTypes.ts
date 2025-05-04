export interface AllMessages {
	id: number;
	message: string;
	from: 'user' | 'bot';
}