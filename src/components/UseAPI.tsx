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
    <div className="useapi">
      <div className="item_title">
        <h4>JSAPI使用示范</h4>
      </div>

      <div className="item_desc">
        <span className="desc_content">获取系统信息</span>
      </div>
      <button className="item_button" onClick={getSystemInfo}>
        JSAPI - getSystemInfo
      </button>

      <div className="item_desc">
        <span className="desc_content">显示操作菜单</span>
      </div>
      <button className="item_button" onClick={showActionSheet}>
        JSAPI - showActionSheet
      </button>

      <div className="item_desc">
        <span className="desc_content">图片预览</span>
      </div>
      <button className="item_button" onClick={previewImage}>
        JSAPI - previewImage
      </button>

      <style jsx>{`
        .useapi {
          margin-top: 10px;
          width: 100%;
          height: auto;
          display: flex;
          flex-direction: column;
        }

        .item_title {
          width: auto;
          margin-left: 5vw;
          height: 40px;
          display: flex;
          flex-direction: row;
        }

        .item_desc {
          width: auto;
          margin-left: 5vw;
          margin-right: 5vw;
          height: 30px;
          display: flex;
          flex-direction: row;
        }

        .desc_content {
          font-size: small;
          align-self: center;
          color: grey;
        }

        .item_button {
          margin: 10px 5vw;
          padding: 10px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .item_button:hover {
          background-color: #0056b3;
        }

        .item_button:active {
          background-color: #004085;
        }
      `}</style>
    </div>
  );
}