"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface UserInfoProps {
  userInfo?: {
    name?: string;
    avatar_url?: string;
  };
}

export default function UserInfo({ userInfo }: UserInfoProps) {
  const [logoSrc, setLogoSrc] = useState("/logo.svg");

  useEffect(() => {
    // Fallback logo if needed
    if (!userInfo?.avatar_url) {
      setLogoSrc("/logo.svg");
    }
  }, [userInfo]);

  return (
    <div className="mt-4 ml-4 w-full h-15 flex flex-row">
      <Image
        className="bg-blue-50 border border-blue-200 rounded-full w-12 h-auto self-center"
        src={userInfo?.avatar_url || logoSrc}
        alt="User Avatar"
        width={48}
        height={48}
        onError={() => setLogoSrc("/logo.svg")}
      />
      <span className="text-base ml-3 font-bold self-center">
        {userInfo?.name && userInfo.name.length > 0 ? "Welcome to 飞书" : ""}
      </span>
    </div>
  );
}
