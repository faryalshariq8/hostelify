import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getToken, getUser, login as authServiceLogin, logout as authServiceLogout } from "../services/authService";
import apiClient from "../api/apiClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const userData = await getUser();

      if (token && userData) {
        // Validate token with backend
        try {
          const response = await apiClient.get("/profile");
          setUser(response.data);
          await AsyncStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.log("Token validation failed, logging out", error);
          await logout();
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log("Session check error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await authServiceLogin(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authServiceLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
