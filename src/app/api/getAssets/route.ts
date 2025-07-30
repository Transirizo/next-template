import axios from "axios";
import { NextResponse } from "next/server";

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

    return NextResponse.json(feishuResponse.data);
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
