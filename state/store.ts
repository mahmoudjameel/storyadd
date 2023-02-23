import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
// import itnReducer from "./reducers/itnSlice";
import authSlice from "./reducers/authSlice";
import storiesSlice from "./reducers/storiesSlice";
import commentsSlice from "./reducers/commentsSlice";
import repliesSlice from "./reducers/repliesSlice";

export const store = configureStore({
  reducer: {
    authUser: authSlice,
    storiesStates: storiesSlice,
    commentsStates: commentsSlice,
    repliesStates: repliesSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
