export interface Asset {
  id: string;
  assetCode: string;        // 资产编码
  assetName: string;        // 资产名称
  purchaseDate: string;     // 购置时间 (YYYY-MM-DD)
  location: string;         // 所属地点
  purchasePrice: number;    // 购置价格
  invoiceType: string;      // 发票类型
  taxRate: string;          // 税点
  specifications: string;   // 规格型号
  category: string;         // 类别
  inventoryDate: string;    // 盘点日期
  assetPhoto?: string;      // 资产照片URL
  usageStatus: string;      // 使用状态
  storageLocation: string;  // 存放地点
  responsiblePerson: string; // 责任人
}

export interface User {
  id: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
  access_token?: string;
}

export type AssetFormData = Omit<Asset, 'id' | 'assetCode'>;

// 下拉选项配置
export const INVOICE_TYPES = ['普票', '专票', '无票'] as const;
export const TAX_RATES = ['0%', '1%', '3%', '6%', '9%', '13%'] as const;
export const USAGE_STATUS = ['在用', '闲置', '维修中', '报废'] as const;
export const CATEGORIES = ['电子设备', '办公家具', '办公用品', '其他'] as const;
export const LOCATIONS = ['茶山', '松山湖'] as const;