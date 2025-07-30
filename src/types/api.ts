import { Asset } from './asset';

// API 响应的基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page?: number;
  limit?: number;
}

// 资产相关的 API 响应类型
export interface AssetResponse extends ApiResponse<Asset> {}
export interface AssetsResponse extends PaginatedResponse<Asset> {}

// 扫码查询响应
export interface ScanAssetResponse extends ApiResponse<Asset> {
  code?: string;
}