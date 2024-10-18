import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const reaisPerQuestion = Number(process.env.REACT_APP_REAIS_PER_QUESTION);
const humanRevisionExtra = Number(process.env.REACT_APP_HUMAN_REVISION_EXTRA);

interface CheckoutState {
  pageCount: number;
  questionsCount: number;
  price: number;
  choice: string;
}

const initialState: CheckoutState = {
  pageCount: 0,
  questionsCount: 0,
  price: 0,
  choice: "",
};

// actions:

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setPageCount: (state, action: PayloadAction<number>) => {
      state.pageCount = action.payload;
      state.price = state.pageCount.valueOf() * reaisPerQuestion.valueOf();
    },
    setQuestionsCount: (state, action: PayloadAction<number>) => {
      state.questionsCount = action.payload;
      state.price = state.questionsCount.valueOf() * reaisPerQuestion.valueOf();
    },
    changePriceBasedOnModeChoice: (state, action: PayloadAction<string>) => {
      state.choice = action.payload;

      if (action.payload === "with_human_revision") {
        state.price += humanRevisionExtra;
      } else {
        state.price = state.pageCount.valueOf() * reaisPerQuestion.valueOf();
      }
    },
    resetCheckout: (state) => {
      state.pageCount = 0;
      state.price = 0;
      state.choice = "";
    },
  },
});

export const {
  setPageCount,
  setQuestionsCount, changePriceBasedOnModeChoice,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
