"use client";

import { useEffect, useState } from "react";
import "./myOrders.scss";
import axios from "axios";
import { assets } from "@/src/assets/assets";
import useStore from "@/src/store/useStore";

export default function Page() {
  const url = useStore((state) => state.url);
  const token = useStore((state) => state.token);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.post(
      `${url}/api/order/userorders`,
      {},
      { headers: { token } }
    );
    setData(response.data.data);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} />
            <p>
              {order.items.map((items, itemIndex) =>
                itemIndex === order.items.length - 1
                  ? `${items.name} x ${items.quantity}`
                  : `${items.name} x ${items.quantity}, `
              )}
            </p>
            <p>Amount: ${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>*</span>
              <b>{order.status}</b>
            </p>
            <button onClick={fetchOrders}>Track order</button>
          </div>
        ))}
      </div>
    </div>
  );
}
