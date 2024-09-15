import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalControlState {
  modalPage: number,
  open: boolean
}

const initialState: ModalControlState = {
  modalPage: 0,
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
    nextModalPage: (state) => {
      state.modalPage += 1;
    },
    resetModalPage: (state) => {
      state.modalPage = 0;
    },
  },
});

export const { openModal, closeModal, nextModalPage, resetModalPage } =
  modalControlSlice.actions;

export default modalControlSlice.reducer;
