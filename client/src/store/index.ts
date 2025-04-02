import { configureStore } from "@reduxjs/toolkit";
import passwordsReducer from './passwordsSlice';
import analysisReducer from './analysisSlice';
import reportsReducer from './reportsSlice';
import authReducer from './authSlice';

const store = configureStore({
	reducer: {
		passwords: passwordsReducer,
		analysis: analysisReducer,
		reports: reportsReducer,
		auth: authReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;