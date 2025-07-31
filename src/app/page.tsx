"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import AssetList from "@/components/AssetList";
import { User } from "@/types/asset";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { fetchAssets, selectAssets, selectAssetsLoading } from "@/store/assets";
import {
  initializeAuth,
  performLogin,
  selectUser,
  selectIsAuthenticated,
  selectUserLoading,
} from "@/store/user";

export default function Home() {
  const [user, setLocalUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets);
  const assetsLoading = useAppSelector(selectAssetsLoading);
  const globalUserInfo = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const globalIsLoading = useAppSelector(selectUserLoading);
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    status?: string;
    category?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    initializeApp();
  }, [dispatch]);

  const initializeApp = async () => {
    try {
      // 初始化认证状态
      await dispatch(initializeAuth());
      // 执行登录
      await dispatch(performLogin());
      // 获取资产数据
      await dispatch(fetchAssets());
    } catch (error) {
      console.error("初始化应用失败:", error);
    }
  };

  // 监听 globalUserInfo 变化，更新本地 User 对象
  useEffect(() => {
    if (isAuthenticated && globalUserInfo) {
      const systemUser: User = {
        id: globalUserInfo.open_id || "unknown",
        name: globalUserInfo.name || "未知用户",
        avatar_url: globalUserInfo.avatar_url,
        role: "editor", // 默认为编辑权限
        access_token: globalUserInfo.access_token,
      };
      setLocalUser(systemUser);
    } else if (!globalIsLoading && !isAuthenticated) {
      // 如果认证失败且不在加载中，创建默认用户
      const defaultUser: User = {
        id: "dev-user",
        name: "开发用户",
        role: "admin",
      };
      setLocalUser(defaultUser);
    }
  }, [isAuthenticated, globalUserInfo, globalIsLoading]);

  const handleAssetClick = (asset: unknown) => {
    const assetWithId = asset as { id: string };
    router.push(`/assets/${assetWithId.id}`);
  };

  const handleAddAsset = () => {
    router.push("/addAsset");
  };

  const handleScanQR = () => {
    router.push("/scan");
  };

  if (globalIsLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
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

      {/* 资产列表页面 */}
      <AssetList
        assets={assets}
        user={user}
        onAssetClick={handleAssetClick}
        onAddAsset={user.role === "admin" ? handleAddAsset : undefined}
        onScanQR={handleScanQR}
        onSearch={setSearchParams}
      />
    </div>
  );
}
