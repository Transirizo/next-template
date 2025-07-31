import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Asset } from "@/types/asset";
import axios from "axios";

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

// 异步 thunk 获取资产数据
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const accessToken = state.user.userInfo?.access_token;
      
      const response = await axios.post(
        "/api/getAssets",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      console.log("Assets response:", response.data);
      const assetsData = response.data.data || [];
      return assetsData;
    } catch (error: any) {
      console.error("Failed to get assets:", error);
      return rejectWithValue("获取资产数据失败");
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssets.fulfilled, (state, action) => {
        state.assets = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAssets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "获取资产数据失败";
      });
  },
});

export const { setAssets, setLoading, setError } = assetsSlice.actions;
// 选择器等其他代码可以使用导入的 `RootState` 类型
export const selectAssets = (state: RootState) => state.assets.assets;
export const selectAssetsLoading = (state: RootState) => state.assets.loading;
export const selectAssetsError = (state: RootState) => state.assets.error;

export default assetsSlice.reducer;
