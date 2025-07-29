'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface UserInfoProps {
  userInfo?: {
    name?: string;
    avatar_url?: string;
  };
}

export default function UserInfo({ userInfo }: UserInfoProps) {
  const [logoSrc, setLogoSrc] = useState('/logo.svg');

  useEffect(() => {
    // Fallback logo if needed
    if (!userInfo?.avatar_url) {
      setLogoSrc('/logo.svg');
    }
  }, [userInfo]);

  return (
    <div className="userinfo">
      <Image
        className="avatar"
        src={userInfo?.avatar_url || logoSrc}
        alt="User Avatar"
        width={48}
        height={48}
        onError={() => setLogoSrc('/logo.svg')}
      />
      <span className="name">
        {userInfo?.name && userInfo.name.length > 0 ? 'Welcome to 飞书' : ''}
      </span>

      <style jsx>{`
        .userinfo {
          margin-top: 15px;
          margin-left: 15px;
          width: 100%;
          height: 60px;
          display: flex;
          flex-direction: row;
        }

        .avatar {
          background: #ebf1fd;
          border: 1px solid lightblue;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          align-self: center;
        }

        .name {
          font-size: 16px;
          margin-left: 12px;
          font-weight: bold;
          align-self: center;
        }
      `}</style>
    </div>
  );
}