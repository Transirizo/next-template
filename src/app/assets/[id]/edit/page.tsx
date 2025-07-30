"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import AssetForm from "@/components/AssetForm";
import { User, AssetFormData } from "@/types/asset";
import { useAsset, useUpdateAsset } from "@/hooks/useAssets";
import { useUser } from "@/hooks/useUser";

export default function AssetEditPage() {
  const params = useParams();
  const router = useRouter();
  const assetId = params.id as string;
  const { userInfo, isAuthenticated, isLoading } = useUser();

  // 获取资产详情
  const { data: assetResponse, isLoading: isLoadingAsset, error } = useAsset(assetId);
  const asset = assetResponse?.data;

  // 更新资产
  const { mutateAsync: updateAsset, isPending: isUpdating } = useUpdateAsset();

  // 创建用户对象用于传递给组件
  const user: User = {
    id: userInfo?.open_id || "unknown",
    name: userInfo?.name || "未知用户",
    avatar_url: userInfo?.avatar_url,
    role: "editor", // 默认为编辑权限
  };

  const handleSave = async (formData: AssetFormData): Promise<void> => {
    try {
      await updateAsset({
        id: assetId,
        data: formData,
      });

      // 成功后跳转到详情页
      router.push(`/assets/${assetId}`);
    } catch (error) {
      console.error("更新资产失败:", error);
      throw error;
    }
  };

  const handleCancel = () => {
    router.push(`/assets/${assetId}`);
  };

  if (isLoading || isLoadingAsset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">资产不存在</h2>
          <p className="text-gray-600 mb-4">找不到该资产信息</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未登录</h2>
          <p className="text-gray-600 mb-4">请先登录后再编辑资产</p>
          <Link
            href={`/assets/${assetId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回详情页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 用户信息头部 */}
      <div className="bg-white border-b">
        <UserInfo />
      </div>

      {/* 资产编辑表单 */}
      <AssetForm
        asset={asset}
        onSave={handleSave}
        onCancel={handleCancel}
        isSubmitting={isUpdating}
      />
    </div>
  );
}
