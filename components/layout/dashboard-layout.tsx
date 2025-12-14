"use client";

import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto transition-all duration-300 lg:mt-0 mt-10">
        <div className="container mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

