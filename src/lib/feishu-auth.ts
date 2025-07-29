import axios from "axios";
import Cookies from "js-cookie";
import feishuConfig from "./feishu-config";

const LJ_TOKEN_KEY = "lk_token";

declare global {
  interface Window {
    h5sdk: any;
    tt: any;
  }
}

/// ---------------- JSAPI鉴权 部分 -------------------------

export async function handleJSAPIAccess(complete: (isSuccess: boolean) => void) {
  console.log("\n----------[接入方网页JSAPI鉴权处理 BEGIN]----------");
  const url = encodeURIComponent(window.location.href.split("#")[0]);
  console.log("接入方前端[JSAPI鉴权处理]第① 步: 请求JSAPI鉴权参数");

  try {
    // 向接入方服务端发起请求，获取鉴权参数（appId、timestamp、nonceStr、signature）
    const res = await axios.get(`${getOrigin()}${feishuConfig.getSignParametersPath}?url=${url}`, {
      withCredentials: true,
    });

    if (!res.data) {
      console.error(`${feishuConfig.getSignParametersPath} fail`);
      complete(false);
      return;
    }

    const data = res.data.data;
    console.log("接入方前端[JSAPI鉴权处理]第② 步: 获得鉴权参数");
    if (!data) {
      console.error("获取参数失败");
      complete(false);
      return;
    }
    console.log("接入方前端[JSAPI鉴权处理]第③ 步: 通过window.h5sdk.config进行鉴权");
    configJSAPIAccess(data, complete);
  } catch (error) {
    console.error("JSAPI鉴权失败:", error);
    complete(false);
  }
}

//config JSAPI鉴权
function configJSAPIAccess(data: any, complete: (isSuccess: boolean) => void) {
  //配置要使用的jsapi列表
  let jsApiList = ["tt.getSystemInfo", "tt.showActionSheet", "tt.previewImage", "tt.showToast"];

  // 调用config接口进行鉴权
  window.h5sdk.config({
    appId: data.app_id,
    timestamp: data.timestamp,
    nonceStr: data.noncestr,
    signature: data.signature,
    jsApiList: jsApiList,
    //成功回调
    onSuccess: (res: any) => {
      console.log(`鉴权成功: ${JSON.stringify(res)}`);
      window.tt.showToast({
        title: "鉴权成功",
        icon: "success",
        duration: 2000,
      });
      complete(true);
      console.log("\n----------[接入方网页鉴权处理 END]----------");
    },
    //失败回调
    onFail: (err: any) => {
      window.tt.showToast({
        title: "鉴权失败",
        icon: "error",
        duration: 2000,
      });
      complete(false);
      console.error(`鉴权失败原因: ${JSON.stringify(err)}`);
    },
  });
}

/// ---------------- 应用免登 部分 -------------------------
//处理用户免登逻辑
export async function handleUserAuth(complete: (userInfo?: any) => void) {
  console.log("\n----------[接入方网页免登处理 BEGIN]----------");

  // 检查是否有存储的token
  let lj_tokenString = Cookies.get(LJ_TOKEN_KEY) || "";

  if (lj_tokenString.length > 0) {
    console.log("接入方前端[免登处理]第① 步: 用户已登录，请求后端验证...");
    requestUserAccessToken("", complete);
  } else {
    if (!window.h5sdk) {
      console.log("invalid h5sdk");
      complete();
      return;
    }
    console.log(
      "接入方前端[免登处理]第① 步: 依据App ID调用JSAPI tt.requestAuthCode 请求免登授权码"
    );
    //依据App ID调用JSAPI tt.requestAuthCode 请求登录预授权码code
    window.h5sdk.ready(() => {
      console.log("window.h5sdk.ready");
      window.tt.requestAuthCode({
        appId: feishuConfig.appId,
        success: (info: any) => {
          const code = info.code;
          if (code.length <= 0) {
            console.error("auth code为空");
            complete();
          } else {
            requestUserAccessToken(code, complete);
          }
        },
        fail: (error: any) => {
          complete();
          console.error("window.tt.requestAuthCode", error);
        },
      });
    });
  }
}

function requestUserAccessToken(code: string, complete: (userInfo?: any) => void) {
  // 获取user_access_token信息
  console.log("接入方前端[免登处理]第② 步: 去接入方服务端获取user_access_token信息");
  axios
    .get(`${getOrigin()}${feishuConfig.getUserAccessTokenPath}?code=${code}`, {
      withCredentials: true, //调用时设置 请求带上cookie
    })
    .then(function (response) {
      if (!response.data) {
        console.error(`${feishuConfig.getUserAccessTokenPath} response is null`);
        complete();
        return;
      }
      const data = response.data.data;
      if (data) {
        console.log("接入方前端[免登处理]第③ 步: 获取user_access_token信息");
        complete(data);
        if (typeof window !== "undefined") {
          localStorage.setItem(LJ_TOKEN_KEY, data.access_token);
        }
        console.log("----------[接入网页方免登处理 END]----------\n");
      } else {
        console.error("接入方前端[免登处理]第③ 步: 未获取user_access_token信息");
        complete();
        console.log("----------[接入网页方免登处理 END]----------\n");
      }
    })
    .catch(function (error) {
      console.log(`${feishuConfig.getSignParametersPath} error:`, error);
      complete();
      console.log("----------[接入网页方免登处理 END]----------\n");
    });
}

function getOrigin() {
  if (typeof window === "undefined") return "";
  let hostname = window.location.hostname;
  return `${window.location.protocol}//${hostname}:${feishuConfig.apiPort}`;
}
