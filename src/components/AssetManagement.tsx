"use client";

import { useState } from "react";
import AssetList from "./AssetList";
import AssetDetail from "./AssetDetail";
import AssetForm from "./AssetForm";
import QRScanner from "./QRScanner";
import { Asset, User, AssetFormData } from "@/types/asset";
import { useAssets, useAssetByCode, useCreateAsset, useUpdateAsset } from "@/hooks/useAssets";
import { toast } from "sonner";

interface AssetManagementProps {
  user: User;
}

type ViewMode = "list" | "detail" | "edit" | "add" | "scan";

export default function AssetManagement({ user }: AssetManagementProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    status?: string;
    category?: string;
  }>({});

  // API hooks
  const { data: assetsResponse, isLoading: isLoadingAssets, error } = useAssets(searchParams);
  const { mutateAsync: getAssetByCode, isPending: isScanning } = useAssetByCode();
  const { mutateAsync: createAsset, isPending: isCreating } = useCreateAsset();
  const { mutateAsync: updateAsset, isPending: isUpdating } = useUpdateAsset();

  const assets = assetsResponse?.data || [];
  const isLoading = isLoadingAssets || isScanning || isCreating || isUpdating;

  const handleAssetClick = (asset: Asset) => {
    setCurrentAsset(asset);
    setViewMode("detail");
  };

  const handleScanSuccess = async (assetCode: string) => {
    try {
      const response = await getAssetByCode(assetCode);
      if (response.success && response.data) {
        setCurrentAsset(response.data);
        setViewMode("detail");
        toast.success(response.message || `找到资产: ${response.data.assetName}`);
      } else {
        toast.error(response.error || "未找到该资产，请联系管理员");
        // 如果是空白码且用户是管理员，可以创建新资产
        if (user.role === "admin" && assetCode.startsWith("BLANK_")) {
          setViewMode("add");
          toast.info("检测到空白二维码，可以绑定新资产");
        }
      }
    } catch (error: any) {
      console.error("查询资产失败:", error);
      toast.error(error.message || "查询资产失败，请重试");
    }
  };

  const handleSaveAsset = async (formData: AssetFormData): Promise<void> => {
    try {
      let response;

      if (currentAsset) {
        // 更新现有资产
        response = await updateAsset({
          id: currentAsset.id,
          data: formData,
        });
        if (response.data) {
          setCurrentAsset(response.data);
          setViewMode("detail");
        }
      } else {
        // 创建新资产
        response = await createAsset(formData);
        if (response.data) {
          setCurrentAsset(response.data);
          setViewMode("detail");
        }
      }
    } catch (error) {
      console.error("保存资产失败:", error);
      throw error;
    }
  };

  const handleBackToList = () => {
    setCurrentAsset(null);
    setViewMode("list");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  switch (viewMode) {
    case "scan":
      return (
        <div className="min-h-screen bg-gray-50 p-4">
          <div className="max-w-md mx-auto">
            <div className="flex items-center mb-6">
              <button
                onClick={handleBackToList}
                className="mr-4 p-2 text-gray-600 hover:text-gray-800"
              >
                ← 返回
              </button>
              <h1 className="text-xl font-bold text-gray-900">扫描资产</h1>
            </div>
            <QRScanner
              onScanSuccess={handleScanSuccess}
              onScanError={(error) => console.error("扫码错误:", error)}
            />
          </div>
        </div>
      );

    case "detail":
      return currentAsset ? (
        <AssetDetail
          asset={currentAsset}
          user={user}
          onEdit={() => setViewMode("edit")}
          onBack={handleBackToList}
        />
      ) : (
        <div>资产不存在</div>
      );

    case "edit":
      return currentAsset ? (
        <AssetForm
          asset={currentAsset}
          onSave={handleSaveAsset}
          onCancel={() => setViewMode("detail")}
          isSubmitting={isLoading}
        />
      ) : (
        <div>资产不存在</div>
      );

    case "add":
      return (
        <AssetForm onSave={handleSaveAsset} onCancel={handleBackToList} isSubmitting={isLoading} />
      );

    case "list":
    default:
      return (
        <AssetList
          assets={assets}
          user={user}
          onAssetClick={handleAssetClick}
          onAddAsset={user.role === "admin" ? () => setViewMode("add") : undefined}
          onScanQR={() => setViewMode("scan")}
          onSearch={setSearchParams}
        />
      );
  }
}
