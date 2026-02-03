"use client";

import React from "react";
import Link from "next/link";
import "./ExploreMenu.scss";
import { menu_list } from "@/src/assets/assets";

const ExploreMenu = () => {
  return (
    <div className="explore-menu" id="explore-menu">
      <div className="explore-menu-list">
        {menu_list.map((menu, index) => (
          <Link
            href={`/products?category=${menu.category}`}
            key={index}
            className="explore-menu-list-item"
          >
            <img src={menu.menu_image} alt={`Danh mục ${menu.category}`} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;
