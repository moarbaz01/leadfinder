"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Home,
  Menu,
  Settings,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-md px-6">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden border-gray-200 hover:bg-gray-50"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeadFinder
          </span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white" size="sm">
            Upgrade Plan
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full border border-gray-200 hover:bg-gray-50"
            aria-label="User menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
              JD
            </span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden fixed top-16 h-full w-64 flex-col border-r border-gray-200 bg-white/50 backdrop-blur-sm md:flex">
          <nav className="grid gap-2 p-6">
            {/* <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link> */}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 font-medium"
            >
              <Home className="h-5 w-5" />
              Search
            </Link>
            <Link
              href="/leads"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-green-50 hover:text-green-700 transition-all duration-200 font-medium"
            >
              <Users className="h-5 w-5" />
              Leads
            </Link>
            <Link
              href="/analytics"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 font-medium"
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Link>
            {/* <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Users className="h-5 w-5" />
              Contacts
            </Link> */}
            {/* <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <BarChart3 className="h-5 w-5" />
              Analytics
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Link> */}
          </nav>
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <nav className="grid gap-2 p-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Home className="h-5 w-5" />
                Search
              </Link>
              <Link
                href="/leads"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <Users className="h-5 w-5" />
                Leads
              </Link>
              <Link
                href="/analytics"
                className="flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => setIsSidebarOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                Analytics
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 md:ml-64 bg-gradient-to-br from-gray-50/50 to-blue-50/30 min-h-screen">{children}</main>
      </div>

      <Toaster />
    </div>
  );
}