import { configureStore } from "@reduxjs/toolkit";
import FilesSlice from "./slices/FilesSlice";
import CheckoutSlice from "./slices/CheckoutSlice";

export const store = configureStore({
  reducer: {
    filesSlice: FilesSlice,
    checkoutSlice: CheckoutSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; //used for async actions
