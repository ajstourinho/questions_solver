import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import dotenv from "dotenv";

// dotenv.config({ path: '../../../.env' })
// const reaisPerPage = Number(process.env.REAIS_PER_PAGE);
const reaisPerQuestion = 8;
const humanRevisionExtra = 50;

interface CheckoutState {
  pageCount: number;
  price: number;
  choice: string;
}

const initialState: CheckoutState = {
  pageCount: 0,
  price: 0,
  choice: ""
};

// actions:

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageCount = action.payload;
      state.price = state.pageCount.valueOf() * reaisPerQuestion.valueOf();
    },
    changePriceBasedOnModeChoice: (state, action: PayloadAction<string>) => {
      state.choice = action.payload;;
      
      if (action.payload === "with_human_revision") {
        state.price += humanRevisionExtra;
      } else {
        state.price = state.pageCount.valueOf() * reaisPerQuestion.valueOf();
      }
    },
  },
});

export const { setPageNumber, changePriceBasedOnModeChoice } = checkoutSlice.actions;

export default checkoutSlice.reducer;
