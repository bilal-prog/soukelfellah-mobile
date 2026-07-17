import { io, Socket } from "socket.io-client"

import Config from "@/config"

class SocketClient {
  private socket: Socket | null = null
  private eventListeners: Map<string, Array<(...args: any[]) => void>> = new Map()

  connect(token: string) {
    if (this.socket) {
      if (this.socket.connected) return
      this.socket.connect()
      return
    }

    this.socket = io(Config.API_URL, {
      auth: {
        token,
      },
    })

    this.socket.on("connect", () => {
      console.log("Socket.IO connected")
    })

    this.socket.on("disconnect", () => {
      console.log("Socket.IO disconnected")
    })

    // Re-register all listeners on the new socket
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach((listener) => {
        this.socket?.on(event, listener)
      })
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, listener: (...args: any[]) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(listener)

    if (this.socket) {
      this.socket.on(event, listener)
    }
  }

  off(event: string, listener: (...args: any[]) => void) {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      this.eventListeners.set(
        event,
        listeners.filter((l) => l !== listener),
      )
    }

    if (this.socket) {
      this.socket.off(event, listener)
    }
  }
}

export const socketClient = new SocketClient()
export default socketClient
