// Feishu configuration
export const feishuConfig = {
  appId: "cli_a80dc223d5be5013", // 网页应用appId
  appSecret: "hzQTlhZQPo7u2R8b8p8Fz7Q68e3jLuj5", // 网页应用secret
  getUserAccessTokenPath: "/api/getUserAccessToken", // 免登-获取user_access_token的api path
  getSignParametersPath: "/api/getSignParameters", // 鉴权-获取鉴权参数的api path
  noncestr: "SeMa6DS8NX7iAHPmknSfKRn6t3rY6Xfb", // 随机字符串，用于鉴权签名用
  apiPort: "8989", // 后端指定端口
};
