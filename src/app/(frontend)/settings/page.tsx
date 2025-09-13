"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/_components/AuthProvider"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useRouter } from "next/navigation"
import { updateSchema } from "@/utils/CheckformSchema"

export default function SettingPage() {
    const router = useRouter()
    const { currentUser } = useAuth();
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
  if (currentUser) {
    setFormData(prev => ({
      ...prev,
      name: currentUser.name || "",
      email: currentUser.email || "",
    }))
  }
}, [currentUser])

    const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setErrors({});
      setServerError(null)

      // Validate locally
      const result = updateSchema.safeParse(formData);
      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: ["Passwords do not match"] });
        return;
      }

      setIsSaving(true)
      try {
        const res = await fetch("/api/account", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: currentUser?.id,
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        const data = await res.json();
        if (!res.ok) {
          setServerError(data.error || "Registration failed");
          return;
        }

        console.log("Account updated successfully")
        window.location.reload()
      } catch (error) {
        console.error(error);
        setServerError("An unexpected error occurred");
      } finally {
        setIsSaving(false)
      }
    }

    const handleDeleteAccount = async () => {
      try {
        setIsDeleting(true)
        const res = await fetch("/api/account", {
          method: "DELETE",
        })

        if (!res.ok) {
          throw new Error("Failed to delete account")
        }

        router.push("/login")
      } catch (error) {
        console.error(error)
        alert("Error deleting account. Please try again.")
      } finally {
        setIsDeleting(false)
      }
    }
    
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <form onSubmit={handleSaveChanges} autoComplete="off">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your username"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoComplete="new-name"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.join(", ")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="new-email"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.join(", ")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.join(", ")}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                autoComplete="new-confirmPassword"
              />
              {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.join(", ")}</p>}
            </div>
            
            {serverError && <p className="text-sm text-red-500">{serverError}</p>}

            <Button type="submit" className="mt-4 hover:cursor-pointer" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="hover:cursor-pointer">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isDeleting} className="hover:cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 hover:cursor-pointer"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
