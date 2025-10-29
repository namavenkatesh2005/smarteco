"use client";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutGrid,
  LineChart,
  Settings,
  Bolt,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/reports", label: "Reports", icon: LineChart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col justify-between h-full">
      <SidebarMenu>
        {menuItems.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <Link href={href} className="w-full">
              <SidebarMenuButton
                isActive={pathname === href}
                tooltip={{ children: label }}
                className="justify-start"
              >
                <Icon />
                <span>{label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

       <div className="p-2">
         <div className="flex items-center gap-2 p-2 rounded-lg bg-primary/10 text-primary font-bold">
            <Bolt className="w-6 h-6 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs">EcoTrack AI</span>
              <span className="text-xs font-normal">Active</span>
            </div>
          </div>
       </div>

    </div>
  );
}
