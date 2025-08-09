"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Thermometer,
  Droplets,
  Activity,
  Sprout,
  Flower,
  SproutIcon as Seedling,
  Wind,
  Edit3,
  Save,
  X,
  Droplet,
  Beaker,
  Settings,
  Check,
} from "lucide-react"

interface Sensor {
  id: string
  deviceId: string
  name: string
  temperature: number
  humidity: number
  active: boolean
}

interface Setpoint {
  temp_set: number
  hum_set: number
}

const mockSensors: Sensor[] = [
  { id: "DHT001", deviceId: "ESP32_001", name: "Canopy Level", temperature: 24.5, humidity: 55, active: true },
  { id: "DHT002", deviceId: "ESP32_001", name: "Root Zone", temperature: 23.8, humidity: 58, active: true },
  { id: "DHT003", deviceId: "ESP32_002", name: "Exhaust Point", temperature: 25.2, humidity: 52, active: true },
  { id: "DHT004", deviceId: "ESP32_002", name: "Intake Point", temperature: 24.1, humidity: 56, active: false },
]

const mockRoom = {
  id: "1",
  name: "Flowering Room A",
  type: "flowering" as const,
  temperature: 24.5,
  humidity: 55,
  vpd: 1.2,
}

interface RoomDetailProps {
  roomId: string
}

export function RoomDetail({ roomId }: RoomDetailProps) {
  const [sensors, setSensors] = useState(mockSensors)
  const [editingSensor, setEditingSensor] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [setpoints, setSetpoints] = useState<Setpoint>({ temp_set: 24.0, hum_set: 60 })
  const [editingSetpoints, setEditingSetpoints] = useState(false)
  const [tempSetpoint, setTempSetpoint] = useState(24.0)
  const [humSetpoint, setHumSetpoint] = useState(60)
  const [updateStatus, setUpdateStatus] = useState("")

  // Fetch current setpoints on component mount
  useEffect(() => {
    const getSetpoint = async () => {
      try {
        const response = await fetch("https://autogrow-api-mbmc.onrender.com/api/setpoint")
        const data: Setpoint = await response.json()
        setSetpoints(data)
        setTempSetpoint(data.temp_set)
        setHumSetpoint(data.hum_set)
      } catch (error) {
        console.error("Error fetching setpoint:", error)
      }
    }

    getSetpoint()
  }, [])

  const handleEditSensor = (sensorId: string, currentName: string) => {
    setEditingSensor(sensorId)
    setEditName(currentName)
  }

  const handleSaveSensor = (sensorId: string) => {
    setSensors(sensors.map((sensor) => (sensor.id === sensorId ? { ...sensor, name: editName } : sensor)))
    setEditingSensor(null)
    setEditName("")
  }

  const handleToggleSensor = (sensorId: string) => {
    setSensors(sensors.map((sensor) => (sensor.id === sensorId ? { ...sensor, active: !sensor.active } : sensor)))
  }

  const handleSetpointEdit = () => {
    setEditingSetpoints(true)
    setUpdateStatus("")
  }

  const handleSetpointSave = async () => {
    if (isNaN(tempSetpoint) || isNaN(humSetpoint)) {
      setUpdateStatus("Please enter valid values.")
      return
    }

    try {
      const response = await fetch("https://autogrow-api-mbmc.onrender.com/api/setpoint", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temp_set: tempSetpoint, hum_set: humSetpoint }),
      })

      const result = await response.json()
      if (response.ok) {
        setSetpoints({ temp_set: tempSetpoint, hum_set: humSetpoint })
        setEditingSetpoints(false)
        setUpdateStatus("Setpoints updated successfully!")
        setTimeout(() => setUpdateStatus(""), 3000)
      } else {
        setUpdateStatus("Error updating setpoints.")
      }
    } catch (error) {
      console.error("Error updating setpoint:", error)
      setUpdateStatus("Network or server error.")
    }
  }

  const handleSetpointCancel = () => {
    setTempSetpoint(setpoints.temp_set)
    setHumSetpoint(setpoints.hum_set)
    setEditingSetpoints(false)
    setUpdateStatus("")
  }

  const getRoomIcon = (type: string) => {
    switch (type) {
      case "flowering":
        return <Flower className="h-6 w-6 text-violet-400" />
      case "vegetative":
        return <Sprout className="h-6 w-6 text-green-400" />
      case "propagation":
        return <Seedling className="h-6 w-6 text-blue-400" />
      case "drying":
        return <Wind className="h-6 w-6 text-orange-400" />
      default:
        return <Sprout className="h-6 w-6 text-green-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {getRoomIcon(mockRoom.type)}
        <div>
          <h1 className="text-3xl font-bold text-white">{mockRoom.name}</h1>
          <p className="text-gray-400 capitalize">{mockRoom.type} Environment</p>
        </div>
        <Badge className="bg-violet-600 text-white ml-auto">
          {sensors.filter((s) => s.active).length}/{sensors.length} sensors active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Temperature
                </p>
                <p className="text-2xl font-bold text-white">{mockRoom.temperature}°C</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Setpoint: {setpoints.temp_set}°C</p>
                <p className="text-xs text-green-400">✓ Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Droplets className="h-4 w-4" />
                  Humidity
                </p>
                <p className="text-2xl font-bold text-white">{mockRoom.humidity}%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Setpoint: {setpoints.hum_set}%</p>
                <p className="text-xs text-green-400">✓ Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  VPD
                </p>
                <p className="text-2xl font-bold text-white">{mockRoom.vpd}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Target: 0.8-1.2</p>
                <p className="text-xs text-green-400">✓ Optimal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sensors" className="space-y-4">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="sensors" className="data-[state=active]:bg-violet-600">
            DHT Sensors
          </TabsTrigger>
          <TabsTrigger value="irrigation" className="data-[state=active]:bg-violet-600">
            <Droplet className="h-4 w-4 mr-2" />
            Irrigation
          </TabsTrigger>
          <TabsTrigger value="mixes" className="data-[state=active]:bg-violet-600">
            <Beaker className="h-4 w-4 mr-2" />
            Mixes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-4">
          {/* Setpoint Controls */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Environment Setpoints</CardTitle>
                <div className="flex items-center gap-2">
                  {!editingSetpoints ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleSetpointEdit}
                      className="text-gray-300 hover:text-white"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSetpointSave}
                        className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleSetpointCancel} className="h-8 w-8 p-0">
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Thermometer className="h-5 w-5 text-red-400" />
                    <span className="text-white font-medium">Temperature Setpoint</span>
                  </div>
                  {editingSetpoints ? (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        type="number"
                        step="0.1"
                        value={tempSetpoint}
                        onChange={(e) => setTempSetpoint(Number.parseFloat(e.target.value))}
                        className="bg-gray-800 border-gray-700 text-white text-center w-20"
                      />
                      <span className="text-gray-400">°C</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-white">{setpoints.temp_set}°C</p>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Droplets className="h-5 w-5 text-blue-400" />
                    <span className="text-white font-medium">Humidity Setpoint</span>
                  </div>
                  {editingSetpoints ? (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        type="number"
                        step="1"
                        value={humSetpoint}
                        onChange={(e) => setHumSetpoint(Number.parseFloat(e.target.value))}
                        className="bg-gray-800 border-gray-700 text-white text-center w-20"
                      />
                      <span className="text-gray-400">%</span>
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-white">{setpoints.hum_set}%</p>
                  )}
                </div>
              </div>
              {updateStatus && (
                <div
                  className={`mt-4 text-center text-sm ${
                    updateStatus.includes("successfully") ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {updateStatus}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sensor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sensors.map((sensor) => (
              <Card key={sensor.id} className="bg-gray-900 border-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {editingSensor === sensor.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-gray-800 border-gray-700 text-white text-sm h-8"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveSensor(sensor.id)}
                            className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                          >
                            <Save className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingSensor(null)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <CardTitle className="text-white text-sm">{sensor.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSensor(sensor.id, sensor.name)}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                    <Switch checked={sensor.active} onCheckedChange={() => handleToggleSensor(sensor.id)} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>ID: {sensor.id}</span>
                    <span>•</span>
                    <span>Device: {sensor.deviceId}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Thermometer className="h-4 w-4 text-red-400" />
                      </div>
                      <p className="text-lg font-semibold text-white">
                        {sensor.active ? `${sensor.temperature}°C` : "--"}
                      </p>
                      <p className="text-xs text-gray-400">Temperature</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Droplets className="h-4 w-4 text-blue-400" />
                      </div>
                      <p className="text-lg font-semibold text-white">{sensor.active ? `${sensor.humidity}%` : "--"}</p>
                      <p className="text-xs text-gray-400">Humidity</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="irrigation" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Droplet className="h-5 w-5 text-blue-400" />
                Irrigation System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-sm text-gray-400">Active Zones</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-white">2.5L</p>
                  <p className="text-sm text-gray-400">Daily Usage</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-green-400">Active</p>
                  <p className="text-sm text-gray-400">System Status</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-center">Irrigation automation controls will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mixes" className="space-y-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Beaker className="h-5 w-5 text-violet-400" />
                Nutrient Mixes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-sm text-gray-400">Active Recipes</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-white">6.2</p>
                  <p className="text-sm text-gray-400">Current pH</p>
                </div>
                <div className="text-center p-4 bg-gray-800 rounded-lg">
                  <p className="text-2xl font-bold text-white">1.4</p>
                  <p className="text-sm text-gray-400">EC Level</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-center">
                  Nutrient mixing automation controls will be implemented here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
