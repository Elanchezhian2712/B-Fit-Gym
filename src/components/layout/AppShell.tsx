import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-900 text-white selection:bg-primary/20 selection:text-primary">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-3.5 sm:px-6 md:px-8 py-4 sm:py-6 pb-24 md:pb-10 max-w-[1400px] w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
