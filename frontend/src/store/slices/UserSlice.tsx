import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
