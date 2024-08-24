import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilesState {
  files: File[];
}

const initialState: FilesState = {
  files: [],
};

// actions:

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<File[]>) => {
      let newArray = [...state.files, ...action.payload];
      state.files = newArray;
    },
    reset: (state, action: PayloadAction<File[]>) => {
      let newArray = [...action.payload];
      state.files = newArray;
    },
  },
});

export const { add, reset } = filesSlice.actions;

export default filesSlice.reducer;
