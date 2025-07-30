"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Asset, AssetFormData, INVOICE_TYPES, TAX_RATES, USAGE_STATUS, CATEGORIES, LOCATIONS } from '@/types/asset';
import { toast } from 'sonner';

interface AssetFormProps {
  asset?: Asset;
  onSave: (data: AssetFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function AssetForm({ asset, onSave, onCancel, isSubmitting = false }: AssetFormProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    assetName: asset?.assetName || '',
    purchaseDate: asset?.purchaseDate || '',
    location: asset?.location || '',
    purchasePrice: asset?.purchasePrice || 0,
    invoiceType: asset?.invoiceType || '',
    taxRate: asset?.taxRate || '',
    specifications: asset?.specifications || '',
    category: asset?.category || '',
    inventoryDate: asset?.inventoryDate || '',
    assetPhoto: asset?.assetPhoto || '',
    usageStatus: asset?.usageStatus || '',
    storageLocation: asset?.storageLocation || '',
    responsiblePerson: asset?.responsiblePerson || '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>(asset?.assetPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof AssetFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = async (file: File) => {
    // 这里应该实现真实的文件上传逻辑
    // 暂时使用 FileReader 来预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoPreview(dataUrl);
      setFormData(prev => ({
        ...prev,
        assetPhoto: dataUrl
      }));
    };
    reader.readAsDataURL(file);
  };

  const takePhoto = () => {
    if (typeof window !== 'undefined' && window.tt) {
      // 使用飞书API拍照
      window.tt.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res: any) => {
          if (res.localIds && res.localIds.length > 0) {
            const localId = res.localIds[0];
            setPhotoPreview(localId);
            setFormData(prev => ({
              ...prev,
              assetPhoto: localId
            }));
            toast.success('照片拍摄成功');
          }
        },
        fail: (error: any) => {
          console.error('拍照失败:', error);
          toast.error('拍照失败，请重试');
        }
      });
    } else {
      // Web端使用文件选择
      fileInputRef.current?.click();
    }
  };

  const selectFromGallery = () => {
    if (typeof window !== 'undefined' && window.tt) {
      // 使用飞书API选择图片
      window.tt.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res: any) => {
          if (res.localIds && res.localIds.length > 0) {
            const localId = res.localIds[0];
            setPhotoPreview(localId);
            setFormData(prev => ({
              ...prev,
              assetPhoto: localId
            }));
            toast.success('图片选择成功');
          }
        },
        fail: (error: any) => {
          console.error('选择图片失败:', error);
          toast.error('选择图片失败，请重试');
        }
      });
    } else {
      // Web端使用文件选择
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        handlePhotoUpload(file);
      } else {
        toast.error('请选择图片文件');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 基本验证
    if (!formData.assetName.trim()) {
      toast.error('请输入资产名称');
      return;
    }
    
    if (!formData.purchaseDate) {
      toast.error('请选择购置时间');
      return;
    }
    
    if (formData.purchasePrice <= 0) {
      toast.error('请输入有效的购置价格');
      return;
    }

    try {
      await onSave(formData);
      toast.success(asset ? '资产更新成功' : '资产创建成功');
    } catch (error) {
      console.error('保存失败:', error);
      toast.error('保存失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {asset ? '编辑资产' : '新增资产'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* 资产照片 */}
          <div>
            <Label className="text-sm font-medium text-gray-700">资产照片</Label>
            <div className="mt-2">
              {photoPreview ? (
                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={photoPreview} 
                    alt="资产照片" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview('');
                      setFormData(prev => ({ ...prev, assetPhoto: '' }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">暂无照片</span>
                </div>
              )}
              
              <div className="mt-2 flex space-x-2">
                <Button type="button" variant="outline" size="sm" onClick={takePhoto}>
                  拍照
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={selectFromGallery}>
                  从相册选择
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="assetName">资产名称 *</Label>
              <Input
                id="assetName"
                value={formData.assetName}
                onChange={(e) => handleInputChange('assetName', e.target.value)}
                placeholder="请输入资产名称"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">类别</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择类别</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="purchaseDate">购置时间 *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="purchasePrice">购置价格 (元) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">所属地点</Label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择地点</option>
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="storageLocation">存放地点</Label>
              <Input
                id="storageLocation"
                value={formData.storageLocation}
                onChange={(e) => handleInputChange('storageLocation', e.target.value)}
                placeholder="具体存放位置"
              />
            </div>

            <div>
              <Label htmlFor="responsiblePerson">责任人</Label>
              <Input
                id="responsiblePerson"
                value={formData.responsiblePerson}
                onChange={(e) => handleInputChange('responsiblePerson', e.target.value)}
                placeholder="请输入责任人姓名"
              />
            </div>

            <div>
              <Label htmlFor="usageStatus">使用状态</Label>
              <select
                id="usageStatus"
                value={formData.usageStatus}
                onChange={(e) => handleInputChange('usageStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择状态</option>
                {USAGE_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 财务信息 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">财务信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceType">发票类型</Label>
                <select
                  id="invoiceType"
                  value={formData.invoiceType}
                  onChange={(e) => handleInputChange('invoiceType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择发票类型</option>
                  {INVOICE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="taxRate">税点</Label>
                <select
                  id="taxRate"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择税点</option>
                  {TAX_RATES.map(rate => (
                    <option key={rate} value={rate}>{rate}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 技术规格 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">技术规格</h3>
            <div>
              <Label htmlFor="specifications">规格型号</Label>
              <textarea
                id="specifications"
                value={formData.specifications}
                onChange={(e) => handleInputChange('specifications', e.target.value)}
                placeholder="请输入详细的规格型号信息"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 盘点日期 */}
          <div className="border-t pt-6">
            <div>
              <Label htmlFor="inventoryDate">盘点日期</Label>
              <Input
                id="inventoryDate"
                type="date"
                value={formData.inventoryDate}
                onChange={(e) => handleInputChange('inventoryDate', e.target.value)}
              />
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              取消
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}