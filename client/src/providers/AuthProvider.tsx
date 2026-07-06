"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { setClerkTokenGetter } from "@/state/auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    setClerkTokenGetter(getToken);
  }, [getToken]);

  return <>{children}</>;
};
