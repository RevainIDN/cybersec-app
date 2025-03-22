export interface LeakCheckSuccessResponse {
	fields: string[];
	found: number;
	sources: {
		date: string;
		name: string;
	}[];
	success: boolean;
}

export interface LeakCheckFalseResponse {
	data: {
		error: string;
		success: boolean;
	};
	message: string;
}

export interface PwnedPasswordsResponse {
	data: {
		found: boolean;
		count: number;
	};
	message: string;
}