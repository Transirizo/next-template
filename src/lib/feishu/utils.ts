import { NextResponse } from 'next/server'

// 工具方法
export function failResponse(msg: string = "error") {
    return NextResponse.json({
        code: -1,
        msg: msg
    }, { status: 400 })
}

export function okResponse(data?: unknown) {
    return NextResponse.json({
        code: 0,
        msg: "ok",
        data: data
    })
}

// 处理跨域问题
// 【特别说明】：该部分实现仅在线下用。【线上环境】需要对敏感信息接口服务端返回的跨域头部进行严格限制，避免任何域都能跨域访问此接口。
export function configAccessControl<T>(response: NextResponse<T>, origin?: string): NextResponse<T> {
    if (origin) {
        response.headers.set("Access-Control-Allow-Origin", origin)
    }
    response.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE")
    response.headers.set("Access-Control-Allow-Credentials", "true") // 表示是否允许发送Cookie
    response.headers.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type")
    return response
}

// 设置Cookie
export function setCookie<T>(response: NextResponse<T>, name: string, value: string): NextResponse<T> {
    if (!name || !value) {
        return response
    }

    response.cookies.set(name, value, {
        maxAge: 2 * 60 * 1000, // cookie有效时长 (2分钟)
        httpOnly: false, // 是否只用于http请求中获取
        secure: false, // 开发环境设为false
        sameSite: 'lax'
    })

    return response
}

// 获取Cookie (从request中获取)
export function getCookie(request: Request, name: string): string {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) return ''
    
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
    const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`))
    
    return targetCookie ? targetCookie.split('=')[1] : ''
}

// Session类型定义
export interface UserInfo {
    access_token: string
    expires_in: number
    refresh_token: string
    token_type: string
    scope: string
    refresh_expires_in: number
}

// 签名参数类型
export interface SignParam {
    app_id: string
    signature: string
    noncestr: string
    timestamp: number
}