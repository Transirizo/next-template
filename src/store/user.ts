import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { handleJSAPIAccess, handleUserAuth } from "@/lib/feishu-auth";
import { User } from "@/types/asset";

export interface UserInfo {
  access_token?: string;
  avatar_big?: string;
  avatar_middle?: string;
  avatar_thumb?: string;
  avatar_url?: string;
  en_name?: string;
  expires_in?: number;
  name?: string;
  open_id?: string;
  refresh_expires_in?: number;
  refresh_token?: string;
  sid?: string;
  tenant_key?: string;
  token_type?: string;
  union_id?: string;
  user_id?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const USER_STORAGE_KEY = "user_info";

// 异步 thunks
export const initializeAuth = createAsyncThunk(
  'user/initializeAuth',
  async (_, { dispatch }) => {
    // 先从 localStorage 恢复用户状态
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser) {
          const userInfo = JSON.parse(savedUser);
          return { userInfo, fromStorage: true };
        }
      } catch (error) {
        console.error("Failed to restore user from localStorage:", error);
        throw new Error("恢复用户状态失败");
      }
    }
    return { userInfo: null, fromStorage: false };
  }
);

export const performLogin = createAsyncThunk(
  'user/performLogin',
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const { userInfo, isAuthenticated } = state.user;

    // 如果已经有用户信息且已认证，直接返回
    if (isAuthenticated && userInfo) {
      return { userInfo, isNewAuth: false };
    }

    // 执行鉴权流程
    return new Promise((resolve, reject) => {
      console.log("用户未登录，开始鉴权流程");
      
      handleJSAPIAccess((isSuccess) => {
        console.log("JSAPI鉴权结果:", isSuccess);
        
        if (isSuccess) {
          // 免登处理
          handleUserAuth((authUserInfo) => {
            console.log("用户认证信息:", authUserInfo);
            
            if (authUserInfo) {
              resolve({ userInfo: authUserInfo, isNewAuth: true });
            } else {
              // 如果没有用户信息，创建默认用户（开发环境）
              const defaultUserInfo = {
                name: "开发用户",
                open_id: "dev-user",
              };
              resolve({ userInfo: defaultUserInfo, isNewAuth: true });
            }
          });
        } else {
          // 鉴权失败，使用默认用户（开发环境）
          console.log("鉴权失败，使用默认用户");
          const defaultUserInfo = {
            name: "开发用户",
            open_id: "dev-user",
          };
          resolve({ userInfo: defaultUserInfo, isNewAuth: true });
        }
      });
    });
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      // 同步到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      // 清除 localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // initializeAuth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        const { userInfo, fromStorage } = action.payload;
        if (userInfo) {
          state.userInfo = userInfo;
          state.isAuthenticated = true;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "初始化认证失败";
      })
      // performLogin
      .addCase(performLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performLogin.fulfilled, (state, action) => {
        const { userInfo, isNewAuth } = action.payload;
        state.userInfo = userInfo;
        state.isAuthenticated = true;
        state.isLoading = false;
        state.error = null;
        
        // 如果是新的认证，同步到 localStorage
        if (isNewAuth && typeof window !== 'undefined') {
          localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userInfo));
        }
      })
      .addCase(performLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "登录失败";
      });
  },
});

export const { 
  setUser, 
  clearUser, 
  setUserLoading, 
  setUserError 
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user.userInfo;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;