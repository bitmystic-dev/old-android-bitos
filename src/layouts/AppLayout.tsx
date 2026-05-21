import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MobileNav } from "@/components/MobileNav";

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 p-3 pb-24 md:pb-3">{children}</main>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
