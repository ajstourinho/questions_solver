import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentModalState {
  pixCopiaECola: string;
  txid: string;
  paymentStatus: string;
}

const initialState: PaymentModalState = {
  pixCopiaECola: "Carregando...",
  txid: "",
  paymentStatus: "",
};

// actions:

const paymentModalSlice = createSlice({
  name: "paymentModal",
  initialState,
  reducers: {
    setPixCopiaECola: (state, action: PayloadAction<string>) => {
      state.pixCopiaECola = action.payload;
    },
    setTxid: (state, action: PayloadAction<string>) => {
      state.txid = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<string>) => {
      state.paymentStatus = action.payload;
    },
  },
});

export const { setPixCopiaECola, setTxid, setPaymentStatus } =
  paymentModalSlice.actions;

export default paymentModalSlice.reducer;
