import { create } from "zustand";
import createUserSlice from "@/src/store/user";
import createCartSlice from "@/src/store/cart";
import createProductSlice from "@/src/store/product";

const useStore = create((set, get) => ({
  ...createUserSlice(set, get),
  ...createCartSlice(set, get),
  ...createProductSlice(set),
}));

export default useStore;
