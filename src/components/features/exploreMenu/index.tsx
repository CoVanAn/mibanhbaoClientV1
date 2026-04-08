"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./ExploreMenu.module.scss";
import { menu_list } from "@/src/assets/assets";

const ExploreMenu = () => {
  return (
    <div className={styles.exploreMenu} id="explore-menu">
      <div className={styles.exploreMenuList}>
        {menu_list.map((menu, index) => (
          <Link
            href={`/products?category=${menu.category}`}
            key={index}
            className={styles.exploreMenuListItem}
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
