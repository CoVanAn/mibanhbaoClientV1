const baseAssetsPath = "/assets";

const withPath = (fileName: string) => `${baseAssetsPath}/${fileName}`;

export const assets = {
  logo: withPath("logo.png"),
  basket_icon: withPath("basket3.svg"),
  header_img: withPath("header_img.png"),
  search_icon: withPath("search.svg"),
  rating_starts: withPath("rating_starts.png"),
  add_icon_green: withPath("add_icon_green.png"),
  add_icon_white: withPath("add_icon_white.png"),
  remove_icon_red: withPath("remove_icon_red.png"),
  slider_1: withPath("slider_1.jpg"),
  slider_2: withPath("slider_2.jpg"),
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
  gioithieu: withPath("gioithieu.jpg"),
};

export const menu_list = [
  { category: 6, menu_image: withPath("img_brand_1.jpg") },
  { category: 20, menu_image: withPath("img_brand_2.jpg") },
  { category: 9, menu_image: withPath("img_brand_3.jpg") },
  { category: 7, menu_image: withPath("img_brand_4.jpg") },
  { category: 8, menu_image: withPath("img_brand_5.jpg") },
  { category: 10, menu_image: withPath("img_brand_6.jpg") },
];
