"use client"

import { Button } from "@/components/ui/button"
import { Home, Settings, Leaf, ArrowLeft, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: "dashboard" | "room" | "config"
  onViewChange: (view: "dashboard" | "room" | "config") => void
  onBackToDashboard: () => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function Sidebar({ currentView, onViewChange, onBackToDashboard, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div
      className={cn(
        "bg-gray-900 border-r border-gray-800 p-4 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div className={cn("flex items-center gap-2", collapsed && "hidden")}>
          <Leaf className="h-8 w-8 text-violet-400" />
          <h1 className="text-xl font-bold text-white">RabbiTotem</h1>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-gray-300 hover:text-white hover:bg-gray-800 p-2"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <nav className="space-y-2">
        {currentView === "room" && (
          <Button
            variant="ghost"
            onClick={onBackToDashboard}
            className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Back to Dashboard</span>}
          </Button>
        )}

        <Button
          variant="ghost"
          onClick={() => onViewChange("dashboard")}
          className={cn(
            "w-full justify-start",
            currentView === "dashboard"
              ? "bg-violet-600 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-800",
          )}
          title="Dashboard"
        >
          <Home className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Dashboard</span>}
        </Button>

        <Button
          variant="ghost"
          onClick={() => onViewChange("config")}
          className={cn(
            "w-full justify-start",
            currentView === "config" ? "bg-violet-600 text-white" : "text-gray-300 hover:text-white hover:bg-gray-800",
          )}
          title="Configuration"
        >
          <Settings className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Configuration</span>}
        </Button>
      </nav>

      <div className={cn("mt-8 p-4 bg-gray-800 rounded-lg", collapsed && "hidden")}>
        <h3 className="text-sm font-medium text-gray-300 mb-2">System Status</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-400">All systems operational</span>
        </div>
      </div>
    </div>
  )
}
