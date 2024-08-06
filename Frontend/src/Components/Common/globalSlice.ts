import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister: boolean;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
};

const globalConfigSlice = createSlice({
  name: "global-config",
  initialState,
  reducers: {
    onOpenResigter: (state, action) => {
      state.isOpenRegister = action.payload;
    },
  },
});

export const { onOpenResigter } = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
