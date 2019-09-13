import { createContext } from "react";

export default createContext({
  orderCount: 0,
  clearOrderCount: () => {},
  orders: [],
  clearNewOrders: () => {},
  killNewOrdersSubscription: () => {}
});
