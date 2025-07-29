import { okResponse } from '@/lib/feishu/utils'
import { feishuConfig } from '@/lib/feishu/config'

// 测试API端点
export async function GET() {
    const testData = {
        message: "Feishu API migration successful!",
        timestamp: new Date().toISOString(),
        config: {
            appId: feishuConfig.appId ? "配置正常" : "配置缺失",
            endpoints: {
                getUserAccessToken: feishuConfig.getUserAccessTokenPath,
                getSignParameters: feishuConfig.getSignParametersPath
            }
        },
        availableEndpoints: [
            '/api/feishu/get_user_access_token',
            '/api/feishu/get_sign_parameters',
            '/api/feishu/test'
        ]
    }
    
    console.log("Feishu API test endpoint called:", testData)
    
    return okResponse(testData)
}