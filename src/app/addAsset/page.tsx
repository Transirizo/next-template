"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import AssetForm from "@/components/AssetForm";
import { AssetFormData } from "@/types/asset";
import { useUser } from "@/hooks/useUser";

export default function AddAsset() {
  const router = useRouter();
  const { userInfo, isAuthenticated, isLoading } = useUser();

  const isCreating = false;

  const handleSave = async (formData: AssetFormData): Promise<void> => {
    throw new Error("创建资产功能暂不可用");
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未登录</h2>
          <p className="text-gray-600 mb-4">请先登录后再创建资产</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 用户信息头部 */}
      <div className="bg-white border-b">
        <UserInfo />
      </div>

      {/* 新增资产表单 */}
      <AssetForm onSave={handleSave} onCancel={handleCancel} isSubmitting={isCreating} />
    </div>
  );
}
