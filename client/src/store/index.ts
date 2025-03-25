import { configureStore } from "@reduxjs/toolkit";
import passwordsReducer from './passwordsSlice';
import analysisReducer from './analysisSlice';
import reportsReducer from './reportsSlice';

const store = configureStore({
	reducer: {
		passwords: passwordsReducer,
		analysis: analysisReducer,
		reports: reportsReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;