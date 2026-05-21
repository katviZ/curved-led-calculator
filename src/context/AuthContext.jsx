import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vr-user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.type === "trial" && parsed.expiryDate) {
          if (new Date(parsed.expiryDate) <= new Date()) {
            localStorage.removeItem("vr-user");
            setUser(null);
          } else {
            setUser(parsed);
          }
        } else {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem("vr-user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("vr-user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vr-user");
  };

  const trackEvent = async (action, params = {}) => {
    try {
      await fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email || "anonymous",
          action,
          params,
        }),
      });
    } catch (err) {
      console.error("Analytics track failed:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, trackEvent }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
