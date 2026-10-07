import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-base-900">
      <Sidebar />
      <div className="md:pl-64 flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 px-4 md:px-8 py-6 pb-28 md:pb-10 max-w-[1400px] w-full mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
