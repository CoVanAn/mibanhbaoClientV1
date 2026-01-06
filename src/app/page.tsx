"use client";

import { useState } from "react";
import ExploreMenu from "@/src/components/ExploreMenu/ExploreMenu";
import FoodDisplay from "@/src/components/FoodDisplay/FoodDisplay";
import Slider from "@/src/components/Slider/Slider";

export default function Page() {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Slider />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
    </div>
  );
}
