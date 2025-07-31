import { Asset, FeishuAssetRecord } from "@/types/asset";

/**
 * 从 Feishu API 数据转换为应用内部 Asset 格式
 */
export function transformFeishuToAsset(feishuRecord: FeishuAssetRecord): Asset {
  const { record_id, fields } = feishuRecord;

  // 辅助函数：提取文本值
  const getTextValue = (field?: Array<{ text: string; type: "text" }>): string => {
    return field?.[0]?.text || "";
  };

  // 辅助函数：格式化日期
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return "";
    return new Date(timestamp).toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // 辅助函数：获取第一张照片URL
  const getPhotoUrl = (photos?: Array<{ url: string; tmp_url: string }>): string => {
    return photos?.[0]?.url || photos?.[0]?.tmp_url || "";
  };

  return {
    id: record_id,
    assetCode: getTextValue(fields.固定资产编码),
    assetName: getTextValue(fields.资产名称),
    location: getTextValue(fields.所属地点),
    category: getTextValue(fields.类别),
    usageStatus: getTextValue(fields.使用状态),
    storageLocation: getTextValue(fields.存放地点),
    inventoryDate: formatDate(fields.盘点日期),
    assetPhoto: getPhotoUrl(fields.资产照片),
    
    // 现在从 Feishu 数据中获取这些字段
    purchaseDate: formatDate(fields.购置时间),
    purchasePrice: fields["购置价格（元）"] || 0,
    specifications: getTextValue(fields.规格型号),
    responsiblePerson: getTextValue(fields.责任人),
    
    // 这些字段在 Feishu 数据中没有，设置默认值
    invoiceType: "",
    taxRate: "",
  };
}

/**
 * 批量转换 Feishu 数据数组
 */
export function transformFeishuAssetsArray(feishuRecords: FeishuAssetRecord[]): Asset[] {
  return feishuRecords.map(transformFeishuToAsset);
}

/**
 * 测试函数：使用完整的示例数据验证转换
 */
export function testTransformation() {
  const sampleFeishuRecord: FeishuAssetRecord = {
    record_id: "recuzJWZ99oxgh",
    fields: {
      使用状态: [{ text: "使用中", type: "text" }],
      固定资产编码: [{ text: "197", type: "text" }],
      存放地点: [{ text: "包装车间", type: "text" }],
      所属地点: [{ text: "茶山", type: "text" }],
      盘点日期: 1736697600000,
      类别: [{ text: "办公设备", type: "text" }],
      规格型号: [{ text: "联想台式酷睿12代i5 16G 512G", type: "text" }],
      责任人: [{ text: "蒲朝飞,伍平", type: "text" }],
      "购置价格（元）": 2785,
      购置时间: 1736179200000,
      资产名称: [{ text: "联想台式电脑", type: "text" }],
      资产照片: [
        {
          file_token: "BHRpbgQH9ok55Ux0FG5caKBnncc",
          name: "test.jpeg",
          size: 584200,
          tmp_url: "https://example.com/tmp",
          type: "image/jpeg",
          url: "https://example.com/download"
        }
      ]
    }
  };

  const transformedAsset = transformFeishuToAsset(sampleFeishuRecord);
  
  console.log("🧪 Data Transformation Test:");
  console.log("Original Feishu Record:", JSON.stringify(sampleFeishuRecord, null, 2));
  console.log("Transformed Asset:", JSON.stringify(transformedAsset, null, 2));
  
  return transformedAsset;
}