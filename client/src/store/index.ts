import { configureStore } from "@reduxjs/toolkit";
import generalReducer from './generalSlice';
import passwordsReducer from './passwordsSlice';
import analysisReducer from './analysisSlice';
import authReducer from './authSlice';

const store = configureStore({
	reducer: {
		general: generalReducer,
		passwords: passwordsReducer,
		analysis: analysisReducer,
		auth: authReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;