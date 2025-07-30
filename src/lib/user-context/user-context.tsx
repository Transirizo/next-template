"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

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
}

type UserAction =
  | { type: "SET_USER"; payload: UserInfo }
  | { type: "CLEAR_USER" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
  isLoading: true,
};

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
} | null>(null);

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        userInfo: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "CLEAR_USER":
      return {
        ...state,
        userInfo: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

const USER_STORAGE_KEY = "user_info";

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // 从 localStorage 恢复用户状态
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (savedUser) {
        const userInfo = JSON.parse(savedUser);
        dispatch({ type: "SET_USER", payload: userInfo });
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Failed to restore user from localStorage:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // 当用户状态改变时，同步到 localStorage
  useEffect(() => {
    if (state.userInfo) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(state.userInfo));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [state.userInfo]);

  return <UserContext.Provider value={{ state, dispatch }}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}
