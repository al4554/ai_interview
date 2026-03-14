import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppShell = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[1500px]">
        <div className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
          <Sidebar />
        </div>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-40 flex lg:hidden">
            <button
              type="button"
              className="w-12 bg-black/45"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />
            <div className="w-72">
              <Sidebar onNavigate={() => setSidebarOpen(false)} />
            </div>
          </div>
        ) : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <div className="glass-card flex h-14 items-center justify-between px-4 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white text-brand-700"
              aria-label="Open sidebar"
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <p className="font-display text-lg font-bold">InterviewIQ</p>
          </div>

          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppShell;
