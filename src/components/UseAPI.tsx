'use client';

declare global {
  interface Window {
    tt: any;
  }
}

export default function UseAPI() {
  const showActionSheet = () => {
    if (typeof window !== 'undefined' && window.tt) {
      window.tt.showActionSheet({
        "itemList": [
          "选项1",
          "选项2",
          "选项3",
          "选项4"
        ],
        success(res: any) {
          console.log(JSON.stringify(res));
        },
        fail(res: any) {
          console.log(`showActionSheet fail: ${JSON.stringify(res)}`);
        }
      });
    }
  };

  const getSystemInfo = () => {
    if (typeof window !== 'undefined' && window.tt) {
      window.tt.getSystemInfo({
        success(res: any) {
          window.tt.showModal({
            title: '系统信息',
            content: JSON.stringify(res),
            confirmText: '确定',
            cancelText: '',
            success(res: any) {
              console.log('showModal 调用成功', res);
            },
            fail(res: any) {
              console.log(`showModal fail: ${JSON.stringify(res)}`);
            },
            complete(res: any) {
              // console.log('showModal 调用结束', res.errMsg);
            }
          });
        },
        fail(res: any) {
          console.log(`getSystemInfo fail: ${JSON.stringify(res)}`);
        }
      });
    }
  };

  const previewImage = () => {
    if (typeof window !== 'undefined' && window.tt) {
      window.tt.previewImage({
        urls: [
          "https://sf3-scmcdn2-cn.feishucdn.com/ee/lark/open/web/static/app-banner.05b68b58.png",
          "https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/33e4ae2ff215314046c51ee1d3008d89_p1QpEy0jkK.png"
        ],
        current: "https://sf3-cn.feishucdn.com/obj/open-platform-opendoc/33e4ae2ff215314046c51ee1d3008d89_p1QpEy0jkK.png",
        success(res: any) {
          console.log(JSON.stringify(res));
        },
        fail(res: any) {
          console.log(`previewImage fail: ${JSON.stringify(res)}`);
        }
      });
    }
  };

  return (
    <div className="mt-2.5 w-full h-auto flex flex-col">
      <div className="w-auto ml-[5vw] h-10 flex flex-row">
        <h4>JSAPI使用示范</h4>
      </div>

      <div className="w-auto mx-[5vw] h-7.5 flex flex-row">
        <span className="text-sm self-center text-gray-500">获取系统信息</span>
      </div>
      <button 
        className="mx-[5vw] my-2.5 px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700 active:bg-blue-800" 
        onClick={getSystemInfo}
      >
        JSAPI - getSystemInfo
      </button>

      <div className="w-auto mx-[5vw] h-7.5 flex flex-row">
        <span className="text-sm self-center text-gray-500">显示操作菜单</span>
      </div>
      <button 
        className="mx-[5vw] my-2.5 px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700 active:bg-blue-800" 
        onClick={showActionSheet}
      >
        JSAPI - showActionSheet
      </button>

      <div className="w-auto mx-[5vw] h-7.5 flex flex-row">
        <span className="text-sm self-center text-gray-500">图片预览</span>
      </div>
      <button 
        className="mx-[5vw] my-2.5 px-5 py-2.5 bg-blue-600 text-white border-none rounded cursor-pointer text-sm hover:bg-blue-700 active:bg-blue-800" 
        onClick={previewImage}
      >
        JSAPI - previewImage
      </button>
    </div>
  );
}