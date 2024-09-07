import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilesState {
  files: File[],
  filenames: string[]
}

const initialState: FilesState = {
  files: [],
  filenames: []
};

// actions:

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<FilesState>) => {
      state.files = [...state.files, ...action.payload.files];
      state.filenames = [...state.filenames, ...action.payload.filenames];
    },
    reset: (state) => {
      state.files = [];
      state.filenames = [];
    },
  },
});

export const { add, reset } = filesSlice.actions;

export default filesSlice.reducer;
