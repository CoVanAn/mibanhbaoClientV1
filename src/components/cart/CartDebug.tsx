"use client";

import { useEffect } from "react";
import { useCart } from "@/src/queries/cart";

/**
 * Debug component to log cart state
 * Add this to any page to see cart data in console
 */
export function CartDebug() {
  const { data: cart, isLoading, error, isError } = useCart();

  useEffect(() => {
    console.group("🛒 Cart Debug");
    console.log("Loading:", isLoading);
    console.log("Error:", isError, error);
    console.log("Cart data:", cart);
    console.log("Total items:", cart?.totalItems);
    console.log("Items:", cart?.items);
    console.groupEnd();
  }, [cart, isLoading, isError, error]);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <strong>Cart Debug</strong>
      <div>Loading: {isLoading ? "Yes" : "No"}</div>
      <div>Error: {isError ? "Yes" : "No"}</div>
      <div>Items: {cart?.totalItems || 0}</div>
      <div>Subtotal: {cart?.subtotal || 0}</div>
    </div>
  );
}
