// Feishu client configuration
const feishuConfig = {
  appId: "cli_a80dc223d5be5013", // 网页应用appId
  getUserAccessTokenPath: "/api/getUserAccessToken", // 免登api path
  getSignParametersPath: "/api/getSignParameters", // 鉴权api path
  apiPort: process.env.NODE_ENV === "development" ? "3000" : "3000", // Next.js default port
  appSecret: "hzQTlhZQPo7u2R8b8p8Fz7Q68e3jLuj5", // 网页应用secret
  noncestr: "SeMa6DS8NX7iAHPmknSfKRn6t3rY6Xfb", // 随机字符串，用于鉴权签名用
};

export default feishuConfig;
