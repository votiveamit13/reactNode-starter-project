"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const expiry = decoded.exp * 1000;
      return Date.now() > expiry;
    } catch {
      return true;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  const fetchUser = async () => {
    try {
      const token = getToken();

      if (!token || isTokenExpired(token)) {
        logout();
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data.user);

    } catch (err) {
      console.log("AUTH ERROR:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  const path = window.location.pathname;

  if (path.startsWith("/set-password")) {
    setLoading(false);
    return;
  }

  const token = getToken();

  if (!token || isTokenExpired(token)) {
    logout();
    setLoading(false);
    return;
  }

  fetchUser();
}, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);