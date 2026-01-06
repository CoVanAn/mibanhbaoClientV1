"use client";

import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.scss";
import { StoreContext } from "@/src/context/StoreContext";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    country: "",
    phone: "",
  });

  const handleChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });
    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    const response = await axios.post(`${url}/api/order/place`, orderData, {
      headers: { token },
    });

    if (response.data) {
      const { session_url } = response.data;
      window.location.replace(session_url);
      alert("Thank you for your order! I contact to you soon!");
    } else {
      alert("Order failed");
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }
    if (getTotalCartAmount() === 0) {
      router.push("/cart");
    }
  }, [token, getTotalCartAmount, router]);

  return (
    <div>
      <form onSubmit={handlePlaceOrder} className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Infomation</p>
          <div className="multi-fields">
            <input
              name="firstName"
              onChange={handleChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="First Name"
              required
            />
            <input
              name="lastName"
              onChange={handleChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Last Name"
              required
            />
          </div>
          <input
            name="email"
            onChange={handleChangeHandler}
            value={data.email}
            type="text"
            placeholder="Email"
            required
          />
          <input
            name="street"
            onChange={handleChangeHandler}
            value={data.street}
            type="text"
            placeholder="Street"
            required
          />
          <div className="multi-fields">
            <input
              name="city"
              onChange={handleChangeHandler}
              value={data.city}
              type="text"
              placeholder="City"
              required
            />
          </div>
          <div className="multi-fields">
            <input
              name="country"
              onChange={handleChangeHandler}
              value={data.country}
              type="text"
              placeholder="Country"
              required
            />
          </div>
          <input
            name="phone"
            onChange={handleChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />

              <div className="cart-total-details">
                <p>Delivery Free</p>
                <p>{getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />

              <div className="cart-total-details">
                <b>Total</b>
                <p>
                  ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                </p>
              </div>
            </div>
            <button type="submit">Proceed to payment</button>
          </div>
        </div>
      </form>
    </div>
  );
}
