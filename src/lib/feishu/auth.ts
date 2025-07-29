import CryptoJS from 'crypto-js'
import { feishuConfig } from './config'
import { SignParam } from './utils'

// 计算鉴权参数
export function calculateSignParam(ticketString: string, url: string): SignParam {
    const timestamp = (new Date()).getTime()
    const verifyStr = `jsapi_ticket=${ticketString}&noncestr=${feishuConfig.noncestr}&timestamp=${timestamp}&url=${url}`
    const signature = CryptoJS.SHA1(verifyStr).toString(CryptoJS.enc.Hex)
    
    const signParam: SignParam = {
        app_id: feishuConfig.appId,
        signature: signature,
        noncestr: feishuConfig.noncestr,
        timestamp: timestamp,
    }
    return signParam
}

// 获取应用授权凭证
export async function getAppAccessToken(): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "app_id": feishuConfig.appId,
                "app_secret": feishuConfig.appSecret
            })
        })

        const data = await response.json()
        
        if (!data) {
            return { success: false, error: "app_access_token request error" }
        }
        
        if (data.code !== 0) {
            return { success: false, error: `app_access_token request error: ${data.msg}` }
        }

        return { success: true, token: data.app_access_token }
    } catch {
        return { success: false, error: "Network error" }
    }
}

// 获取租户授权凭证
export async function getTenantAccessToken(): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
        const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "app_id": feishuConfig.appId,
                "app_secret": feishuConfig.appSecret
            })
        })

        const data = await response.json()
        
        if (!data) {
            return { success: false, error: "tenant_access_token request error" }
        }
        
        if (data.code !== 0) {
            return { success: false, error: `tenant_access_token request error: ${data.msg}` }
        }

        return { success: true, token: data.tenant_access_token }
    } catch {
        return { success: false, error: "Network error" }
    }
}

// 获取用户授权凭证
export async function getUserAccessTokenByCode(code: string, appAccessToken: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
    try {
        const response = await fetch("https://open.feishu.cn/open-apis/authen/v1/access_token", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Bearer " + appAccessToken
            },
            body: JSON.stringify({
                "grant_type": "authorization_code",
                "code": code
            })
        })

        const data = await response.json()
        
        if (!data) {
            return { success: false, error: "access_token request error" }
        }
        
        if (data.code !== 0) {
            return { success: false, error: `access_token request error: ${data.msg}` }
        }

        return { success: true, data: data.data }
    } catch {
        return { success: false, error: "Network error" }
    }
}

// 获取JSAPI票据
export async function getJSApiTicket(tenantAccessToken: string): Promise<{ success: boolean; ticket?: string; error?: string }> {
    try {
        const response = await fetch("https://open.feishu.cn/open-apis/jssdk/ticket/get", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Bearer " + tenantAccessToken
            },
            body: JSON.stringify({})
        })

        const data = await response.json()
        
        if (!data) {
            return { success: false, error: "get jssdk ticket request error" }
        }
        
        if (data.code !== 0) {
            return { success: false, error: `get jssdk ticket request error: ${data.msg}` }
        }

        return { success: true, ticket: data.data.ticket }
    } catch {
        return { success: false, error: "Network error" }
    }
}