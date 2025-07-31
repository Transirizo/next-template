import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Asset } from "@/types/asset";

interface AssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
}

// 使用该类型定义初始 state
const initialState: AssetsState = {
  assets: [],
  loading: false,
  error: null,
};

export const assetsSlice = createSlice({
  name: "assets",
  // `createSlice` 将从 `initialState` 参数推断 state 类型
  initialState,
  reducers: {
    setAssets: (state, action: PayloadAction<Asset[]>) => {
      state.assets = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAssets, setLoading, setError } = assetsSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectAssets = (state: RootState) => state.assets.assets;
export const selectAssetsLoading = (state: RootState) => state.assets.loading;
export const selectAssetsError = (state: RootState) => state.assets.error;

export default assetsSlice.reducer;
