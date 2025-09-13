'use client'

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/utils/CheckformSchema";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    // Validate locally
    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ["Passwords do not match"] });
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Registration failed");
        return;
      }

      console.log("Registered successfully");
      router.push("/login")
    } catch (err) {
      console.error(err);
      setServerError("An unexpected error occurred");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">
          Create an account
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" autoComplete="off" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Username</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Username"
              autoComplete="new-username"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.join(", ")}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="new-email"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.join(", ")}</p>}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="********"
              autoComplete="new-password"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.join(", ")}</p>}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="********"
              autoComplete="new-confirmPassword"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.join(", ")}</p>}
          </div>

          {/* Server Error */}
          {serverError && <p className="text-sm text-red-500">{serverError}</p>}

          {/* Submit */}
          <Button type="submit" className="w-full mt-6 hover:cursor-pointer" disabled={pending}>
            {pending ? "Registering..." : "Register"}
          </Button>

          {/* Already have account */}
          <p className="text-center text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 hover:underline hover:cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
