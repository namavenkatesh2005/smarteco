import { Header } from "@/components/header";
import { Nav } from "@/components/nav";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Bolt } from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar side="left" collapsible="icon" variant="sidebar">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Bolt className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EcoTrack</h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <Nav />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </>
  );
}
