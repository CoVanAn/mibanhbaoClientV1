"use client";

import React from "react";
import "./FoodItem.css";
import { assets } from "@/src/assets/assets";
import useStore from "@/src/store/useStore";
const FoodItem = ({ id, name, price, description, image }) => {
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const cartQuantity = useStore((state) => state.cartItems[id] || 0);
  const url = useStore((state) => state.url);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={url + "/images/" + image}
          alt=""
        />
        {cartQuantity === 0 ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt=""
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={() => {
                removeFromCart(id);
              }}
              className="quantity-icon"
              src={assets.remove_icon_red}
              alt=""
            />
            <p>{cartQuantity}</p>
            <img
              onClick={() => {
                addToCart(id);
              }}
              className="quantity-icon"
              src={assets.add_icon_green}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-description">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
