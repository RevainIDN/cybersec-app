import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PasswordsState {
	listGeneratedPasswords: string[],
}

const initialState: PasswordsState = {
	listGeneratedPasswords: [],
}

const passwordsSlice = createSlice({
	name: 'passwords',
	initialState,
	reducers: {
		setListGeneratedPasswords: (state, action: PayloadAction<string[]>) => {
			state.listGeneratedPasswords = action.payload;
		},
	}
})

export const { setListGeneratedPasswords } = passwordsSlice.actions;
export default passwordsSlice.reducer;