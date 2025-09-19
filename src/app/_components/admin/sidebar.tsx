import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Home, Settings, ChefHat, Image, User, Info, NotebookText, ListTodo } from "lucide-react"
 
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Recipes",
    url: "/admin/recipes",
    icon: NotebookText,
  },
  {
    title: "RecipeInfo",
    url: "/admin/recipeinfo",
    icon: Info,
  },
  {
    title: "Gallery",
    url: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Ingredients",
    url: "/admin/ingredients",
    icon: ChefHat,
  },
  {
    title: "Instructions",
    url: "/admin/instructions",
    icon: ListTodo,
  },
]

export default function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
