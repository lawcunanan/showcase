"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export type AlertType = "success" | "danger" | "warning"

interface Alert {
  id: string
  type: AlertType
  message: string
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (type: AlertType, message: string) => void
  removeAlert: (id: string) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((type: AlertType, message: string) => {
    const id = Date.now().toString()
    setAlerts((prev) => [...prev, { id, type, message }])
    setTimeout(() => removeAlert(id), 4000)
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  return <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertContext.Provider>
}

export function useAlert() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider")
  }
  return context
}
