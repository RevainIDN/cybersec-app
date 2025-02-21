import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface GeneralState {
	copiedPasswordIndex: number | null,
}

const initialState: GeneralState = {
	copiedPasswordIndex: null,
}

const generalSlice = createSlice({
	name: 'general',
	initialState,
	reducers: {
		setCopiedPasswordIndex: (state, action: PayloadAction<number | null>) => {
			state.copiedPasswordIndex = action.payload;
		},
	}
})

export const { setCopiedPasswordIndex } = generalSlice.actions;
export default generalSlice.reducer;