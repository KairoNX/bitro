"use client";

import { Database, Key, Logs, Shield } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CloudSidebarProps {
  projectId: string;
  activeView: "overview" | "database" | "secrets" | "logs";
  onViewChange: (view: "overview" | "database" | "secrets" | "logs") => void;
}

const navItems = [
  { icon: Shield, label: "Overview", view: "overview" as const },
  { icon: Database, label: "Database", view: "database" as const },
  { icon: Key, label: "Secrets", view: "secrets" as const },
  { icon: Logs, label: "Logs", view: "logs" as const },
];

export const CloudSidebar = ({ activeView, onViewChange }: CloudSidebarProps) => {
  return (
    <div className="w-48 border-r bg-sidebar flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm">Cloud</h2>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.view;
          
          return (
            <Button
              key={item.view}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary font-medium"
              )}
              onClick={() => onViewChange(item.view)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};

