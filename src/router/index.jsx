import { createHashRouter } from "react-router-dom";
import Home from "@pages/Home/Home";

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
