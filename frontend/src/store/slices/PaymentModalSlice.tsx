import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentModalState {
  open: boolean;
  pixCopiaECola: string;
}

const initialState: PaymentModalState = {
  open: false,
  pixCopiaECola: "Carregando...",
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
    setPixCopiaECola: (state, action: PayloadAction<string>) => {
      state.pixCopiaECola = action.payload;
    },
  },
});

export const { openPaymentModal, closePaymentModal, setPixCopiaECola } = paymentModalSlice.actions;

export default paymentModalSlice.reducer;
