import React from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if someone visits /auth
    router.replace("/auth/login");
  }, [router]);

  return null;
}
