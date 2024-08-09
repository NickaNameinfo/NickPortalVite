import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister: boolean;
  isOpenLogin: boolean;
  currentloginDetails: any;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
  isOpenLogin: false,
  currentloginDetails: null,
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
  },
});

export const { onOpenResigter, onOpenLogin, updateLoginDetails } =
  globalConfigSlice.actions;
export default globalConfigSlice.reducer;
