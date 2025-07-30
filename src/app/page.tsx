"use client"

import { useEffect, useState } from 'react';
import UserInfo from '@/components/UserInfo';
import UseAPI from '@/components/UseAPI';
import { handleJSAPIAccess, handleUserAuth } from '@/lib/feishu-auth';

export default function Home() {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // 鉴权处理
    handleJSAPIAccess((isSuccess) => {
      console.log('handleJSAPIAccess OK: ', isSuccess);
      // 免登处理
      handleUserAuth((userInfo) => {
        setUserInfo(userInfo || {});
      });
    });
  }, []);

  return (
    <div className="min-h-screen p-5 bg-gray-100">
      <UserInfo userInfo={userInfo} />
      <UseAPI />
    </div>
  );
}
