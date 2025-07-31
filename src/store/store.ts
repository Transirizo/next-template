import { configureStore } from "@reduxjs/toolkit";
import assetsReducer from "./assets";
import userReducer from "./user";

const store = configureStore({
  reducer: {
    assets: assetsReducer,
    user: userReducer,
  },
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
