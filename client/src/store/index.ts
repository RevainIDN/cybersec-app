import { configureStore } from "@reduxjs/toolkit";
import passwordsReducer from './passwordsSlice';
import analysisReducer from './analysisSlice'

const store = configureStore({
	reducer: {
		passwords: passwordsReducer,
		analysis: analysisReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;