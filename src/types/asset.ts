export interface Asset {
  id: string;
  assetCode: string;        // 资产编码 (固定资产编码)
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
  storageLocation: string;  // 存放地点 (存放地点)
  responsiblePerson: string; // 责任人
}

// Feishu API 原始数据结构
export interface FeishuAssetRecord {
  record_id: string;
  fields: {
    使用状态?: Array<{ text: string; type: "text" }>;
    固定资产编码?: Array<{ text: string; type: "text" }>;
    存放地点?: Array<{ text: string; type: "text" }>;
    所属地点?: Array<{ text: string; type: "text" }>;
    盘点日期?: number; // timestamp
    类别?: Array<{ text: string; type: "text" }>;
    规格型号?: Array<{ text: string; type: "text" }>;
    责任人?: Array<{ text: string; type: "text" }>;
    "购置价格（元）"?: number; // direct number
    购置时间?: number; // timestamp
    资产名称?: Array<{ text: string; type: "text" }>;
    资产照片?: Array<{
      file_token: string;
      name: string;
      size: number;
      tmp_url: string;
      type: string;
      url: string;
    }>;
  };
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
export const USAGE_STATUS = ['在用', '使用中', '闲置', '维修中', '报废'] as const;
export const CATEGORIES = ['电子设备', '办公设备', '办公家具', '办公用品', '设备', '其他'] as const;
export const LOCATIONS = ['茶山', '松山湖'] as const;