import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeApi, loginApi, signupApi } from "../api/authApi";
import { authStorage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => authStorage.get());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hydrate = async () => {
      try {
        if (!auth?.token) {
          setLoading(false);
          return;
        }

        const user = await getMeApi();
        const nextAuth = { token: auth.token, user };
        setAuth(nextAuth);
        authStorage.set(nextAuth);
      } catch (error) {
        setAuth(null);
        authStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, []);

  const login = async (payload) => {
    const data = await loginApi(payload);
    setAuth(data);
    authStorage.set(data);
    return data;
  };

  const signup = async (payload) => {
    const data = await signupApi(payload);
    setAuth(data);
    authStorage.set(data);
    return data;
  };

  const logout = () => {
    setAuth(null);
    authStorage.clear();
  };

  const value = useMemo(
    () => ({
      auth,
      user: auth?.user,
      token: auth?.token,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.user?.role === "admin",
      loading,
      login,
      signup,
      logout
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
