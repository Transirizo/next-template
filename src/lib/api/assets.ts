import { Asset, AssetFormData } from "@/types/asset";
import { ApiResponse, AssetsResponse, ScanAssetResponse } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// HTTP客户端封装
class AssetsAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/api${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP错误: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API请求失败 [${endpoint}]:`, error);
      throw error instanceof Error ? error : new Error("未知错误");
    }
  }

  // 获取资产列表
  async getAssets(params?: {
    search?: string;
    status?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<AssetsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/assets${queryString ? `?${queryString}` : ""}`;

    return this.request<AssetsResponse>(endpoint);
  }

  // 按ID获取资产
  async getAssetById(id: string): Promise<ApiResponse<Asset>> {
    return this.request<ApiResponse<Asset>>(`/assets/${id}`);
  }

  // 按编码获取资产（扫码功能）
  async getAssetByCode(code: string): Promise<ScanAssetResponse> {
    const encodedCode = encodeURIComponent(code);
    return this.request<ScanAssetResponse>(`/assets/code/${encodedCode}`);
  }

  // 创建新资产
  async createAsset(data: AssetFormData): Promise<ApiResponse<Asset>> {
    return this.request<ApiResponse<Asset>>("/assets", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // 更新资产
  async updateAsset(id: string, data: Partial<AssetFormData>): Promise<ApiResponse<Asset>> {
    return this.request<ApiResponse<Asset>>(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // 删除资产
  async deleteAsset(id: string): Promise<ApiResponse<Asset>> {
    return this.request<ApiResponse<Asset>>(`/assets/${id}`, {
      method: "DELETE",
    });
  }

  // 上传资产照片
  async uploadAssetPhoto(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append("photo", file);

    // 注意：这个请求不设置Content-Type，让浏览器自动设置边界
    return this.request<ApiResponse<{ url: string }>>("/assets/upload", {
      method: "POST",
      body: formData,
      headers: {}, // 不设置Content-Type，让FormData自动设置
    });
  }
}

// 导出单例实例
export const assetsAPI = new AssetsAPI();

// 默认导出，便于其他导入方式
export default assetsAPI;
