"use client";

import Script from "next/script";

declare global {
  interface Window {
    VConsole?: new () => any; // VConsole 是一个构造函数
  }
}

export function ThirdPartyScripts() {
  const initializeLarkSDK = () => {
    try {
      if (window.h5sdk) {
        console.log("Lark H5 SDK loaded, configuring...");
        window.h5sdk.ready(() => {
          console.log("Lark H5 SDK is ready!");
        });
        window.h5sdk.error((err: any) => {
          console.error("Lark H5 SDK error:", err);
        });
      } else {
        console.log("Lark H5 SDK not found. Skipping initialization.");
      }
    } catch (e) {
      console.error("An error occurred during Lark H5 SDK initialization:", e);
    }
  };

  return (
    <>
      {/* 仅在非生产环境加载 VConsole */}
      {process.env.NODE_ENV !== "production" && (
        <Script
          id="vconsole-script"
          src="https://unpkg.com/vconsole/dist/vconsole.min.js"
          strategy="afterInteractive"
          onLoad={() => {
            // 这个函数会在 vconsole.min.js 加载并执行后才被调用
            if (typeof window.VConsole !== "undefined") {
              console.log("VConsole script loaded. Initializing...");
              new window.VConsole();
            }
          }}
        />
      )}

      <Script
        id="lark-h5-sdk-script"
        src="https://lf1-cdn-tos.bytegoofy.com/goofy/lark/op/h5-js-sdk-1.5.31.js"
        strategy="afterInteractive"
        onLoad={initializeLarkSDK} // 在脚本加载后调用初始化函数
      />
    </>
  );
}
