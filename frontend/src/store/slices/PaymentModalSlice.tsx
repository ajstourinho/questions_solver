import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PaymentModalState {
  pixCopiaECola: string;
}

const initialState: PaymentModalState = {
  pixCopiaECola: "Carregando...",
};

// actions:

const paymentModalSlice = createSlice({
  name: "paymentModal",
  initialState,
  reducers: {
    setPixCopiaECola: (state, action: PayloadAction<string>) => {
      state.pixCopiaECola = action.payload;
    },
  },
});

export const { setPixCopiaECola } = paymentModalSlice.actions;

export default paymentModalSlice.reducer;
