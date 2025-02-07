import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  onRefreshCart: boolean;
  isOpenLogin: boolean;
  currentloginDetails: any;
  isProductDetailsModalOpen?: any;
  isOpenCartModal: any;
  isOpenOrderModal: any;
}

const initialState: GlobalConfigState = {
  onRefreshCart: false,
  isOpenLogin: false,
  currentloginDetails: null,
  isProductDetailsModalOpen: {
    isOpen: false,
    item: null,
  },
  isOpenCartModal: false,
  isOpenOrderModal: false,
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
    onUpdateProductDetailsModal: (state, action) => {
      state.isProductDetailsModalOpen = action?.payload;
    },
    onUpdateCartModal: (state, action) => {
      state.isOpenCartModal = action?.payload;
    },
    onUpdateOrderModal: (state, action) => {
      state.isOpenOrderModal = action?.payload;
    },
    onResetModals: (state) => {
      state.isProductDetailsModalOpen = {
        isOpen: false,
        item: null,
      };
      state.isOpenCartModal = false;
      state.isOpenOrderModal = false;
    },
  },
});

export const {
  onRefreshCart,
  onOpenLogin,
  updateLoginDetails,
  onUpdateProductDetailsModal,
  onUpdateCartModal,
  onUpdateOrderModal,
  onResetModals,
} = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
