"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/src/store/constants";
import useStore from "@/src/store/user";

import { orderKeys } from "@/src/queries/useOrder";
import { cartKeys } from "@/src/queries/useCart";

type OrderEventPayload = {
  id?: number;
  orderId?: number;
};

const invalidateOrderQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  payload: OrderEventPayload,
) => {
  const orderId = payload.id || payload.orderId;

  queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

  if (orderId) {
    queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    queryClient.invalidateQueries({ queryKey: orderKeys.history(orderId) });
  }
};

const OrderRealtimeSync = () => {
  const queryClient = useQueryClient();
  const token = useStore((state: any) => state.token as string);

  useEffect(() => {
    if (!token) {
      return;
    }

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
    });

    const handleCreated = (payload: OrderEventPayload) => {
      invalidateOrderQueries(queryClient, payload);
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    };

    const handleUpdated = (payload: OrderEventPayload) => {
      invalidateOrderQueries(queryClient, payload);
    };

    socket.on("order.created", handleCreated);
    socket.on("order.status.changed", handleUpdated);
    socket.on("order.note.updated", handleUpdated);
    socket.on("order.canceled", handleUpdated);
    socket.on("order.payment.changed", handleUpdated);

    return () => {
      socket.off("order.created", handleCreated);
      socket.off("order.status.changed", handleUpdated);
      socket.off("order.note.updated", handleUpdated);
      socket.off("order.canceled", handleUpdated);
      socket.off("order.payment.changed", handleUpdated);
      socket.disconnect();
    };
  }, [queryClient, token]);

  return null;
};

export default OrderRealtimeSync;
