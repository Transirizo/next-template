import { NextRequest, NextResponse } from 'next/server'
import { UserInfo } from './utils'

const SESSION_KEY = 'lk_session'
const LJ_TOKEN_KEY = 'lk_token'

// 简单的内存会话存储 (生产环境应使用Redis等)
const sessionStore = new Map<string, { userinfo?: UserInfo; timestamp: number }>()

// 清理过期会话
function cleanExpiredSessions() {
    const now = Date.now()
    const maxAge = 2 * 3600 * 1000 // 2小时
    
    for (const [sessionId, session] of sessionStore.entries()) {
        if (now - session.timestamp > maxAge) {
            sessionStore.delete(sessionId)
        }
    }
}

// 生成会话ID
function generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 获取会话
export function getSession(request: NextRequest): { userinfo?: UserInfo } {
    cleanExpiredSessions()
    
    const sessionId = request.cookies.get(SESSION_KEY)?.value
    
    if (!sessionId) {
        return {}
    }
    
    const session = sessionStore.get(sessionId)
    if (!session) {
        return {}
    }
    
    return { userinfo: session.userinfo }
}

// 设置会话
export function setSession<T>(request: NextRequest, response: NextResponse<T>, userinfo: UserInfo): NextResponse<T> {
    cleanExpiredSessions()
    
    let sessionId = request.cookies.get(SESSION_KEY)?.value
    
    if (!sessionId) {
        sessionId = generateSessionId()
        response.cookies.set(SESSION_KEY, sessionId, {
            maxAge: 2 * 3600 * 1000, // 2小时
            httpOnly: true,
            secure: false, // 开发环境设为false
            sameSite: 'lax'
        })
    }
    
    sessionStore.set(sessionId, {
        userinfo,
        timestamp: Date.now()
    })
    
    return response
}

// 清除会话
export function clearSession<T>(request: NextRequest, response: NextResponse<T>): NextResponse<T> {
    const sessionId = request.cookies.get(SESSION_KEY)?.value
    
    if (sessionId) {
        sessionStore.delete(sessionId)
        response.cookies.delete(SESSION_KEY)
    }
    
    return response
}

// 获取token cookie
export function getTokenCookie(request: NextRequest): string {
    return request.cookies.get(LJ_TOKEN_KEY)?.value || ''
}

export { LJ_TOKEN_KEY }