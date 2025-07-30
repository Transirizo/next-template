"use client";

import { useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import UserInfo from "@/components/UserInfo";
import { useAssetByCode } from "@/hooks/useAssets";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

export default function ScanResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const assetCode = decodeURIComponent(params.code as string);
  const error = searchParams.get("error");
  const { userInfo, isAuthenticated, isLoading } = useUser();
  const [retryCount, setRetryCount] = useState(0);

  // 重试查询资产
  const { mutateAsync: getAssetByCode, isPending: isSearching } = useAssetByCode();

  const handleRetry = async () => {
    try {
      setRetryCount((prev) => prev + 1);
      const response = await getAssetByCode(assetCode);
      if (response.success && response.data) {
        // 找到资产，跳转到详情页
        router.push(`/assets/${response.data.id}`);
        toast.success(response.message || `找到资产: ${response.data.assetName}`);
      } else {
        toast.error(response.error || "仍未找到该资产");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '查询失败';
      console.error("重试查询失败:", error);
      toast.error(errorMessage || "查询失败，请重试");
    }
  };

  const handleCreateAsset = () => {
    // 如果用户已登录且是空白码，可以创建新资产
    if (isAuthenticated) {
      router.push("/addAsset");
    }
  };

  const isBlankCode = assetCode.startsWith("BLANK_") || assetCode.includes("blank");
  const canCreateAsset = isAuthenticated && isBlankCode;

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
          <p className="text-gray-600 mb-4">请先登录后再查看扫码结果</p>
          <Link href="/" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
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

      {/* 扫码结果页面 */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link href="/scan" className="mr-4 p-2 text-gray-600 hover:text-gray-800">
              ← 返回扫码
            </Link>
            <h1 className="text-xl font-bold text-gray-900">扫码结果</h1>
          </div>

          {/* 结果内容 */}
          <div className="bg-white rounded-lg shadow-sm border p-6 text-center space-y-6">
            {/* 状态图标 */}
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* 结果信息 */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {error ? "扫码出错" : "未找到资产"}
              </h2>

              <div className="space-y-2 text-gray-600">
                <p>扫码内容：</p>
                <div className="bg-gray-50 p-2 rounded font-mono text-sm break-all">
                  {assetCode}
                </div>

                {error && (
                  <>
                    <p className="mt-4">错误信息：</p>
                    <div className="bg-red-50 p-2 rounded text-sm text-red-800">
                      {decodeURIComponent(error)}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="space-y-3">
              {!error && (
                <Button
                  onClick={handleRetry}
                  disabled={isSearching}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isSearching ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>重新查询中...</span>
                    </div>
                  ) : (
                    `重新查询 ${retryCount > 0 ? `(第${retryCount + 1}次)` : ""}`
                  )}
                </Button>
              )}

              {canCreateAsset && (
                <Button
                  onClick={handleCreateAsset}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  绑定新资产
                </Button>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => router.push("/scan")} className="flex-1">
                  重新扫码
                </Button>
                <Button variant="outline" onClick={() => router.push("/")} className="flex-1">
                  返回首页
                </Button>
              </div>
            </div>

            {/* 提示信息 */}
            <div className="border-t pt-4">
              <div className="text-sm text-gray-500 space-y-1">
                {isBlankCode ? (
                  <>
                    <p>• 检测到空白二维码</p>
                    {canCreateAsset && <p>• 您可以为此二维码绑定新资产</p>}
                  </>
                ) : (
                  <>
                    <p>• 请确认二维码是否为本系统生成</p>
                    <p>• 如有疑问，请联系管理员</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
