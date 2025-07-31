import axios from "axios";
import { NextResponse } from "next/server";
import { FeishuAssetRecord } from "@/types/asset";
import { transformFeishuAssetsArray } from "@/lib/data-transform";

export async function POST(request: Request) {
  try {
    // Get the authorization token passed from your frontend
    const authorization = request.headers.get("Authorization");

    if (!authorization) {
      return NextResponse.json({ error: "Authorization header is missing" }, { status: 401 });
    }

    // This is the server-to-server call.
    // The code you wrote before works perfectly here on the server.
    const feishuResponse = await axios.post(
      "https://open.feishu.cn/open-apis/bitable/v1/apps/Y0PubyGhzaSItssVT1wcIUO0nzb/tables/tblcAYiDc8fRG0cK/records/search",
      {}, // Request Body
      {
        headers: {
          Authorization: authorization,
          "Content-Type": "application/json",
        },
      }
    );

    // 提取原始数据
    const feishuRecords: FeishuAssetRecord[] = feishuResponse.data.data.items;

    // 转换为应用格式
    const transformedAssets = transformFeishuAssetsArray(feishuRecords);

    // 返回转换后的数据，保持与现有 API 结构一致
    return NextResponse.json({
      success: true,
      data: transformedAssets,
      total: transformedAssets.length,
      rawData: feishuResponse.data,
    });
  } catch (error: any) {
    // Log the detailed error on the server
    console.error("Error calling Feishu API:", error.response?.data || error.message);

    // Return a generic error to the frontend
    return NextResponse.json(
      { error: "Failed to fetch data from Feishu API" },
      { status: error.response?.status || 500 }
    );
  }
}
