import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilesState {
  files: File[],
  filenames: string[],
  originalFilename: string,
}

const initialState: FilesState = {
  files: [],
  filenames: [],
  originalFilename: "",
};

// actions:

const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<FilesState>) => {
      state.files = [...state.files, ...action.payload.files];
      state.filenames = [...state.filenames, ...action.payload.filenames];
      state.originalFilename = action.payload.originalFilename;
    },
    resetFiles: (state) => {
      state.files = [];
      state.filenames = [];
      state.originalFilename = "";
    },
  },
});

export const { addFiles, resetFiles } = filesSlice.actions;

export default filesSlice.reducer;
