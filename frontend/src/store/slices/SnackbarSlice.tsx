import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SnackbarState {
  status: 'success' | 'error' | 'info' | 'warning';
  message: string;
  open: boolean;
}

const initialState: SnackbarState = {
  status: 'info',
  message: '',
  open: false,
};

const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: (state, action: PayloadAction<{ status: 'success' | 'error' | 'info' | 'warning'; message: string }>) => {
      state.status = action.payload.status;
      state.message = action.payload.message;
      state.open = true;
    },
    hideSnackbar: (state) => {
      state.open = false;
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
