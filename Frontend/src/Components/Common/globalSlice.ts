import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister?: boolean;
  isOpenLogin?: boolean;
  isOpenForget?: boolean;
  currentloginDetails?: any;
  onRefreshCart?: boolean;
  globalSearch?: string;
  globalCategorySearch?: any;
  gloablSearchByPayment?: any;
  onSearchOpenStore?: boolean;
  storeList?: any;
  isProductDetailsModalOpen?: any;
  isOpenCartModal: any;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
  isOpenLogin: false,
  isOpenForget: false,
  currentloginDetails: null,
  onRefreshCart: false,
  globalCategorySearch: null,
  gloablSearchByPayment: null,
  onSearchOpenStore: false,
  storeList: null,
  isProductDetailsModalOpen: {
    isOpen: false,
    item: null,
  },
  isOpenCartModal: false,
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
    onOpenForget: (state, action) => {
      state.isOpenForget = action.payload;
    },
    updateLoginDetails: (state, action) => {
      state.currentloginDetails = action.payload;
    },
    onRefreshCart: (state, action) => {
      state.onRefreshCart = action.payload;
    },
    onSearchGlobal: (state, action) => {
      state.globalSearch = action.payload;
    },
    onGlobalCategorySearch: (state, action) => {
      state.globalCategorySearch = action.payload;
    },
    onGlobalPaymentSearch: (state, action) => {
      state.gloablSearchByPayment = action.payload;
    },
    onUpdateOpenStore: (state, action) => {
      state.onSearchOpenStore = action.payload;
    },
    onUpdateStoreList: (state, action) => {
      state.storeList = action?.payload;
    },
    onUpdateProductDetailsModal: (state, action) => {
      state.isProductDetailsModalOpen = action?.payload;
    },
    onUpdateCartModal: (state, action) => {
      state.isOpenCartModal = action?.payload;
    },
    onResetModals: (state) => {
      state.isProductDetailsModalOpen = {
        isOpen: false,
        item: null,
      };
      state.isOpenCartModal = false;
    },
  },
});

export const {
  onOpenResigter,
  onOpenLogin,
  onOpenForget,
  updateLoginDetails,
  onRefreshCart,
  onSearchGlobal,
  onGlobalCategorySearch,
  onGlobalPaymentSearch,
  onUpdateOpenStore,
  onUpdateStoreList,
  onUpdateProductDetailsModal,
  onUpdateCartModal,
  onResetModals,
} = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
