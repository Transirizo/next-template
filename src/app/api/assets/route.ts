import { NextResponse } from "next/server";
import { withDefaultErrorHandling } from "@/lib/error-handler/error-handler";

// TODO: 替换为真实的数据库连接
// import { db } from '@/lib/database';
// import { assets } from '@/lib/database/schema';

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

// GET /api/assets - 获取资产列表
export const GET = withDefaultErrorHandling(async (request: Request) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  const status = url.searchParams.get("status");
  const category = url.searchParams.get("category");
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  try {
    // TODO: 实现真实的数据库查询
    // 示例伪代码：
    /*
    let query = db.select().from(assets);
    
    if (search) {
      query = query.where(
        or(
          like(assets.assetName, `%${search}%`),
          like(assets.assetCode, `%${search}%`),
          like(assets.responsiblePerson, `%${search}%`)
        )
      );
    }
    
    if (status) {
      query = query.where(eq(assets.usageStatus, status));
    }
    
    if (category) {
      query = query.where(eq(assets.category, category));
    }
    
    const offset = (page - 1) * limit;
    const result = await query.limit(limit).offset(offset);
    const total = await db.select({ count: count() }).from(assets);
    */

    // 使用Mock数据进行过滤和分页
    let filteredAssets = [...mockAssets];

    // 搜索过滤
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(
        (asset) =>
          asset.assetName.toLowerCase().includes(searchLower) ||
          asset.assetCode.toLowerCase().includes(searchLower) ||
          asset.responsiblePerson.toLowerCase().includes(searchLower)
      );
    }

    // 状态过滤
    if (status) {
      filteredAssets = filteredAssets.filter((asset) => asset.usageStatus === status);
    }

    // 分类过滤
    if (category) {
      filteredAssets = filteredAssets.filter((asset) => asset.category === category);
    }

    // 分页
    const total = filteredAssets.length;
    const offset = (page - 1) * limit;
    const paginatedAssets = filteredAssets.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      data: paginatedAssets,
      total,
      page,
      limit,
      message: "资产列表获取成功（Mock数据）",
    });
  } catch (error) {
    console.error("查询资产列表失败:", error);
    return NextResponse.json({ success: false, error: "查询失败" }, { status: 500 });
  }
});

// POST /api/assets - 创建新资产
export const POST = withDefaultErrorHandling(async (request: Request) => {
  const body = await request.json();

  // 验证必填字段
  if (!body.assetName || !body.purchaseDate || body.purchasePrice === undefined) {
    return NextResponse.json(
      { success: false, error: "缺少必填字段：资产名称、购置时间、购置价格" },
      { status: 400 }
    );
  }

  try {
    // TODO: 实现真实的数据库插入
    // 示例伪代码：
    /*
    // 生成新的资产编码
    const year = new Date().getFullYear();
    const lastAsset = await db.select().from(assets)
      .where(like(assets.assetCode, `ZC-${year}-%`))
      .orderBy(desc(assets.assetCode))
      .limit(1);
    
    let nextNumber = 1;
    if (lastAsset.length > 0) {
      const lastCode = lastAsset[0].assetCode;
      const lastNumber = parseInt(lastCode.split('-').pop() || '0');
      nextNumber = lastNumber + 1;
    }
    
    const newAssetCode = `ZC-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    const newAsset = {
      assetCode: newAssetCode,
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.insert(assets).values(newAsset).returning();
    */

    // 临时返回示例数据
    const newAsset = {
      id: "temp-" + Date.now(),
      assetCode: `ZC-2025-${String(Math.floor(Math.random() * 999) + 1).padStart(3, "0")}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newAsset,
      message: "资产创建成功（临时数据，请实现数据库存储）",
    });
  } catch (error) {
    console.error("创建资产失败:", error);
    return NextResponse.json({ success: false, error: "创建失败" }, { status: 500 });
  }
});
