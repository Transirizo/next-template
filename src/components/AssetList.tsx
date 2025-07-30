"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Asset, User } from '@/types/asset';

interface AssetListProps {
  assets: Asset[];
  user: User;
  onAssetClick: (asset: Asset) => void;
  onAddAsset?: () => void;
  onScanQR?: () => void;
  onSearch?: (params: { search?: string; status?: string; category?: string }) => void;
}

export default function AssetList({ assets, user, onAssetClick, onAddAsset, onScanQR, onSearch }: AssetListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const canAddAsset = user.role === 'admin';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      '在用': 'bg-green-100 text-green-800',
      '闲置': 'bg-yellow-100 text-yellow-800', 
      '维修中': 'bg-orange-100 text-orange-800',
      '报废': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  // 处理搜索和筛选
  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        search: searchTerm || undefined,
        status: filterStatus || undefined,
        category: filterCategory || undefined,
      });
    }
  };

  // 实时搜索（可选，也可以改为点击搜索按钮）
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onSearch) {
      onSearch({
        search: value || undefined,
        status: filterStatus || undefined,
        category: filterCategory || undefined,
      });
    }
  };

  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    if (onSearch) {
      onSearch({
        search: searchTerm || undefined,
        status: value || undefined,
        category: filterCategory || undefined,
      });
    }
  };

  const handleCategoryFilter = (value: string) => {
    setFilterCategory(value);
    if (onSearch) {
      onSearch({
        search: searchTerm || undefined,
        status: filterStatus || undefined,
        category: value || undefined,
      });
    }
  };

  // 如果没有onSearch回调，则使用本地过滤（兼容模式）
  const filteredAssets = onSearch ? assets : assets.filter(asset => {
    const matchesSearch = searchTerm === '' || 
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || asset.usageStatus === filterStatus;
    const matchesCategory = filterCategory === '' || asset.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // 获取唯一的状态和类别用于过滤
  const uniqueStatuses = [...new Set(assets.map(asset => asset.usageStatus))].filter(Boolean);
  const uniqueCategories = [...new Set(assets.map(asset => asset.category))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">资产管理</h1>
        <div className="flex space-x-2">
          {onScanQR && (
            <Button onClick={onScanQR} className="bg-blue-600 hover:bg-blue-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 4h4m12 0h2M4 20h4m12 0h2" />
              </svg>
              扫码查看
            </Button>
          )}
          {canAddAsset && onAddAsset && (
            <Button onClick={onAddAsset} className="bg-green-600 hover:bg-green-700">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增资产
            </Button>
          )}
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="搜索资产名称、编码或责任人..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部状态</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterCategory}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部类别</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-blue-600">{assets.length}</div>
          <div className="text-sm text-gray-600">总资产数</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-green-600">
            {assets.filter(a => a.usageStatus === '在用').length}
          </div>
          <div className="text-sm text-gray-600">在用</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {assets.filter(a => a.usageStatus === '闲置').length}
          </div>
          <div className="text-sm text-gray-600">闲置</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-600">
            {filteredAssets.length}
          </div>
          <div className="text-sm text-gray-600">筛选结果</div>
        </div>
      </div>

      {/* 资产列表 */}
      <div className="space-y-4">
        {filteredAssets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无资产</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus || filterCategory ? '未找到符合条件的资产' : '还没有添加任何资产'}
            </p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onAssetClick(asset)}
              className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {asset.assetName}
                    </h3>
                    <Badge className={getStatusColor(asset.usageStatus)}>
                      {asset.usageStatus}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">编码：</span>
                      <span className="font-mono">{asset.assetCode}</span>
                    </div>
                    <div>
                      <span className="font-medium">类别：</span>
                      {asset.category}
                    </div>
                    <div>
                      <span className="font-medium">责任人：</span>
                      {asset.responsiblePerson}
                    </div>
                    <div>
                      <span className="font-medium">存放：</span>
                      {asset.storageLocation}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-lg font-semibold text-green-600">
                      {formatPrice(asset.purchasePrice)}
                    </div>
                    <div className="text-sm text-gray-500">
                      购置于 {new Date(asset.purchaseDate).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                
                {asset.assetPhoto && (
                  <div className="ml-4 flex-shrink-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={asset.assetPhoto} 
                        alt={asset.assetName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 加载更多或分页 */}
      {filteredAssets.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          显示 {filteredAssets.length} 项资产
        </div>
      )}
    </div>
  );
}