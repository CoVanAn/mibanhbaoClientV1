import OrdersListView from "../OrdersListView";

export default function OrdersCompletedPage() {
  return <OrdersListView statusFilter="COMPLETED" />;
}
