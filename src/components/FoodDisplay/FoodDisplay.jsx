"use client";

import React from "react";
import "./FoodDisplay.css";
import useStore from "@/src/store/useStore";
import FoodItem from "../FoodItem/FoodItem";
// import { food_list } from '../../assets/assets'

const FoodDisplay = ({ category }) => {
  const food_list = useStore((state) => state.food_list);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-list">
        {(food_list || []).map((item, index) => {
          if (category === "All" || item.category == category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
