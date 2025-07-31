"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import AssetList from "@/components/AssetList";
import { handleJSAPIAccess, handleUserAuth } from "@/lib/feishu-auth";
import { User } from "@/types/asset";
import { useUser } from "@/hooks/useUser";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { setAssets, setLoading, setError, selectAssets, selectAssetsLoading } from "@/store/assets";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const assets = useAppSelector(selectAssets);
  const assetsLoading = useAppSelector(selectAssetsLoading);
  const {
    userInfo: globalUserInfo,
    isAuthenticated,
    isLoading: globalIsLoading,
    setUser: setGlobalUser,
    setLoading: setGlobalLoading,
  } = useUser();
  const [searchParams, setSearchParams] = useState<{
    search?: string;
    status?: string;
    category?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    init();
  }, [isAuthenticated, globalUserInfo, setGlobalUser, setGlobalLoading]);

  const init = async () => {
    await login();
    await getData();
  };

  const login = async () => {
    // 如果全局状态中已有用户信息，直接使用，无需重新鉴权
    if (isAuthenticated && globalUserInfo) {
      console.log("用户已登录，使用全局状态:", globalUserInfo);
      const systemUser: User = {
        id: globalUserInfo.open_id || "unknown",
        name: globalUserInfo.name || "未知用户",
        avatar_url: globalUserInfo.avatar_url,
        role: "editor", // 默认为编辑权限
      };
      setUser(systemUser);
      setIsLoading(false);
      return;
    }

    // 如果没有用户信息，进行鉴权处理
    setGlobalLoading(true);
    console.log("用户未登录，开始鉴权流程");
    handleJSAPIAccess((isSuccess) => {
      console.log("JSAPI鉴权结果:", isSuccess);
      if (isSuccess) {
        // 免登处理
        handleUserAuth((authUserInfo) => {
          console.log("用户认证信息:", authUserInfo);
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
            console.log(authUserInfo, "authUserInfo");
            // 🎯 关键：设置全局用户状态
            setGlobalUser({
              ...authUserInfo,
            });
          } else {
            // 如果没有用户信息，创建默认用户（开发环境）
            const defaultUser: User = {
              id: "dev-user",
              name: "开发用户",
              role: "admin",
            };
            setUser(defaultUser);

            // 设置默认用户到全局状态
            setGlobalUser({
              name: "开发用户",
              open_id: "dev-user",
            });
          }
          setIsLoading(false);
          setGlobalLoading(false);
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

        // 设置默认用户到全局状态
        setGlobalUser({
          name: "开发用户",
          open_id: "dev-user",
        });

        setIsLoading(false);
        setGlobalLoading(false);
      }
    });
  };

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const accessToken = globalUserInfo?.access_token;
      const response = await axios.post(
        "/api/getAssets",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response.data);
      const assetsData = response.data.data || [];
      dispatch(setAssets(assetsData));
      return assetsData;
    } catch (error) {
      console.error("Failed to get data:", error);
      dispatch(setError("获取资产数据失败"));
    }
  };

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

  if (isLoading || globalIsLoading) {
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
