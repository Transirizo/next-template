import { NextResponse } from "next/server";
import { withDefaultErrorHandlingForDynamicRoute } from "@/lib/error-handler/error-handler";

// 模拟数据库（与其他路由保持一致）
const mockAssets = [
  {
    id: "1",
    assetCode: "ZC-2025-001",
    assetName: "MacBook Pro 14寸",
    purchaseDate: "2024-01-15",
    location: "茶山",
    purchasePrice: 15999,
    invoiceType: "专票",
    taxRate: "13%",
    specifications: "Apple M3 Pro 芯片\n18GB 统一内存\n512GB SSD 存储空间",
    category: "电子设备",
    inventoryDate: "2024-12-01",
    assetPhoto: "/images/sample.jpg",
    usageStatus: "在用",
    storageLocation: "技术部办公室",
    responsiblePerson: "张三",
  },
  {
    id: "2",
    assetCode: "ZC-2025-002",
    assetName: "人体工学椅",
    purchaseDate: "2024-02-10",
    location: "松山湖",
    purchasePrice: 2800,
    invoiceType: "普票",
    taxRate: "13%",
    specifications: "可升降扶手\n腰部支撑\n透气网布材质",
    category: "办公家具",
    inventoryDate: "2024-11-15",
    usageStatus: "在用",
    storageLocation: "人事部办公室",
    responsiblePerson: "李四",
  },
  {
    id: "3",
    assetCode: "ZC-2025-003",
    assetName: "HP LaserJet Pro 打印机",
    purchaseDate: "2024-03-05",
    location: "茶山",
    purchasePrice: 1899,
    invoiceType: "专票",
    taxRate: "13%",
    specifications: "黑白激光打印\n每分钟22页\n自动双面打印",
    category: "电子设备",
    inventoryDate: "2024-10-20",
    usageStatus: "维修中",
    storageLocation: "A会议室",
    responsiblePerson: "王五",
  },
  {
    id: "4",
    assetCode: "ZC-2025-004",
    assetName: "戴尔显示器 27寸",
    purchaseDate: "2024-04-20",
    location: "茶山",
    purchasePrice: 2299,
    invoiceType: "专票",
    taxRate: "13%",
    specifications: "2560x1440分辨率\nIPS面板\n75Hz刷新率",
    category: "电子设备",
    inventoryDate: "2024-09-10",
    usageStatus: "在用",
    storageLocation: "技术部办公室",
    responsiblePerson: "赵六",
  },
  {
    id: "5",
    assetCode: "ZC-2025-005",
    assetName: "办公桌",
    purchaseDate: "2024-05-15",
    location: "松山湖",
    purchasePrice: 899,
    invoiceType: "普票",
    taxRate: "13%",
    specifications: "实木材质\n120cm x 60cm\n可调节高度",
    category: "办公家具",
    inventoryDate: "2024-08-25",
    usageStatus: "闲置",
    storageLocation: "仓库",
    responsiblePerson: "孙七",
  },
];

// GET /api/assets/code/[code] - 通过资产编码查询资产
export const GET = withDefaultErrorHandlingForDynamicRoute(
  async (request: Request, { params }: { params: { code: string } }) => {
    const { code } = await params;

    // 解码URL编码的资产编码
    const decodedCode = decodeURIComponent(code);

    const asset = mockAssets.find((a) => a.assetCode === decodedCode);

    if (!asset) {
      return NextResponse.json(
        {
          success: false,
          error: "未找到该资产，请联系管理员",
          code: decodedCode,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: asset,
      message: `成功找到资产: ${asset.assetName}`,
    });
  }
);
