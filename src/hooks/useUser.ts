"use client";

import { useCallback } from 'react';
import { useUserContext, UserInfo } from '@/lib/user-context/user-context';

export function useUser() {
  const { state, dispatch } = useUserContext();

  const setUser = useCallback((userInfo: UserInfo) => {
    dispatch({ type: 'SET_USER', payload: userInfo });
  }, [dispatch]);

  const clearUser = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' });
  }, [dispatch]);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [dispatch]);

  return {
    userInfo: state.userInfo,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    setUser,
    clearUser,
    setLoading,
  };
}