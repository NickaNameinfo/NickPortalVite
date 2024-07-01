import { AnyAction, ThunkMiddleware, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { VendorApi } from "../views/vendors/Service.mjs";
import { AuthApi } from "../views/pages/Service.mjs";
import { CategoriesApi } from "../views/Categories/Service.mjs";

export const store = configureStore({
  reducer: {
    [VendorApi.reducerPath]: VendorApi.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [CategoriesApi.reducerPath]: CategoriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      VendorApi.middleware,
      AuthApi.middleware,
      CategoriesApi.middleware
    ),
});
setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
