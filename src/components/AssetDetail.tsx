"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Asset, User } from "@/types/asset";

interface AssetDetailProps {
  asset: Asset;
  user: User;
  onEdit?: () => void;
  onBack?: () => void;
}

export default function AssetDetail({ asset, user, onEdit, onBack }: AssetDetailProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const canEdit = user.role === "admin" || user.role === "editor";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-CN", {
      style: "currency",
      currency: "CNY",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  const getStatusColor = (status: string) => {
    const colors = {
      在用: "bg-green-100 text-green-800",
      闲置: "bg-yellow-100 text-yellow-800",
      维修中: "bg-orange-100 text-orange-800",
      报废: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {onBack ? (
            <Button variant="outline" size="sm" onClick={onBack}>
              ← 返回
            </Button>
          ) : (
            <Link href="/">
              <Button variant="outline" size="sm">
                ← 返回
              </Button>
            </Link>
          )}
          <h1 className="text-xl font-bold text-gray-900">资产详情</h1>
        </div>
        {canEdit && (
          <>
            {onEdit ? (
              <Button onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
                修改
              </Button>
            ) : (
              <Link href={`/assets/${asset.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">修改</Button>
              </Link>
            )}
          </>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        {/* Asset Photo */}
        {asset.assetPhoto && !imageError && (
          <div className="p-6 border-b">
            <div className="flex justify-center">
              <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={asset.assetPhoto}
                  alt={asset.assetName}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Asset Information */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">资产编码</label>
                <p className="mt-1 text-lg font-mono text-gray-900">{asset.assetCode}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">资产名称</label>
                <p className="mt-1 text-lg text-gray-900">{asset.assetName}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">使用状态</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(asset.usageStatus)}>{asset.usageStatus}</Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">类别</label>
                <p className="mt-1 text-base text-gray-900">{asset.category}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">责任人</label>
                <p className="mt-1 text-base text-gray-900">{asset.responsiblePerson}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">购置价格</label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  {formatPrice(asset.purchasePrice)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">购置时间</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(asset.purchaseDate)}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">所属地点</label>
                <p className="mt-1 text-base text-gray-900">{asset.location}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">存放地点</label>
                <p className="mt-1 text-base text-gray-900">{asset.storageLocation}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">盘点日期</label>
                <p className="mt-1 text-base text-gray-900">{formatDate(asset.inventoryDate)}</p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">财务信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">发票类型</label>
                <p className="mt-1 text-base text-gray-900">{asset.invoiceType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">税点</label>
                <p className="mt-1 text-base text-gray-900">{asset.taxRate}</p>
              </div>
            </div>
          </div>

          {/* Technical Info */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">技术规格</h3>
            <div>
              <label className="text-sm font-medium text-gray-500">规格型号</label>
              <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                {asset.specifications}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
