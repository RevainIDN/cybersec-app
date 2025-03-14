import { createSelector } from 'reselect';
import { RootState } from '../../../../../store';

// Типы для selectedOption
type AnalysisOption = 'ip' | 'domain' | 'url' | 'file';

const selectAnalysisState = (state: RootState) => state.analysis;
const selectSelectedOption = (state: RootState) => state.analysis.selectedOption;

const getAnalysisData = (selectedOption: string | null, state: RootState) => {
	if (!selectedOption) return null;
	switch (selectedOption as AnalysisOption) {
		case 'ip': return state.analysis.ipAnalysisResults;
		case 'domain': return state.analysis.domainAnalysisResults;
		case 'url': return state.analysis.urlAnalysisResults;
		case 'file': return state.analysis.fileAnalysisResults;
		default: return null;
	}
};

export const selectAnalysisInfo = createSelector(
	[selectAnalysisState, selectSelectedOption],
	(analysisState, selectedOption) => ({
		selectedOption,
		analysisData: getAnalysisData(selectedOption, { analysis: analysisState } as RootState),
	})
);