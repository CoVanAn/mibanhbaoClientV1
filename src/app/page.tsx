import ExploreMenu from "@/src/components/features/exploreMenu/ExploreMenu";
import FeaturedProduct, {
  FeaturedProductsSection,
} from "@/src/components/common/featuredProduct/FeaturedProduct";
import Slider from "@/src/components/common/slider/Slider";

export default function Page() {
  return (
    <div>
      <Slider />
      <ExploreMenu />
      <FeaturedProduct />
      <FeaturedProductsSection />
    </div>
  );
}
