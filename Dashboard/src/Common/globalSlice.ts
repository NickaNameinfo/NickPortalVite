import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  onRefreshCart: boolean;
}

const initialState: GlobalConfigState = {
  onRefreshCart: false,
};

const globalConfigSlice = createSlice({
  name: "global-config",
  initialState,
  reducers: {
    onRefreshCart: (state, action) => {
      state.onRefreshCart = action.payload;
    },
  },
});

export const { onRefreshCart } = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
