"use client";

import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { apiRoute } from "../api/route";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(undefined);

// Helper function to get user data from local storage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser && storedToken) {
      const user = JSON.parse(storedUser);
      if (user && user.userId && user.fullName && user.email && storedToken) {
        return { user, token: storedToken };
      }
    }
  } catch (error) {
    console.error("Failed to parse user data from local storage:", error);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
  }
  return null;
};

// eslint-disable-next-line react/prop-types
export const UserProvider = ({ children }) => {
  const storedData = getStoredUser();
  const [user, setUser] = useState(storedData ? storedData.user : null);
  const [token, setToken] = useState(storedData ? storedData.token : null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Effect to set Axios default header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Login function
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        params.append("email", email);
        params.append("password", password);

        const response = await axios.post(apiRoute.auth.login, params);

        if (response.status === 200) {
          const { access_token, user: userData } = response.data;
          setUser(userData);
          setToken(access_token);

          // Store data in local storage for persistence
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("accessToken", access_token);

          toast.success("Login successful!");
          navigate("/dashboard"); // Navigate on successful login
        } else {
          // This case should ideally be caught by the catch block for non-2xx responses
          setError("Login failed. Please try again.");
          toast.error("Login failed. Please try again.");
        }
      } catch (err) {
        console.error("Login error:", err);
        const errorMessage =
          err.response?.data?.detail ||
          "Login failed. Please check your credentials.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    toast.success("Logged out successfully.");
    navigate("/");
  }, [navigate]);

  const contextValue = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);
