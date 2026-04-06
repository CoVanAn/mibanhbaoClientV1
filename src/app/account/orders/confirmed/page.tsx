import OrdersListView from "../OrdersListView";

export default function OrdersPendingPage() {
  return <OrdersListView statusFilter="CONFIRMED" />;
}
