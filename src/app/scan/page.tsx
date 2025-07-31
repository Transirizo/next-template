"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import QRScanner from "@/components/QRScanner";
import { toast } from "sonner";
import { useAppSelector } from "@/hooks/reduxHooks";
import { selectIsAuthenticated, selectUserLoading } from "@/store/user";

export default function ScanPage() {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectUserLoading);

  const handleScanSuccess = async (assetCode: string) => {
    toast.error("扫码查询功能暂不可用");
    // 跳转到扫码结果页，显示未找到的信息
    router.push(`/scan/result/${encodeURIComponent(assetCode)}`);
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">未登录</h2>
          <p className="text-gray-600">请先登录后再扫码</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4">
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
