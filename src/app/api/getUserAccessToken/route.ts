import { NextRequest } from 'next/server'
import { getAppAccessToken, getUserAccessTokenByCode } from '@/lib/feishu/auth'
import { failResponse, okResponse, configAccessControl, setCookie, UserInfo } from '@/lib/feishu/utils'
import { getSession, setSession, getTokenCookie, LJ_TOKEN_KEY } from '@/lib/feishu/session'

// 处理免登请求，返回用户的user_access_token
export async function GET(request: NextRequest) {
    console.log("\n-------------------[接入服务端免登处理 BEGIN]-----------------------------")
    console.log(`接入服务方第① 步: 接收到前端免登请求`)
    
    const session = getSession(request)
    const accessToken = session.userinfo
    const lkToken = getTokenCookie(request)
    
    if (accessToken && accessToken.access_token && lkToken.length > 0 && accessToken.access_token === lkToken) {
        console.log("接入服务方第② 步: 从Session中获取user_access_token信息，用户已登录")
        let response = okResponse(accessToken)
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        console.log("-------------------[接入服务端免登处理 END]-----------------------------\n")
        return response
    }

    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code") || ""
    console.log("接入服务方第② 步: 获取登录预授权码code")
    
    if (code.length === 0) {
        console.log("code不存在")
        let response = failResponse("登录预授权码code is empty, please retry!!!")
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        return response
    }

    // 【请求】app_access_token
    console.log("接入服务方第③ 步: 根据AppID和App Secret请求应用授权凭证app_access_token")
    const appTokenResult = await getAppAccessToken()
    
    if (!appTokenResult.success) {
        let response = failResponse(appTokenResult.error || "app_access_token request error")
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        return response
    }

    console.log("接入服务方第④ 步: 获得颁发的应用授权凭证app_access_token")
    const app_access_token = appTokenResult.token!

    console.log("接入服务方第⑤ 步: 根据登录预授权码code和app_access_token请求用户授权凭证user_access_token")
    const userTokenResult = await getUserAccessTokenByCode(code, app_access_token)
    
    if (!userTokenResult.success) {
        let response = failResponse(userTokenResult.error || "access_token request error")
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        return response
    }

    console.log("接入服务方第⑥ 步: 获取颁发的用户授权码凭证的user_access_token, 更新到Session，返回给前端")
    const newAccessToken = userTokenResult.data as UserInfo
    
    let response = okResponse(newAccessToken)
    response = configAccessControl(response, request.headers.get('origin') || undefined)
    
    if (newAccessToken) {
        response = setSession(request, response, newAccessToken)
        response = setCookie(response, LJ_TOKEN_KEY, newAccessToken.access_token || '')
    } else {
        response = setCookie(response, LJ_TOKEN_KEY, '')
    }

    console.log("-------------------[接入服务端免登处理 END]-----------------------------\n")
    return response
}