import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useMemo } from "react";

import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext({
  user: null,
  login: () => { },
  logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

const REFRESH_INTERVAL = 8 * 60 * 1000; // 8 minutes

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  const refreshToken = async () => {
    try {
      const response = await axios.create({
        baseURL: "http://localhost:8848/api",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
        .post("/auth/generate-access-token", { refreshToken: user.refreshToken });
      setUser((prevUser) => ({ ...prevUser, accessToken: response.data.accessToken }));
    } catch (error) {
      setUser(null);
    }
  };

  const login = (data) => {
    setUser(data);
    navigate("/dashboard/tasks");
  };

  const register = (data) => {
    setUser(data);
    navigate("/dashboard/tasks");
  };

  const logout = () => {
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};
