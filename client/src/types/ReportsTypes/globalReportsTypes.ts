export interface ReportItemData {
	type: 'chart' | 'stat';
	chartType?: 'pie' | 'line' | 'bar';
	title?: string;
	labels?: string[];
	data?: number[];
	colors?: string[];
	info: string;
	advice?: string;
	description?: string;
	linkText: string;
	linkUrl: string;
	value?: string;
	source: string;
}