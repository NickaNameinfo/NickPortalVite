import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  onRefreshCart: boolean;
  isOpenLogin: boolean;
  currentloginDetails: any;
}

const initialState: GlobalConfigState = {
  onRefreshCart: false,
  isOpenLogin: false,
  currentloginDetails: null,
};

const globalConfigSlice = createSlice({
  name: "global-config",
  initialState,
  reducers: {
    onRefreshCart: (state, action) => {
      state.onRefreshCart = action.payload;
    },
    onOpenLogin: (state, action) => {
      state.isOpenLogin = action.payload;
    },
    updateLoginDetails: (state, action) => {
      state.currentloginDetails = action.payload;
    },
  },
});

export const { onRefreshCart, onOpenLogin, updateLoginDetails } = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
