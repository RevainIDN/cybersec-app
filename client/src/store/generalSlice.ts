import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const location = window.location.pathname;

interface GeneralState {
	copiedPasswordIndex: number | null,
	currentLink: string,
	notification: Record<string, string> | null,
	overlay: boolean,
}

const initialState: GeneralState = {
	copiedPasswordIndex: null,
	currentLink: location,
	notification: null,
	overlay: false,
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
		showNotification: (state, action: PayloadAction<Record<string, string> | null>) => {
			state.notification = action.payload;
		},
		setOverlay: (state, action: PayloadAction<boolean>) => {
			state.overlay = action.payload;
		},
	}
})

export const { setCopiedPasswordIndex, setCurrentLink, showNotification, setOverlay } = generalSlice.actions;
export default generalSlice.reducer;