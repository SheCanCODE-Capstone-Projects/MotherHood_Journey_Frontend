"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MothersPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/mothers");
  }, [router]);

  return null;
}
