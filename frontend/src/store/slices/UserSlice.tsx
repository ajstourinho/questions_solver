import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import dotenv from "dotenv";

// dotenv.config({ path: '../../../.env' })
// const reaisPerPage = Number(process.env.REAIS_PER_PAGE);

interface UserState {
  email: string,
}

const initialState: UserState = {
  email: "",
};

// actions:

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    resetUser: (state) => {
      state.email = "";
    },
  },
});

export const { setUserEmail, resetUser } = userSlice.actions;

export default userSlice.reducer;
