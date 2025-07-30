import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assetsAPI } from "@/lib/api/assets";
import { Asset, AssetFormData } from "@/types/asset";
import { ApiResponse, AssetsResponse, ScanAssetResponse } from "@/types/api";
import { toast } from "sonner";

// 查询键
export const assetKeys = {
  all: ["assets"] as const,
  lists: () => [...assetKeys.all, "list"] as const,
  list: (filters: any) => [...assetKeys.lists(), filters] as const,
  details: () => [...assetKeys.all, "detail"] as const,
  detail: (id: string) => [...assetKeys.details(), id] as const,
};

// 获取资产列表
export const useAssets = (params?: {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: assetKeys.list(params),
    queryFn: () => assetsAPI.getAssets(params),
    staleTime: 5 * 60 * 1000, // 5分钟内不重新请求
  });
};

// 获取单个资产详情
export const useAsset = (id: string) => {
  return useQuery({
    queryKey: assetKeys.detail(id),
    queryFn: () => assetsAPI.getAssetById(id),
    enabled: !!id,
  });
};

// 根据资产编码获取资产（扫码用）
export const useAssetByCode = () => {
  return useMutation<ScanAssetResponse, Error, string>({
    mutationFn: (code: string) => assetsAPI.getAssetByCode(code),
  });
};

// 创建资产
export const useCreateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Asset>, Error, AssetFormData>({
    mutationFn: (data: AssetFormData) => assetsAPI.createAsset(data),
    onSuccess: (response) => {
      // 使缓存失效，重新获取列表
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
      toast.success("资产创建成功");
    },
    onError: (error: any) => {
      console.error("创建资产失败:", error);
      toast.error(error.message || "创建资产失败");
    },
  });
};

// 更新资产
export const useUpdateAsset = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Asset>, Error, { id: string; data: Partial<AssetFormData> }>({
    mutationFn: ({ id, data }: { id: string; data: Partial<AssetFormData> }) =>
      assetsAPI.updateAsset(id, data),
    onSuccess: (response, variables) => {
      // 更新缓存中的具体资产
      queryClient.setQueryData(assetKeys.detail(variables.id), response);
      // 使列表缓存失效
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
      toast.success("资产更新成功");
    },
    onError: (error: any) => {
      console.error("更新资产失败:", error);
      toast.error(error.message || "更新资产失败");
    },
  });
};

// 删除资产
export const useDeleteAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assetsAPI.deleteAsset(id),
    onSuccess: (response, id) => {
      // 从缓存中移除该资产
      queryClient.removeQueries({ queryKey: assetKeys.detail(id) });
      // 使列表缓存失效
      queryClient.invalidateQueries({ queryKey: assetKeys.lists() });
      toast.success("资产删除成功");
    },
    onError: (error: any) => {
      console.error("删除资产失败:", error);
      toast.error(error.message || "删除资产失败");
    },
  });
};

// 上传资产照片
export const useUploadAssetPhoto = () => {
  return useMutation({
    mutationFn: (file: File) => assetsAPI.uploadAssetPhoto(file),
    onSuccess: (response) => {
      toast.success("照片上传成功");
    },
    onError: (error: any) => {
      console.error("上传照片失败:", error);
      toast.error(error.message || "上传照片失败");
    },
  });
};
