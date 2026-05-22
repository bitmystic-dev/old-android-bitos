import { useState, type ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MobileNav } from "@/components/MobileNav";

export function AppLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full overflow-x-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* hide topbar on mobile while drawer is open to avoid overlap */}
        <div className={mobileOpen ? "hidden md:block" : "block"}>
          <TopBar onMobileMenu={() => setMobileOpen(true)} />
        </div>
        <main className="flex-1 p-2 sm:p-3 min-w-0">{children}</main>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </div>
  );
}
