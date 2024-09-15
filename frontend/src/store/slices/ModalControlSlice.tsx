import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalControlState {
  page: number,
  open: boolean
}

const initialState: ModalControlState = {
  page: 0,
  open: false,
};

// actions:

const modalControlSlice = createSlice({
  name: "modalControl",
  initialState,
  reducers: {
    openModal: (state) => {
      state.open = true;
    },
    closeModal: (state) => {
      state.open = false;
    },
    nextPage: (state) => {
      state.page += 1;
    },
    resetPage: (state) => {
      state.page = 0;
    },
  },
});

export const { openModal, closeModal, nextPage, resetPage } = modalControlSlice.actions;

export default modalControlSlice.reducer;
