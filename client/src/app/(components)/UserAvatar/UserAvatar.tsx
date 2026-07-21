import React, { useState } from "react";
import Image from "next/image";
import { formatUsername } from "@/lib/utils";
import { getAvatarColor } from "@/lib/utils";
import { User } from "@/state/api";

interface UserAvatarProps {
  user: User;
  size?: number;
  className?: string;
}

export default function UserAvatar({ user, size = 32, className = "" }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const hasImage = user.profilePictureUrl && !imageError;
  const initials = formatUsername(user.username)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const colorClass = getAvatarColor(user.username);

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full shrink-0 ${!hasImage ? colorClass : ""} ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {hasImage ? (
        <Image
          src={user.profilePictureUrl!.startsWith("http") ? user.profilePictureUrl! : `/${user.profilePictureUrl}`}
          alt={user.username}
          fill
          className="rounded-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-bold text-white tracking-widest text-xs" style={{ fontSize: Math.max(10, size / 2.5) }}>
          {initials}
        </span>
      )}
    </div>
  );
}
