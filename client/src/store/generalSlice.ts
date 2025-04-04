import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const location = window.location.pathname;

interface GeneralState {
	copiedPasswordIndex: number | null,
	currentLink: string,
}

const initialState: GeneralState = {
	copiedPasswordIndex: null,
	currentLink: location,
}

const generalSlice = createSlice({
	name: 'general',
	initialState,
	reducers: {
		setCopiedPasswordIndex: (state, action: PayloadAction<number | null>) => {
			state.copiedPasswordIndex = action.payload;
		},
		setCurrentLink: (state, action: PayloadAction<string>) => {
			state.currentLink = action.payload;
		},
	}
})

export const { setCopiedPasswordIndex, setCurrentLink } = generalSlice.actions;
export default generalSlice.reducer;