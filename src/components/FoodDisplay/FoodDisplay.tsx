"use client";

import "./FoodDisplay.css";
import useStore from "@/src/store/useStore";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }: any) => {
  const food_list = useStore((state: any) => state.food_list);

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-list">
        {(food_list || []).map((item: any, index: number) => {
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
