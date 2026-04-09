import { createBrowserRouter } from "react-router";
import Home from "@/pages/home/Home";
import PurchaseNew from "@/pages/purchases/new/PurchaseNew";

export const PATHS = {
  HOME: "/",
  PURCHASENEW: "/purchases/new",
} as const;

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <Home />,
  },
  {
    path: PATHS.PURCHASENEW,
    element: <PurchaseNew />,
  },
]);
