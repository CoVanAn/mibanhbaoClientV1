"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
            <Image
              src={menu.menu_image}
              alt={`Danh mục ${menu.category}`}
              width={110}
              height={110}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExploreMenu;
