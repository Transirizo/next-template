"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import AssetForm from "@/components/AssetForm";
import { handleJSAPIAccess, handleUserAuth } from "@/lib/feishu-auth";
import { User, AssetFormData } from "@/types/asset";
import { useCreateAsset } from "@/hooks/useAssets";

export default function AddAsset() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 创建资产
  const { mutateAsync: createAsset, isPending: isCreating } = useCreateAsset();

  useEffect(() => {
    // 鉴权处理
    handleJSAPIAccess((isSuccess) => {
      console.log("JSAPI鉴权结果:", isSuccess);
      if (isSuccess) {
        // 免登处理
        handleUserAuth((authUserInfo) => {
          console.log("用户认证信息:", authUserInfo);
          setUserInfo(authUserInfo || {});

          // 转换为系统用户格式
          if (authUserInfo) {
            const systemUser: User = {
              id: authUserInfo.open_id || "unknown",
              name: authUserInfo.name || "未知用户",
              avatar_url: authUserInfo.avatar_url,
              role: "editor", // 默认为编辑权限，实际应该从后端获取
              access_token: authUserInfo.access_token,
            };
            setUser(systemUser);
          } else {
            // 如果没有用户信息，创建默认用户（开发环境）
            const defaultUser: User = {
              id: "dev-user",
              name: "开发用户",
              role: "admin",
            };
            setUser(defaultUser);
          }
          setIsLoading(false);
        });
      } else {
        // 鉴权失败，使用默认用户（开发环境）
        console.log("鉴权失败，使用默认用户");
        const defaultUser: User = {
          id: "dev-user",
          name: "开发用户",
          role: "admin",
        };
        setUser(defaultUser);
        setIsLoading(false);
      }
    });
  }, []);

  const handleSave = async (formData: AssetFormData): Promise<void> => {
    try {
      const response = await createAsset(formData);

      // 成功后跳转到新创建的资产详情页
      if (response.data) {
        router.push(`/assets/${response.data.id}`);
      } else {
        // 如果没有返回ID，跳转到首页
        router.push("/");
      }
    } catch (error) {
      console.error("创建资产失败:", error);
      throw error;
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">登录失败</h2>
          <p className="text-gray-600">请在飞书环境中访问此应用</p>
        </div>
      </div>
    );
  }

  // 权限检查
  const canAdd = user.role === "admin";
  if (!canAdd) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">权限不足</h2>
          <p className="text-gray-600 mb-4">您没有创建资产的权限</p>
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
      {userInfo && Object.keys(userInfo).length > 0 && (
        <div className="bg-white border-b">
          <UserInfo userInfo={userInfo} />
        </div>
      )}

      {/* 新增资产表单 */}
      <AssetForm onSave={handleSave} onCancel={handleCancel} isSubmitting={isCreating} />
    </div>
  );
}
