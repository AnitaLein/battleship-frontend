import { useState, useEffect } from "react";

const SESSION_KEY = "session";

export type Session = {
  credentials: {
    access_token: string;
    expires_in: number;
  };
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export function useSession() {
  const [session, setSessionState] = useState(() => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem(SESSION_KEY);
      return storedSession ? JSON.parse(storedSession) : null;
    }
    return null;
  });

  // Save session to localStorage
  const setSession = (newSession: any) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  // Function to get session manually
  const getSession = () => {
    if (typeof window !== "undefined") {
      const storedSession = localStorage.getItem(SESSION_KEY);
      return storedSession ? JSON.parse(storedSession) as Session : null;
    }
    return null;
  };

  return { session, setSession, getSession };
}