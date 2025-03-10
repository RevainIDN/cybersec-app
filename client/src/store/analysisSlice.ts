import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IpVirusTotalResponse, DomainVirusTotalResponse, UrlVirusTotalResponse, FileVirusTotalResponse } from "../types/AnalysisTypes/analysisResultsTypes";

interface AnalysisState {
	isLoading: boolean,
	selectedOption: string | null,
	ipAnalysisResults: IpVirusTotalResponse | null,
	domainAnalysisResults: DomainVirusTotalResponse | null,
	urlAnalysisResults: UrlVirusTotalResponse | null,
	fileAnalysisResults: FileVirusTotalResponse | null,
}

const initialState: AnalysisState = {
	isLoading: false,
	selectedOption: 'ip',
	ipAnalysisResults: null,
	domainAnalysisResults: null,
	urlAnalysisResults: null,
	fileAnalysisResults: null,
}

const analysisSlice = createSlice({
	name: 'analysis',
	initialState,
	reducers: {
		setIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		setSelectedOption: (state, action: PayloadAction<string | null>) => {
			state.selectedOption = action.payload;
		},
		setIpAnalysisResults: (state, action: PayloadAction<IpVirusTotalResponse | null>) => {
			state.ipAnalysisResults = action.payload;
		},
		setDomainAnalysisResults: (state, action: PayloadAction<DomainVirusTotalResponse | null>) => {
			state.domainAnalysisResults = action.payload;
		},
		setUrlAnalysisResults: (state, action: PayloadAction<UrlVirusTotalResponse | null>) => {
			state.urlAnalysisResults = action.payload;
		},
		setFileAnalysisResults: (state, action: PayloadAction<FileVirusTotalResponse | null>) => {
			state.fileAnalysisResults = action.payload;
		},
	}
});

export const { setIsLoading, setSelectedOption, setIpAnalysisResults, setDomainAnalysisResults, setUrlAnalysisResults, setFileAnalysisResults } = analysisSlice.actions;
export default analysisSlice.reducer;