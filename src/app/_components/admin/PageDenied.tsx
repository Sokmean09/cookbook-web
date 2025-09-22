"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageDenied() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (countdown <= 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
      <h1 className="text-3xl font-bold text-red-600">Permission Denied</h1>
      <p className="text-gray-600">
        You do not have access to view this page.
        <br />
        Redirecting to home in <span className="font-semibold">{countdown}</span>...
      </p>
      <Button onClick={() => router.push("/")}>
        Go Back Home Now
      </Button>
    </div>
  );
}
