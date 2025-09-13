"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, Settings, User, UserStar } from "lucide-react"
import { useAuth } from "./AuthProvider";
import { redirect } from "next/navigation";

export function AccountMenu() {
    const { currentUser, handleLogout } = useAuth();
    if (!currentUser) return null
    
  return (
    <div className="flex items-center gap-5">
      <div className="text-white font-medium">
        {currentUser?.name?.trim() || currentUser?.email}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full text-white hover:text-white! hover:bg-indigo-400 hover:cursor-pointer">
            <User className="h-10 w-10 " />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit" align="end">
          {currentUser?.role === "admin" &&(
            <DropdownMenuItem 
              className="hover:cursor-pointer hover:bg-gray-100"
              onClick={() => redirect("/admin")}>
              <UserStar className="h-5 w-5 mx-1" />
              Admin Panel
          </DropdownMenuItem>
          )}
          
          <DropdownMenuItem 
              className="hover:cursor-pointer hover:bg-gray-100"
              onClick={() => redirect("/settings")}>
              <Settings className="h-5 w-5 mx-1" />
              Settings
          </DropdownMenuItem>
          <DropdownMenuItem 
              className="hover:cursor-pointer hover:bg-gray-100"
              onClick={() => handleLogout()}>
              <LogOut className="h-5 w-5 mx-1" />
              Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
