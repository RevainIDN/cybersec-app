import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const location = window.location.pathname;

interface PasswordsState {
	currentLink: string,
}

const initialState: PasswordsState = {
	currentLink: location,
}

const reportsSlice = createSlice({
	name: 'reports',
	initialState,
	reducers: {
		setCurrentLink: (state, action: PayloadAction<string>) => {
			state.currentLink = action.payload;
		},
	}
})

export const { setCurrentLink } = reportsSlice.actions;
export default reportsSlice.reducer;