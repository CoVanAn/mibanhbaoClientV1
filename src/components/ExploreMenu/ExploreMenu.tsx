"use client";

import React from "react";
import "./ExploreMenu.scss";
import { menu_list } from "@/src/assets/assets";

const ExploreMenu = ({
  category,
  setCategory,
}: {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-list">
        {menu_list.map((menu, index) => (
          <div
            onClick={() =>
              setCategory((prev) =>
                prev === menu.menu_name ? "All" : menu.menu_name,
              )
            }
            key={index}
            className="explore-menu-list-item"
          >
            <img
              className={category === menu.menu_name ? "active" : ""}
              src={menu.menu_image}
              alt=""
            />
          </div>
        ))}
      </div>
      {/* <hr /> */}
    </div>
  );
};

export default ExploreMenu;
