"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit3, Save, X, Plus, Trash2 } from "lucide-react"

interface ConfigEntry {
  id: string
  device_id: string
  sensor_id: string
  room_id: string
  active: boolean
}

const mockConfig: ConfigEntry[] = [
  { id: "1", device_id: "ESP32_001", sensor_id: "DHT001", room_id: "ROOM_A", active: true },
  { id: "2", device_id: "ESP32_001", sensor_id: "DHT002", room_id: "ROOM_A", active: true },
  { id: "3", device_id: "ESP32_002", sensor_id: "DHT003", room_id: "ROOM_A", active: true },
  { id: "4", device_id: "ESP32_002", sensor_id: "DHT004", room_id: "ROOM_A", active: false },
  { id: "5", device_id: "ESP32_003", sensor_id: "DHT005", room_id: "ROOM_B", active: true },
  { id: "6", device_id: "ESP32_003", sensor_id: "DHT006", room_id: "ROOM_B", active: true },
]

export function Configuration() {
  const [config, setConfig] = useState(mockConfig)
  const [editingRow, setEditingRow] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<ConfigEntry>>({})

  const handleEdit = (entry: ConfigEntry) => {
    setEditingRow(entry.id)
    setEditData(entry)
  }

  const handleSave = (id: string) => {
    setConfig(config.map((entry) => (entry.id === id ? { ...entry, ...editData } : entry)))
    setEditingRow(null)
    setEditData({})
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditData({})
  }

  const handleToggle = (id: string) => {
    setConfig(config.map((entry) => (entry.id === id ? { ...entry, active: !entry.active } : entry)))
  }

  const handleDelete = (id: string) => {
    setConfig(config.filter((entry) => entry.id !== id))
  }

  const handleAddNew = () => {
    const newEntry: ConfigEntry = {
      id: Date.now().toString(),
      device_id: "",
      sensor_id: "",
      room_id: "",
      active: true,
    }
    setConfig([...config, newEntry])
    setEditingRow(newEntry.id)
    setEditData(newEntry)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Configuration</h1>
          <p className="text-gray-400">Manage device and sensor mappings</p>
        </div>
        <Button onClick={handleAddNew} className="bg-violet-600 hover:bg-violet-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{config.length}</p>
              <p className="text-sm text-gray-400">Total Entries</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{config.filter((entry) => entry.active).length}</p>
              <p className="text-sm text-gray-400">Active Sensors</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{new Set(config.map((entry) => entry.device_id)).size}</p>
              <p className="text-sm text-gray-400">Unique Devices</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{new Set(config.map((entry) => entry.room_id)).size}</p>
              <p className="text-sm text-gray-400">Rooms Configured</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Device & Sensor Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Device ID</TableHead>
                  <TableHead className="text-gray-300">Sensor ID</TableHead>
                  <TableHead className="text-gray-300">Room ID</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {config.map((entry) => (
                  <TableRow key={entry.id} className="border-gray-800">
                    <TableCell>
                      {editingRow === entry.id ? (
                        <Input
                          value={editData.device_id || ""}
                          onChange={(e) => setEditData({ ...editData, device_id: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white h-8"
                        />
                      ) : (
                        <span className="text-white">{entry.device_id}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === entry.id ? (
                        <Input
                          value={editData.sensor_id || ""}
                          onChange={(e) => setEditData({ ...editData, sensor_id: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white h-8"
                        />
                      ) : (
                        <span className="text-white">{entry.sensor_id}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === entry.id ? (
                        <Input
                          value={editData.room_id || ""}
                          onChange={(e) => setEditData({ ...editData, room_id: e.target.value })}
                          className="bg-gray-800 border-gray-700 text-white h-8"
                        />
                      ) : (
                        <span className="text-white">{entry.room_id}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={entry.active}
                          onCheckedChange={() => handleToggle(entry.id)}
                          disabled={editingRow === entry.id}
                        />
                        <Badge
                          variant={entry.active ? "default" : "secondary"}
                          className={entry.active ? "bg-green-600" : "bg-gray-600"}
                        >
                          {entry.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {editingRow === entry.id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSave(entry.id)}
                              className="bg-green-600 hover:bg-green-700 h-8 w-8 p-0"
                            >
                              <Save className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-8 w-8 p-0">
                              <X className="h-3 w-3" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(entry)} className="h-8 w-8 p-0">
                              <Edit3 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(entry.id)}
                              className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
