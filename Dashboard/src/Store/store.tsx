import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { VendorApi } from "../views/vendors/Service.mjs";
import { VendorProductApi } from "../views/VendorProducts/Service.mjs";
import { AuthApi } from "../views/pages/Service.mjs";
import { CategoriesApi } from "../views/Categories/Service.mjs";
import { ProductsApi } from "../views/Products/Service.mjs";
import { VendorStockApi } from "../views/vendors/Stock/Service.mjs";
import { StoreApi } from "../views/Store/Service.mjs";
import {SucriptioniApi} from "../views/Subscriptions/Service.mjs";
import {GlobalApi} from "../Service.mjs"
import globalConfigSlice from "../Common/globalSlice"
import { BillingApi } from "../views/Billing/Service.mjs";
export const store = configureStore({
  reducer: {
    [VendorApi.reducerPath]: VendorApi.reducer,
    [VendorProductApi.reducerPath]: VendorProductApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [CategoriesApi.reducerPath]: CategoriesApi.reducer,
    [ProductsApi.reducerPath]: ProductsApi.reducer,
    [VendorStockApi.reducerPath]: VendorStockApi.reducer,
    [StoreApi.reducerPath]: StoreApi.reducer,
    [GlobalApi.reducerPath]: GlobalApi.reducer,
    [SucriptioniApi.reducerPath]: SucriptioniApi.reducer,
    [BillingApi.reducerPath]: BillingApi.reducer,
    globalConfig: globalConfigSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      VendorProductApi.middleware,
      VendorApi.middleware,
      AuthApi.middleware,
      CategoriesApi.middleware,
      ProductsApi.middleware,
      VendorStockApi.middleware,
      StoreApi.middleware,
      GlobalApi.middleware,
      SucriptioniApi.middleware,
      BillingApi.middleware
    ),
});
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
