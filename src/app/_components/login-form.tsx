"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useAuth } from "./AuthProvider";

export function LoginForm() {
  const { handleLogin } = useAuth();
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrors(null);

    const formData = new FormData(e.currentTarget);
    const result = await handleLogin(null, formData);

    if (result?.errors) {
      setErrors(result.errors);
    }

    setPending(false);
  }

  return (
    <Card className="w-full max-w-sm shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Sign in to your account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            {errors?.email && (
              <p className="text-sm text-red-500">{errors.email.join(", ")}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
            />
            {errors?.password && (
              <p className="text-sm text-red-500">
                {errors.password.join(", ")}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button disabled={pending} type="submit" className="w-full mt-8">
            {pending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
