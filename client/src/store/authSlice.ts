import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
	token: string | undefined,
	isLoading: boolean,
}

const initialState: AuthState = {
	token: undefined,
	isLoading: true,
}

const authSlice = createSlice({
	name: 'general',
	initialState,
	reducers: {
		setToken: (state, action: PayloadAction<string | undefined>) => {
			state.token = action.payload;
			state.isLoading = false;
		},
		clearToken: (state) => {
			state.token = undefined;
			state.isLoading = false;
		}
	}
})

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;