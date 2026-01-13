"use client";

import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

// const linkApi = "https://apisubject-backend.onrender.com"
const linkApi = "http://localhost:4000";

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = linkApi;
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  const addToCart = async (id, quantity = 1) => {
    if (!id || quantity <= 0) return;

    setCartItems((prev) => {
      const existing = prev[id] ?? 0;
      return {
        ...prev,
        [id]: existing + quantity,
      };
    });

    if (token && quantity > 0) {
      try {
        for (let i = 0; i < quantity; i += 1) {
          await axios.post(
            url + "/api/cart/add",
            { itemId: id },
            { headers: { token } }
          );
        }
      } catch (error) {
        console.error("Failed to update cart on server", error);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCartItems((prev) => {
      return {
        ...prev,
        [id]: prev[id] - 1,
      };
    });
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId: id },
        { headers: { token } }
      );
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      const data = response.data.cartData;
      // Đảm bảo data là object, nếu không thì sử dụng object rỗng
      setCartItems(data && typeof data === "object" ? data : {});
    } catch (error) {
      console.error("Error loading cart data:", error);
      // Nếu có lỗi (ví dụ: token hết hạn), xóa token và reset cartItems
      localStorage.removeItem("token");
      setToken("");
      setCartItems({});
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((produce) => produce._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    // const response = await fetch(`${url}/api/food/list`)
    // const data = await response.json()
    // setFoodList(data)

    const response = await axios.get(`${url}/api/food/list`);
    setFoodList(response.data);
  };

  useEffect(() => {
    async function fetchData() {
      await fetchFoodList();
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
        await loadCartData(token);
      }
    }
    fetchData();
  }, []);

  // Xử lý đăng nhập Google: nhận token từ backend
  const handleGoogleLogin = async () => {
    // Kiểm tra nếu URL có chứa token (sau khi Google redirect về)
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get("token");
    if (tokenParam) {
      setToken(tokenParam);
      localStorage.setItem("token", tokenParam);
      await loadCartData(tokenParam);
      // Xoá token khỏi URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  useEffect(() => {
    handleGoogleLogin();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartAmount,
    url,
    token,
    setToken,
    handleGoogleLogin,
  };

  // useEffect(() => {console.log(cartItems)}, [cartItems])

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
