import React, { createContext, useState, useEffect, useMemo, useContext } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);        // normal user
  const [vendor, setVendor] = useState(null);    // vendor user
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const userToken = localStorage.getItem("token");
      const vendorToken = localStorage.getItem("vendorToken");

      // -----------------------------------
      // LOAD USER SESSION
      // -----------------------------------
      if (userToken) {
        try {
          const { data } = await API.get("/auth/me");
          setUser(data.user);
        } catch (err) {
          console.warn("User session failed:", err);
          localStorage.removeItem("token");
          setUser(null);
        }
      }

      // -----------------------------------
      // LOAD VENDOR SESSION
      // -----------------------------------
      if (vendorToken) {
        try {
          const { data } = await API.get("/vendor/me", {
            headers: {
              Authorization: `Bearer ${vendorToken}`,
            },
          });
          setVendor(data);
        } catch (err) {
          console.warn("Vendor session failed:", err);
          localStorage.removeItem("vendorToken");
          setVendor(null);
        }
      }

      setAuthLoading(false);
    };

    loadAuth();
  }, []);

  // Logout for both user & vendor
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendor");

    setUser(null);
    setVendor(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,

      vendor,
      setVendor,

      authLoading,
      logout
    }),
    [user, vendor, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
