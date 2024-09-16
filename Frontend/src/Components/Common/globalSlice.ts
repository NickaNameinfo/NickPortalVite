import { createSlice } from "@reduxjs/toolkit";

export interface GlobalConfigState {
  isOpenRegister?: boolean;
  isOpenLogin?: boolean;
  currentloginDetails?: any;
  onRefreshCart?: boolean;
  globalSearch?: string;
  globalCategorySearch?: any;
  gloablSearchByPayment?: any;
  onSearchOpenStore?: boolean;
  storeList?:any;
}

const initialState: GlobalConfigState = {
  isOpenRegister: false,
  isOpenLogin: false,
  currentloginDetails: null,
  onRefreshCart: false,
  globalCategorySearch: null,
  gloablSearchByPayment : null,
  onSearchOpenStore: false,
  storeList:null
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
    }
  },
});

export const {
  onOpenResigter,
  onOpenLogin,
  updateLoginDetails,
  onRefreshCart,
  onSearchGlobal,
  onGlobalCategorySearch,
  onGlobalPaymentSearch,
  onUpdateOpenStore,
  onUpdateStoreList
} = globalConfigSlice.actions;
export default globalConfigSlice.reducer;
