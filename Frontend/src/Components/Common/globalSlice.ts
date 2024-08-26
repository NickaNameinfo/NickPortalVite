import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister: boolean;
  isOpenLogin: boolean;
  currentloginDetails: any;
  onRefreshCart: boolean;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
  isOpenLogin: false,
  currentloginDetails: null,
  onRefreshCart: false,
};

const globalConfigSlice = createSlice({
  name: "global-config",
  initialState,
  reducers: {
    onOpenResigter: (state, action) => {
      state.isOpenRegister = action.payload;
    },
    onOpenLogin: (state, action) => {
      state.isOpenLogin = action.payload;
    },
    updateLoginDetails: (state, action) => {
      state.currentloginDetails = action.payload;
    },
    onRefreshCart: (state, action) => {
      state.onRefreshCart = action.payload;
    },
  },
});

export const { onOpenResigter, onOpenLogin, updateLoginDetails, onRefreshCart } =
  globalConfigSlice.actions;
export default globalConfigSlice.reducer;
