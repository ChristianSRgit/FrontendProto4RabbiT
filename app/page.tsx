"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Dashboard } from "@/components/dashboard"
import { RoomDetail } from "@/components/room-detail"
import { Configuration } from "@/components/configuration"
import { LoginForm } from "@/components/login-form"

export default function AutoGrowApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<"dashboard" | "room" | "config">("dashboard")
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoom(roomId)
    setCurrentView("room")
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onBackToDashboard={() => {
          setCurrentView("dashboard")
          setSelectedRoom(null)
        }}
      />
      <main className="flex-1 p-6">
        {currentView === "dashboard" && <Dashboard onRoomSelect={handleRoomSelect} />}
        {currentView === "room" && selectedRoom && <RoomDetail roomId={selectedRoom} />}
        {currentView === "config" && <Configuration />}
      </main>
    </div>
  )
}
