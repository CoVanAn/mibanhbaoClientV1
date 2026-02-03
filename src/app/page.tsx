"use client";

import { useState } from "react";
import ExploreMenu from "@/src/components/features/exploreMenu/ExploreMenu";
import FeaturedProduct, {
  FeaturedProductsSection,
} from "@/src/components/common/featuredProduct/FeaturedProduct";
import Slider from "@/src/components/common/slider/Slider";

export default function Page() {
  const [category, setCategory] = useState("All");

  return (
    <div>
      <Slider />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FeaturedProduct />
      <FeaturedProductsSection />
    </div>
  );
}
