import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MobileNav } from "@/components/MobileNav";

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex w-full overflow-x-hidden bitos-safe-top bitos-safe-x bitos-safe-bottom"
    >
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 flex flex-col min-w-0">
        <div className={mobileOpen ? "hidden md:block" : "block"}>
          <TopBar onMobileMenu={() => setMobileOpen(true)} />
        </div>
        <main className="flex-1 px-2 sm:px-3 pt-4 sm:pt-5 pb-3 min-w-0">{children}</main>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
