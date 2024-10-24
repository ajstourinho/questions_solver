import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceState {
  deviceType: DeviceType;
}

const initialState: DeviceState = {
  deviceType: 'desktop',
};

const deviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    setDeviceType: (state, action: PayloadAction<DeviceType>) => {
      state.deviceType = action.payload;
    },
  },
});

export const { setDeviceType } = deviceSlice.actions;
export default deviceSlice.reducer;
