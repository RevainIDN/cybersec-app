import { configureStore } from "@reduxjs/toolkit";
import passwordsReducer from './passwordsSlice';

const store = configureStore({
	reducer: {
		passwords: passwordsReducer,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;