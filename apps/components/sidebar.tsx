"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Tag,
  Users,
  Plane,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Expenses", href: "/expenses", icon: Wallet },
  { label: "Categories", href: "/categories", icon: Tag },
  { label: "Groups", href: "/groups", icon: Users },
  { label: "Trips", href: "/trips", icon: Plane },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-accent to-accent-secondary rounded-lg flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
            <span className="font-bold text-foreground">SpendWise</span>
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform",
              isOpen ? "rotate-90" : "-rotate-90"
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            SpendWise v1.0
          </p>
        </div>
      )}
    </aside>
  );
}
