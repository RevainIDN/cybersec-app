export interface Password {
	createdAt: string;
	_id: string;
	site: string;
	login: string;
	encryptedPassword: string;
	strength: 'weak' | 'medium' | 'strong';
}