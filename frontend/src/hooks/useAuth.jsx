import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useLocalStorage } from "./useLocalStorage";
  
const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = (data) => {
    setUser(data);
    navigate("/dashboard/tasks", { replace: true });
  };

  const register = (data) => {
    setUser(data);
    navigate("/dashboard/tasks", { replace: true });
  };

  const logout = () => {
    setUser(null);
    navigate("/auth/login", { replace: true });
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};
