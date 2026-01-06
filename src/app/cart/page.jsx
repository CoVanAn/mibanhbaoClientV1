"use client";

import "./Cart.scss";
import useStore from "@/src/store/useStore";
import { useRouter } from "next/navigation";

export default function Page() {
  const cartItems = useStore((state) => state.cartItems);
  const food_list = useStore((state) => state.food_list);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const getTotalCartAmount = useStore((state) => state.getTotalCartAmount);
  const url = useStore((state) => state.url);
  const router = useRouter();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quanlity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list && food_list.length > 0 ? (
          food_list.map((food, index) => {
            if (cartItems && cartItems[food._id] > 0)
              return (
                <div key={index}>
                  <div className="cart-items-title cart-items-item">
                    <img src={url + "/images/" + food.image} alt="" />
                    <p>{food.name}</p>
                    <p>${food.price}</p>
                    <p>{cartItems[food._id]}</p>
                    <p>${food.price * cartItems[food._id]}</p>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => removeFromCart(food._id)}
                    >
                      X
                    </p>
                  </div>
                  <hr />
                </div>
              );
            return null;
          })
        ) : (
          <div>Loading...</div>
        )}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>

            <div className="cart-total-details">
              <p>Delivery Free</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <p>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </p>
            </div>
          </div>
          <p>Shipping and taxes are calculated at checkout</p>
          <button onClick={() => router.push("/order")}>
            Place to checkbox
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, enter it here</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="Enter promocode" />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
