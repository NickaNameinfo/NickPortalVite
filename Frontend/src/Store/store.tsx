import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { VendorApi } from "../views/pages/Vendor/Service.mjs";
import { ProductApi } from "../views/pages/Product/Service.mjs";
import { StoreApi } from "../views/pages/Store/Service.mjs";
import { CategoryApi } from "../views/pages/Category/Service.mjs";
import { AuthApi } from "../views/pages/login/Service.mjs";

export const store = configureStore({
  reducer: {
    [VendorApi.reducerPath]: VendorApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [StoreApi.reducerPath]: StoreApi.reducer,
    [CategoryApi.reducerPath]: CategoryApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      VendorApi.middleware,
      ProductApi.middleware,
      StoreApi.middleware,
      CategoryApi.middleware,
      AuthApi.middleware
    ),
});
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
