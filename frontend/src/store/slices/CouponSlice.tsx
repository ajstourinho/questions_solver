import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CouponState {
  couponString: string
  isValid: Boolean
  multiplier: number | undefined
}

const initialState: CouponState = {
  couponString: '',
  isValid: false,
  multiplier: undefined
};

// actions:

const couponSlice = createSlice({
  name: "coupons",
  initialState,
  reducers: {
    setCouponString: (state, action: PayloadAction<string | null>) => {
      if (action.payload){
        state.couponString = action.payload;
      }
      else{
        state.couponString = ''
      }
    },
    setCouponValidity: (state, action: PayloadAction<{ validity: boolean | null, multiplier?: number}>) => {
      if (action.payload.validity == true){
        state.isValid = true
        state.multiplier = action.payload.multiplier
      }
      else {
        state.isValid = false
        state.multiplier = undefined
      }
    },
    resetCoupon: (state) =>{
      state.couponString = initialState.couponString
      state.isValid = initialState.isValid
      state.multiplier = undefined
    }
    },
  },
);

export const { setCouponString, setCouponValidity, resetCoupon } = couponSlice.actions;

export default couponSlice.reducer;
