import { configureStore } from "@reduxjs/toolkit";
import FilesSlice from "./slices/FilesSlice";
import CheckoutSlice from "./slices/CheckoutSlice";
import PaymentModalSlice from "./slices/PaymentModalSlice";
import ModalControlSlice from "./slices/ModalControlSlice";
import UserSlice from "./slices/UserSlice";
import SnackbarSlice from "./slices/SnackbarSlice";
import DeviceSlice from "./slices/deviceSlice";

export const store = configureStore({
  reducer: {
    filesSlice: FilesSlice,
    checkoutSlice: CheckoutSlice,
    paymentModalSlice: PaymentModalSlice,
    modalControlSlice: ModalControlSlice,
    userSlice: UserSlice,
    snackbarSlice: SnackbarSlice, 
    deviceSlice: DeviceSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; //used for async actions
