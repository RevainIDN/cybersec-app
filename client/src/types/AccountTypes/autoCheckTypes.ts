export interface AutoCheckItem {
	_id: string;
	type: AutoCheckType;
	subType: AutoCheckSubType;
	input: string;
	checkOnLogin: boolean;
	lastResult?: string;
	lastChecked?: string;
}

export type AutoCheckType = 'analysis' | 'leak';
export type AutoCheckSubType = 'ip' | 'url' | 'domain' | 'file' | 'email' | 'password';