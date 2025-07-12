import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const location = window.location.pathname;

interface GeneralState {
	copiedPasswordIndex: number | null,
	currentLink: string,
	notification: Record<string, string> | null,
	overlay: boolean,
	openHideNavbar: boolean,
}

const initialState: GeneralState = {
	copiedPasswordIndex: null,
	currentLink: location,
	notification: null,
	overlay: false,
	openHideNavbar: false
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
		setOpenHideNavbar: (state, action: PayloadAction<boolean>) => {
			state.openHideNavbar = action.payload;
		}
	}
})

export const { setCopiedPasswordIndex, setCurrentLink, showNotification, setOverlay, setOpenHideNavbar } = generalSlice.actions;
export default generalSlice.reducer;