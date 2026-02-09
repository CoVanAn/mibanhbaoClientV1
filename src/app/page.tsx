import ExploreMenu from "@/src/components/features/exploreMenu";
import FeaturedProduct, {
  FeaturedProductsSection,
} from "@/src/components/common/featuredProduct";
import Slider from "@/src/components/common/slider";

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
