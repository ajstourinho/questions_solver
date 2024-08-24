import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dotenv from "dotenv";

// dotenv.config({ path: '../../../.env' })
// const reaisPerPage = Number(process.env.REAIS_PER_PAGE);
const reaisPerPage = 3;

interface CheckoutState {
  pageCount: Number;
  price: Number;
}

const initialState: CheckoutState = {
  pageCount: 0,
  price: 0,
};

// actions:

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<Number>) => {
      state.pageCount = action.payload;
      state.price = state.pageCount.valueOf() * reaisPerPage.valueOf();
    },
  },
});

export const { setPageNumber } = checkoutSlice.actions;

export default checkoutSlice.reducer;
