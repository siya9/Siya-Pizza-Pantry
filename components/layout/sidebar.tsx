"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Package,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart3,
  History,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Inventory", href: "/inventory", icon: LayoutDashboard },
  { name: "Audit Log", href: "/audit", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isExpanded, setIsExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-collapse on mobile, expand on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsExpanded(false);
      } else {
        // Check localStorage for saved preference
        const saved = localStorage.getItem("sidebar-expanded");
        if (saved !== null) {
          setIsExpanded(saved === "true");
        } else {
          setIsExpanded(true);
        }
      }
    };

    // Check saved preference on mount
    const saved = localStorage.getItem("sidebar-expanded");
    if (saved !== null && window.innerWidth >= 1024) {
      setIsExpanded(saved === "true");
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    localStorage.setItem("sidebar-expanded", String(newState));
    window.dispatchEvent(new Event("sidebar-toggle"));
  };

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-2 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col transition-all duration-300 ease-in-out bg-card border-r shadow-lg",
          isExpanded ? "w-64" : "w-20"
        )}
      >
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded-logo"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                  <Package className="h-6 w-6" />
                </div>
                <span className="text-lg font-bold">Pizza Pantry</span>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed-logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground mx-auto"
              >
                <Package className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 rounded-full hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-transform",
                    isActive && "scale-110"
                  )}
                />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="border-t p-4 space-y-2">
          {/* User Info */}
          {user && (
            <AnimatePresence>
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground mb-2"
                >
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="text-xs">{user.email}</p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground text-center mb-2"
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-muted-foreground"
                >
                  Theme
                </motion.span>
              )}
            </AnimatePresence>
            <div className={cn("flex", isExpanded ? "ml-auto" : "mx-auto")}>
              <ThemeToggle />
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn("w-full", !isExpanded && "px-2")}
          >
            <LogOut className={cn("h-4 w-4", isExpanded && "mr-2")} />
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-40 w-64 bg-card border-r shadow-xl"
            >
              <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
                      <Package className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-bold">Pizza Pantry</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Footer */}
                <div className="border-t p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.aside>

            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Spacer for desktop sidebar */}
      <div className={cn("hidden lg:block", isExpanded ? "w-64" : "w-20")} />
    </>
  );
}
