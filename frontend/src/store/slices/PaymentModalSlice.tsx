import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentModalState {
  open: boolean;
}

const initialState: PaymentModalState = {
    open: false,
};

// actions:

const paymentModalSlice = createSlice({
  name: "paymentModal",
  initialState,
  reducers: {
    openPaymentModal: (state) => {
      state.open = true;
    },
    closePaymentModal: (state) => {
      state.open = false;
    },
  },
});

export const { openPaymentModal, closePaymentModal } = paymentModalSlice.actions;

export default paymentModalSlice.reducer;
