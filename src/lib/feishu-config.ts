// Feishu client configuration
const feishuConfig = {
  appId: "cli_a80dc223d5be5013", // 网页应用appId
  getUserAccessTokenPath: "/api/feishu/get_user_access_token", // 免登api path
  getSignParametersPath: "/api/feishu/get_sign_parameters", // 鉴权api path
  apiPort: process.env.NODE_ENV === 'development' ? "3000" : "3000", // Next.js default port
}

export default feishuConfig;