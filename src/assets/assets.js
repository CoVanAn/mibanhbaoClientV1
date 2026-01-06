const baseAssetsPath = "/assets";

const withPath = (fileName) => `${baseAssetsPath}/${fileName}`;

export const assets = {
  logo: withPath("logo.png"),
  basket_icon: withPath("basket_icon.png"),
  header_img: withPath("header_img.png"),
  search_icon: withPath("search_icon.png"),
  rating_starts: withPath("rating_starts.png"),
  add_icon_green: withPath("add_icon_green.png"),
  add_icon_white: withPath("add_icon_white.png"),
  remove_icon_red: withPath("remove_icon_red.png"),
  slider_1: withPath("slider_1.jpg"),
  slider_2: withPath("slider_2.jpg"),
  gioithieu: withPath("gioithieu.jpg"),
  app_store: withPath("app_store.png"),
  play_store: withPath("play_store.png"),
  linkedin_icon: withPath("linkedin_icon.png"),
  facebook_icon: withPath("facebook_icon.png"),
  twitter_icon: withPath("twitter_icon.png"),
  cross_icon: withPath("cross_icon.png"),
  selector_icon: withPath("selector_icon.png"),
  profile_icon: withPath("profile_icon.png"),
  logout_icon: withPath("logout_icon.png"),
  bag_icon: withPath("bag_icon.png"),
  parcel_icon: withPath("parcel_icon.png"),
  google_icon: withPath("google_.png"),
};

export const menu_list = [
  { menu_name: "Pizza", menu_image: withPath("img_brand_1.jpg") },
  { menu_name: "Rolls", menu_image: withPath("img_brand_2.jpg") },
  { menu_name: "Deserts", menu_image: withPath("img_brand_3.jpg") },
  { menu_name: "Sandwich", menu_image: withPath("img_brand_4.jpg") },
  { menu_name: "Cake", menu_image: withPath("img_brand_5.jpg") },
  { menu_name: "Pure Veg", menu_image: withPath("img_brand_6.jpg") },
];
