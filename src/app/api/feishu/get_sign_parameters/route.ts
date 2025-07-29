import { NextRequest } from 'next/server'
import { getTenantAccessToken, getJSApiTicket, calculateSignParam } from '@/lib/feishu/auth'
import { failResponse, okResponse, configAccessControl, setCookie, getCookie } from '@/lib/feishu/utils'

const LJ_JSTICKET_KEY = 'lk_jsticket'

// 处理鉴权参数请求，返回鉴权参数
export async function GET(request: NextRequest) {
    console.log("\n-------------------[接入方服务端鉴权处理 BEGIN]-----------------------------")
    console.log(`接入服务方第① 步: 接收到前端鉴权请求`)

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url") || ""
    const ticketString = getCookie(request, LJ_JSTICKET_KEY)
    
    if (ticketString.length > 0) {
        console.log(`接入服务方第② 步: Cookie中获取jsapi_ticket，计算JSAPI鉴权参数，返回`)
        const signParam = calculateSignParam(ticketString, url)
        let response = okResponse(signParam)
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        console.log("-------------------[接入方服务端鉴权处理 END]-----------------------------\n")
        return response
    }

    console.log(`接入服务方第② 步: 未检测到jsapi_ticket，根据AppID和App Secret请求自建应用授权凭证tenant_access_token`)
    
    // 【请求】tenant_access_token
    const tenantTokenResult = await getTenantAccessToken()
    
    if (!tenantTokenResult.success) {
        let response = failResponse(tenantTokenResult.error || 'tenant_access_token request error')
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        return response
    }

    console.log(`接入服务方第③ 步: 获得颁发的自建应用授权凭证tenant_access_token`)
    const tenant_access_token = tenantTokenResult.token!

    console.log(`接入服务方第④ 步: 请求JSAPI临时授权凭证`)
    // 【请求】jsapi_ticket
    const ticketResult = await getJSApiTicket(tenant_access_token)
    
    if (!ticketResult.success) {
        let response = failResponse(ticketResult.error || 'get jssdk ticket request error')
        response = configAccessControl(response, request.headers.get('origin') || undefined)
        return response
    }

    console.log(`接入服务方第⑤ 步: 获得颁发的JSAPI临时授权凭证，更新到Cookie`)
    const newTicketString = ticketResult.ticket!
    
    let response = okResponse()
    response = configAccessControl(response, request.headers.get('origin') || undefined)
    
    if (newTicketString.length > 0) {
        response = setCookie(response, LJ_JSTICKET_KEY, newTicketString)
    }

    console.log(`接入服务方第⑥ 步: 计算出JSAPI鉴权参数，并返回给前端`)
    const signParam = calculateSignParam(newTicketString, url)
    response = okResponse(signParam)
    response = configAccessControl(response, request.headers.get('origin') || undefined)
    
    console.log("-------------------[接入方服务端鉴权处理 END]-----------------------------\n")
    return response
}