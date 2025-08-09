"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Thermometer,
  Droplets,
  Activity,
  Sprout,
  Flower,
  SproutIcon as Seedling,
  Wind,
  Home,
  TriangleAlert,
} from "lucide-react"
import { useState, useEffect } from "react"

interface Room {
  id: string
  name: string
  type: "flowering" | "vegetative" | "propagation" | "drying"
  temperature: number
  humidity: number
  vpd: number
  activeSensors: number
  totalSensors: number
}

interface ApiResponse {
  registros: [number, number, number, string][] // [id, temp, hum, fecha]
}

const getRoomIcon = (type: Room["type"]) => {
  switch (type) {
    case "flowering":
      return <Flower className="h-5 w-5 text-violet-400" />
    case "vegetative":
      return <Sprout className="h-5 w-5 text-green-400" />
    case "propagation":
      return <Seedling className="h-5 w-5 text-blue-400" />
    case "drying":
      return <Wind className="h-5 w-5 text-orange-400" />
  }
}

const getRoomTypeColor = (type: Room["type"]) => {
  switch (type) {
    case "flowering":
      return "bg-violet-600"
    case "vegetative":
      return "bg-green-600"
    case "propagation":
      return "bg-green-600"
    case "drying":
      return "bg-orange-600"
  }
}

interface DashboardProps {
  onRoomSelect: (roomId: string) => void
}

export function Dashboard({ onRoomSelect }: DashboardProps) {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Flowering",
      type: "flowering",
      temperature: 0,
      humidity: 0,
      vpd: 0,
      activeSensors: 4,
      totalSensors: 6,
    },
    {
      id: "2",
      name: "Vegetative",
      type: "vegetative",
      temperature: 26.8,
      humidity: 65,
      vpd: 0.9,
      activeSensors: 3,
      totalSensors: 4,
    },
    {
      id: "3",
      name: "Propagation",
      type: "propagation",
      temperature: 22.1,
      humidity: 75,
      vpd: 0.6,
      activeSensors: 2,
      totalSensors: 3,
    },
    {
      id: "4",
      name: "Drying",
      type: "drying",
      temperature: 18.5,
      humidity: 45,
      vpd: 1.8,
      activeSensors: 2,
      totalSensors: 2,
    },
  ])

  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "loading">("loading")

  useEffect(() => {
    const fetchLatestLog = async () => {
      try {
        setConnectionStatus("loading")
        const response = await fetch("https://autogrow-api-mbmc.onrender.com/api/log", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          mode: "cors",
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: ApiResponse = await response.json()

        if (data.registros && data.registros.length > 0) {
          // Get the latest log entry (first element in the array)
          const [id, temp, hum, fecha] = data.registros[0]

          // Calculate VPD (Vapor Pressure Deficit)
          const calculateVPD = (temperature: number, humidity: number) => {
            const saturationVaporPressure = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3))
            const actualVaporPressure = (humidity / 100) * saturationVaporPressure
            return Math.round((saturationVaporPressure - actualVaporPressure) * 100) / 100
          }

          const vpd = calculateVPD(temp, hum)

          // Update the flowering room with real data
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room.id === "1"
                ? {
                    ...room,
                    temperature: Math.round(temp * 10) / 10,
                    humidity: Math.round(hum),
                    vpd: vpd,
                  }
                : room,
            ),
          )

          setLastUpdate(fecha)
          setConnectionStatus("connected")

          console.log("Successfully updated flowering room data:", {
            id,
            temperature: temp,
            humidity: hum,
            vpd: vpd,
            timestamp: fecha,
          })
        } else {
          throw new Error("No data received from API")
        }
      } catch (error) {
        console.error("Error fetching log data:", error)
        setConnectionStatus("disconnected")

        // Fallback: Use mock data for flowering room if API fails
        setRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.id === "1"
              ? {
                  ...room,
                  temperature: 24.5,
                  humidity: 55,
                  vpd: 1.2,
                }
              : room,
          ),
        )

        console.log("Using fallback data for flowering room due to API error")
      }
    }

    // Fetch data immediately
    fetchLatestLog()

    // Set up interval to fetch data every 30 seconds (same as your HTML)
    const interval = setInterval(fetchLatestLog, 30000)

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Cultivation Dashboard</h1>
          <p className="text-gray-400">Monitor and manage your growing environments</p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connectionStatus === "connected"
                ? "bg-green-400"
                : connectionStatus === "loading"
                  ? "bg-yellow-400"
                  : "bg-red-400"
            }`}
          ></div>
          <span className="text-xs text-gray-400">
            {connectionStatus === "connected"
              ? `Last update: ${lastUpdate}`
              : connectionStatus === "loading"
                ? "Connecting..."
                : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Rooms</p>
                <p className="text-2xl font-bold text-white">{rooms.length}</p>
              </div>
              <div className="p-3 bg-violet-600 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sensors</p>
                <p className="text-2xl font-bold text-white">
                  {rooms.reduce((acc, room) => acc + room.activeSensors, 0)}
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">API Status</p>
                <p className="text-2xl font-bold text-white capitalize">{connectionStatus}</p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  connectionStatus === "connected"
                    ? "bg-green-600"
                    : connectionStatus === "loading"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
              >
                <TriangleAlert className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Room Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="bg-gray-900 border-gray-800 hover:border-violet-600 transition-colors cursor-pointer"
              onClick={() => onRoomSelect(room.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {getRoomIcon(room.type)}
                    {room.name}
                    {room.id === "1" && connectionStatus === "connected" && (
                      <Badge className="bg-green-600 text-white text-xs">LIVE</Badge>
                    )}
                  </CardTitle>
                  <Badge className={`${getRoomTypeColor(room.type)} text-white`}>{room.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Thermometer className="h-4 w-4 text-red-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">{room.temperature}°C</p>
                    <p className="text-xs text-gray-400">Temperature</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Droplets className="h-4 w-4 text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">{room.humidity}%</p>
                    <p className="text-xs text-gray-400">Humidity</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Activity className="h-4 w-4 text-violet-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">{room.vpd}</p>
                    <p className="text-xs text-gray-400">VPD</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Sensors</span>
                    <span className="text-white">
                      {room.activeSensors}/{room.totalSensors} active
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                    <div
                      className="bg-violet-600 h-2 rounded-full transition-all"
                      style={{ width: `${(room.activeSensors / room.totalSensors) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
