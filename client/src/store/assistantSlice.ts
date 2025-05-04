import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PasswordsState {
	isOpenChatAssistant: boolean,
	isOpen: boolean,
}

const initialState: PasswordsState = {
	isOpenChatAssistant: false,
	isOpen: false,
}

const assistantSlice = createSlice({
	name: 'assistant',
	initialState,
	reducers: {
		setIsOpenChatAssistant: (state, action: PayloadAction<boolean>) => {
			state.isOpenChatAssistant = action.payload;
		},
		setIsOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
	}
})

export const { setIsOpenChatAssistant, setIsOpen } = assistantSlice.actions;
export default assistantSlice.reducer;