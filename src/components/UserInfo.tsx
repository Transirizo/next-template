"use client";

import Image from "next/image";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";

export default function UserInfo() {
  const { userInfo, isAuthenticated, isLoading } = useUser();
  const [logoSrc, setLogoSrc] = useState("/logo.svg");

  if (isLoading) {
    return (
      <div className="mt-4 ml-4 w-full h-15 flex flex-row">
        <div className="bg-gray-200 rounded-full w-12 h-12 animate-pulse"></div>
        <div className="ml-3 self-center bg-gray-200 h-4 w-24 rounded animate-pulse"></div>
      </div>
    );
  }

  if (!isAuthenticated || !userInfo) {
    return (
      <div className="mt-4 ml-4 w-full h-15 flex flex-row">
        <Image
          className="bg-blue-50 border border-blue-200 rounded-full w-12 h-auto self-center"
          src={logoSrc}
          alt="Default Avatar"
          width={48}
          height={48}
        />
        <span className="text-base ml-3 font-bold self-center text-gray-500">
          未登录
        </span>
      </div>
    );
  }

  return (
    <div className="mt-4 ml-4 w-full h-15 flex flex-row">
      <Image
        className="bg-blue-50 border border-blue-200 rounded-full w-12 h-auto self-center"
        src={userInfo.avatar_url || logoSrc}
        alt="User Avatar"
        width={48}
        height={48}
        onError={() => setLogoSrc("/logo.svg")}
      />
      <span className="text-base ml-3 font-bold self-center">
        {userInfo.name && userInfo.name.length > 0 ? `Welcome ${userInfo.name}` : "Welcome to 飞书"}
      </span>
    </div>
  );
}
