// Feishu client configuration
const feishuConfig = {
  appId: "cli_a80d3c65433a5013", // 网页应用appId
  getUserAccessTokenPath: "/api/getUserAccessToken", // 免登api path
  getSignParametersPath: "/api/getSignParameters", // 鉴权api path
  apiPort: process.env.NODE_ENV === "development" ? "3000" : "3000", // Next.js default port
  appSecret: "DlDy0kn4VCZP1n4l1Ugr1g7UYjFUlsO0", // 网页应用secret
  noncestr: "SeMa6DS8NX7iAHPmknSfKRn6t3rY6Xfb", // 随机字符串，用于鉴权签名用
};

export default feishuConfig;
