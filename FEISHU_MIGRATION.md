# Feishu API Migration Documentation

## 概述

原 Koa 服务器中的飞书(Feishu)认证相关功能已成功迁移到 Next.js API Routes。

## 迁移的功能

### 1. 用户认证流程

- **原路径**: `/api/get_user_access_token`
- **新路径**: `/api/feishu/get_user_access_token`
- **功能**: 处理飞书免登录，获取用户授权令牌

### 2. JSAPI 签名参数

- **原路径**: `/api/get_sign_parameters`
- **新路径**: `/api/feishu/get_sign_parameters`
- **功能**: 生成 JSAPI 鉴权参数

### 3. 测试端点

- **新路径**: `/api/feishu/test`
- **功能**: 测试 API 是否正常工作

## API 使用方法

### 获取用户访问令牌

```bash
GET /api/feishu/get_user_access_token?code=YOUR_AUTH_CODE
```

**响应格式:**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "access_token": "用户访问令牌",
    "expires_in": 7200,
    "refresh_token": "刷新令牌",
    "token_type": "Bearer",
    "scope": "授权范围",
    "refresh_expires_in": 2592000
  }
}
```

### 获取签名参数

```bash
GET /api/feishu/get_sign_parameters?url=YOUR_PAGE_URL
```

**响应格式:**

```json
{
  "code": 0,
  "msg": "ok",
  "data": {
    "app_id": "应用ID",
    "signature": "签名",
    "noncestr": "随机字符串",
    "timestamp": 1234567890
  }
}
```

### 测试 API

```bash
GET /api/feishu/test
```

## 技术实现

### 文件结构

```
src/
├── lib/feishu/
│   ├── config.ts          # 飞书应用配置
│   ├── utils.ts           # 工具函数(响应格式、CORS、Cookie)
│   ├── auth.ts            # 认证相关API调用
│   └── session.ts         # 会话管理
└── app/api/feishu/
    ├── get_user_access_token/route.ts
    ├── get_sign_parameters/route.ts
    └── test/route.ts
```

### 关键特性

- ✅ **会话管理**: 内存存储(生产环境建议使用 Redis)
- ✅ **Cookie 处理**: 自动处理认证 Cookie
- ✅ **CORS 支持**: 跨域请求支持
- ✅ **错误处理**: 统一错误响应格式
- ✅ **TypeScript**: 完整类型支持
- ✅ **兼容性**: 保持与原 Koa API 相同的响应格式

### 配置

在 `src/lib/feishu/config.ts` 中配置飞书应用信息:

```typescript
export const feishuConfig = {
  appId: "your_app_id",
  appSecret: "your_app_secret",
  noncestr: "random_string_for_signature",
  // ...
};
```

## 迁移对比

| 原 Koa 实现    | 新 Next.js 实现         |
| -------------- | ----------------------- |
| Express 中间件 | Next.js API Routes      |
| koa-session    | 内存会话存储            |
| koa-router     | 文件路由系统            |
| CommonJS       | ES Modules + TypeScript |
| 单独服务器     | 集成到 Next.js 应用     |

## 测试验证

运行测试脚本验证迁移:

```bash
node test-feishu-api.js
```

## 注意事项

1. **生产环境**: 建议将会话存储改为 Redis
2. **安全性**: 请在生产环境中正确配置 CORS 策略
3. **日志**: 所有 API 调用都有详细的控制台日志输出
4. **兼容性**: API 响应格式与原 Koa 服务器完全兼容

## 下一步

原 Koa 服务器文件已保留在 `server/` 目录中，可以在确认迁移无误后删除。
