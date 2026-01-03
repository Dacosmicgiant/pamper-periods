import React, { createContext, useState, useEffect, useRef } from "react";
import API from "../api/api";
import { useAuth } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // Track previous user to detect logout
  const prevUserRef = useRef(user);

  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  const persistLocal = (c) => {
    try {
      localStorage.setItem("cart", JSON.stringify(c));
    } catch (e) {
      console.warn("Could not persist cart to localStorage", e);
    }
  };

  const pushCartToServer = async (c) => {
    if (!user) return;
    try {
      await API.post(`/user/cart`, { cart: c });
    } catch (err) {
      console.warn("Failed to sync cart to server", err);
    }
  };

  const fetchServerCart = async () => {
    if (!user) return null;
    try {
      const { data } = await API.get(`/user/cart`);
      return data?.cart ?? [];
    } catch (err) {
      console.warn("Could not fetch server cart", err);
      return null;
    }
  };

  const mergeCarts = (serverCart = [], localCart = []) => {
    const out = [...serverCart.map((i) => ({ ...i }))];

    const key = (it) =>
      `${it.productId ?? it.product}-${it.variant ?? ""}::${it.color ?? ""}`;

    const map = new Map(out.map((it) => [key(it), { ...it }]));

    for (const localItem of localCart) {
      const localKey = key(localItem);
      if (map.has(localKey)) {
        const existing = map.get(localKey);
        map.set(localKey, { ...existing, qty: (existing.qty || 0) + (localItem.qty || 0) });
      } else {
        const itemToAdd = {
          ...localItem,
          uniqueId: localItem.uniqueId || generateId(),
          productId: localItem.productId || localItem.product,
        };
        map.set(localKey, itemToAdd);
      }
    }

    return Array.from(map.values());
  };

  // 🔥 NEW: Detect logout and clear cart
  useEffect(() => {
    const wasLoggedIn = prevUserRef.current;
    const isLoggedIn = user;

    // Detect logout: was logged in, now not logged in
    if (wasLoggedIn && !isLoggedIn) {
      console.log("🚪 User logged out - clearing cart");
      setCart([]);
      localStorage.removeItem("cart");
    }

    // Update ref for next comparison
    prevUserRef.current = user;
  }, [user]);

  // Persist local cart and sync to server
  const syncTimerRef = useRef(null);
  useEffect(() => {
    persistLocal(cart);

    if (user) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        pushCartToServer(cart);
        syncTimerRef.current = null;
      }, 400);
    }

    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
    };
  }, [cart, user?.id, user?.token]);

  // Sync on login: merge server cart with local cart
  useEffect(() => {
    let mounted = true;
    const syncOnLogin = async () => {
      if (!user) return;

      const serverCart = await fetchServerCart();
      if (!mounted) return;

      const localCart = (() => {
        try {
          return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
          return cart;
        }
      })();

      const merged = serverCart === null ? localCart : mergeCarts(serverCart, localCart);

      const normalized = merged.map((it) => ({
        ...it,
        uniqueId: it.uniqueId || generateId(),
        productId: it.productId || it.product,
      }));

      setCart(normalized);

      try {
        await pushCartToServer(normalized);
      } catch (e) {
        // Already handled
      }
    };

    syncOnLogin();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  /* CART OPERATIONS */

  const addToCart = (item, qty = 1, variant = null, color = null) => {
    setCart((prev) => {
      const isBundle = item.type === "bundle" || item.items;
      if (isBundle) {
        const productId = item._id || item.productId || item.id;
        const exists = prev.find(
          (i) =>
            (i.productId === productId || i.product === productId) &&
            i.variant === variant &&
            i.color === color
        );
        if (exists) {
          return prev.map((i) =>
            (i.productId === productId || i.product === productId) &&
              i.variant === variant &&
              i.color === color
              ? { ...i, qty: (i.qty || 0) + qty }
              : i
          );
        }
        return [
          ...prev,
          {
            uniqueId: generateId(),
            productId: productId,
            title: item.title,
            image: item.images?.[0] || item.image || "",
            price: item.price || 0,
            qty,
            type: "bundle",
            variant,
            color,
          },
        ];
      }

      const productId = item._id || item.productId || item.id;
      const exists = prev.find((i) => i.productId === productId);
      if (exists) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, qty: (i.qty || 0) + qty } : i
        );
      }

      return [
        ...prev,
        {
          uniqueId: generateId(),
          productId,
          title: item.title,
          image: item.images?.[0] || item.image || "",
          price: item.price || 0,
          qty,
          type: "product",
        },
      ];
    });
  };

  const removeFromCart = (uniqueId) => {
    setCart((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  const updateQty = (uniqueId, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => (i.uniqueId === uniqueId ? { ...i, qty } : i)));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
    if (user) {
      (async () => {
        try {
          await API.delete(`/user/cart`);
        } catch (err) {
          // ignore
        }
      })();
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};