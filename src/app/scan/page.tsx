"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import QRScanner from "@/components/QRScanner";
import { handleJSAPIAccess, handleUserAuth } from "@/lib/feishu-auth";
import { User } from "@/types/asset";
import { useAssetByCode } from "@/hooks/useAssets";
import { toast } from "sonner";

export default function ScanPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>({});
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 根据资产编码获取资产
  const { mutateAsync: getAssetByCode, isPending: isScanning } = useAssetByCode();

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

  const handleScanSuccess = async (assetCode: string) => {
    try {
      const response = await getAssetByCode(assetCode);
      if (response.success && response.data) {
        // 跳转到资产详情页
        router.push(`/assets/${response.data.id}`);
        toast.success(response.message || `找到资产: ${response.data.assetName}`);
      } else {
        // 跳转到扫码结果页，显示未找到的信息
        router.push(`/scan/result/${encodeURIComponent(assetCode)}`);
        toast.error(response.error || "未找到该资产，请联系管理员");
      }
    } catch (error: any) {
      console.error("查询资产失败:", error);
      // 跳转到扫码结果页，显示错误信息
      router.push(
        `/scan/result/${encodeURIComponent(assetCode)}?error=${encodeURIComponent(
          error.message || "查询失败"
        )}`
      );
      toast.error(error.message || "查询资产失败，请重试");
    }
  };

  const handleScanError = (error: string) => {
    console.error("扫码错误:", error);
    toast.error("扫码失败，请重试");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 用户信息头部 */}
      {userInfo && Object.keys(userInfo).length > 0 && (
        <div className="bg-white border-b">
          <UserInfo userInfo={userInfo} />
        </div>
      )}

      {/* 扫码页面 */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/" className="mr-4 p-2 text-gray-600 hover:text-gray-800">
              ← 返回
            </Link>
            <h1 className="text-xl font-bold text-gray-900">扫描资产</h1>
          </div>

          {/* QR Scanner Component */}
          <QRScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />

          {/* 额外提示信息 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">扫码说明</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 扫码后将自动跳转到资产详情页</li>
              <li>• 如果资产不存在，将显示相关提示</li>
              <li>• 管理员可以为空白二维码绑定新资产</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
