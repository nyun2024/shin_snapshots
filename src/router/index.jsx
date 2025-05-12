import { createHashRouter } from "react-router-dom";
import Home from "@pages/home/Home";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
  ],
  { basename: "/" }
);

export default router;
