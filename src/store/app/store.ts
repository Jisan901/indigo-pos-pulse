import type { Action, ThunkAction } from "@reduxjs/toolkit"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import baseApi from "../api/baseApi"
import storage from "redux-persist/lib/storage"
import {
  persistReducer,
  persistStore
} from "redux-persist";
import userReducer from "../features/userSlice"
import themeSlice from "../features/themeSlice"


// persi
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const rootPersistReducer = combineReducers({
  userReducer,
  theme: themeSlice
})
const persistedReducer = persistReducer(persistConfig, rootPersistReducer);
// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
const rootReducer = combineReducers({
  local: persistedReducer,
  [baseApi.reducerPath]: baseApi.reducer
})

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>
export type PersistState = ReturnType<typeof persistReducer>

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeStore = (preloadedState?: any) => {
  const store = configureStore({
    reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware({ serializableCheck: { ignoreActions: true } }).concat(baseApi.middleware)
    },
    preloadedState,
  })
  // configure listeners using the provided defaults
  // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()
export const persist = persistStore(store);

// Infer the type of `store`
export type AppStore = typeof store
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
