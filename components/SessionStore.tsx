import { Session } from '../hooks/useSession'
import { create } from 'zustand'

const SESSION_KEY = "session"

interface SessionState {
  session: Session | null
  setSession: (sessions: Session | null) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  session: null,
  setSession: (session) => {
    set({ session })
    // Sync with localStorage
    if (typeof window !== "undefined") {
      if (session) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      } else {
        localStorage.removeItem(SESSION_KEY)
      }
    }
  },
}))