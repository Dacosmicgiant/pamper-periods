import React, { createContext, useState, useEffect, useRef } from "react";
import API from "../api/api"; // your axios instance
import { useAuth } from "./AuthContext"; // your existing hook

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth(); // listens to login/logout
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // unique id generator (you already had this)
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  // helper: persist local cart (always)
  const persistLocal = (c) => {
    try {
      localStorage.setItem("cart", JSON.stringify(c));
    } catch (e) {
      console.warn("Could not persist cart to localStorage", e);
    }
  };

  // helper: push cart to server for this user (replace / merge on backend as you like)
  const pushCartToServer = async (c) => {
    if (!user) return;
    try {
      // server endpoint expected: POST /users/:userId/cart
      // payload: { cart: [...] } (server should replace or merge as desired)
      await API.post(`/user/cart`, { cart: c });
    } catch (err) {
      console.warn("Failed to sync cart to server", err);
    }
  };

  // fetch server cart for logged in user
  const fetchServerCart = async () => {
    if (!user) return null;
    try {
      // server endpoint expected: GET /users/:userId/cart -> { cart: [...] }
      const { data } = await API.get(`/user/cart`);
      return data?.cart ?? [];
    } catch (err) {
      console.warn("Could not fetch server cart", err);
      return null;
    }
  };

  // merge two carts (serverCart and localCart):
  // For bundles/products we use uniqueId to keep distinct variant/color combos.
  // If an incoming cart item lacks uniqueId (older server), we generate one.
  const mergeCarts = (serverCart = [], localCart = []) => {
    const out = [...serverCart.map((i) => ({ ...i }))];

    // index by a matching key: productId + variant + color
    const key = (it) =>
      `${it.productId ?? it.product}-${it.variant ?? ""}::${it.color ?? ""}`;

    const map = new Map(out.map((it) => [key(it), { ...it }]));

    for (const localItem of localCart) {
      const localKey = key(localItem);
      if (map.has(localKey)) {
        // sum qty
        const existing = map.get(localKey);
        map.set(localKey, { ...existing, qty: (existing.qty || 0) + (localItem.qty || 0) });
      } else {
        // ensure uniqueId exists
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

  // effect: persist local whenever cart changes, and sync to server if user logged in
  // small debounce using ref to avoid flooding server on rapid changes
  const syncTimerRef = useRef(null);
  useEffect(() => {
    persistLocal(cart);

    // if user logged in, push to server after short delay
    if (user) {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
      syncTimerRef.current = setTimeout(() => {
        pushCartToServer(cart);
        syncTimerRef.current = null;
      }, 400); // 400ms debounce
    }
    // cleanup
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
        syncTimerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, user?.id, user?.token]);

  // effect: on login, fetch server cart, merge with local and set merged
  useEffect(() => {
    let mounted = true;
    const syncOnLogin = async () => {
      if (!user) {
        // user logged out: keep local cart as-is (so guest still has it)
        return;
      }

      // 1) fetch server cart
      const serverCart = await fetchServerCart(); // can be [] or null on failure
      if (!mounted) return;

      const localCart = (() => {
        try {
          return JSON.parse(localStorage.getItem("cart")) || [];
        } catch {
          return cart; // fallback to current state
        }
      })();

      // If serverCart null (failed), prefer local cart
      const merged = serverCart === null ? localCart : mergeCarts(serverCart, localCart);

      // make sure each item has uniqueId & productId naming consistent
      const normalized = merged.map((it) => ({
        ...it,
        uniqueId: it.uniqueId || generateId(),
        productId: it.productId || it.product,
      }));

      setCart(normalized);

      // push normalized merged cart to server (so server stores merged state)
      try {
        await pushCartToServer(normalized);
      } catch (e) {
        // already handled in pushCartToServer
      }
    };

    syncOnLogin();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  /* -------------------------------
     CART OPERATIONS
  ------------------------------- */

  const addToCart = (item, qty = 1, variant = null, color = null) => {
    setCart((prev) => {
      const isBundle = item.type === "bundle" || item.items;
      if (isBundle) {
        // identify by productId + variant + color
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
        // add new bundle item
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

      // normal product (identify by productId)
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
    // optionally delete server cart
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
