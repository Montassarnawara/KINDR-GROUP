import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 pb-20 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
}
