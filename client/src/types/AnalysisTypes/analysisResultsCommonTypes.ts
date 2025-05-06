// Базовый интерфейс для общих атрибутов анализа
export interface BaseVirusTotalAttributes {
	last_analysis_results: Record<string, AnalysisResult>;
	last_analysis_date: number;
	reputation: number;
}

// Интерфейс для результатов анализа движка
export interface AnalysisResult {
	category: string;
	engine_name: string;
	result: string;
}

// Обобщённый интерфейс для общей информации (используется в GeneralInfo)
export interface GeneralVirusTotalResponse {
	registrar?: string;
	creation_date?: number;
	url?: string;
	last_http_response_code?: number;
	meaningful_name?: string;
	size?: number;
	last_analysis_results?: Record<string, { result: string }>;
	last_analysis_date?: number;
	reputation?: number;
}