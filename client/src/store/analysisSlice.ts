import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IpVirusTotalResponse, DomainVirusTotalResponse } from "../types/AnalysisTypes/analysisResultsTypes";

interface AnalysisState {
	isLoading: boolean,
	selectedOption: string | null,
	ipAnalysisResults: IpVirusTotalResponse | null,
	domainAnalysisResults: DomainVirusTotalResponse | null,
}

const initialState: AnalysisState = {
	isLoading: false,
	selectedOption: 'ip',
	ipAnalysisResults: null,
	domainAnalysisResults: null,
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
	}
});

export const { setIsLoading, setSelectedOption, setIpAnalysisResults, setDomainAnalysisResults } = analysisSlice.actions;
export default analysisSlice.reducer;