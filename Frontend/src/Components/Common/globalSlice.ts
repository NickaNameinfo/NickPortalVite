import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister: boolean;
  isOpenLogin: boolean;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
  isOpenLogin: false,
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
  },
});

export const { onOpenResigter, onOpenLogin } = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
