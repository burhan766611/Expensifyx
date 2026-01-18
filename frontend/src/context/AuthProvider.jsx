import { useEffect, useState } from "react";
import api from "../api/axios";
import { setupAxiosInterceptors } from "../api/interceptor";
import { AuthContext } from "./AuthContext";
import { Navigate, replace, useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    const logout = async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, []);

  // 🔁 Rehydrate auth on app load / refresh
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/me", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        isLoggedin: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;