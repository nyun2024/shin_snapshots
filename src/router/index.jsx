import { createHashRouter } from "react-router-dom";
import Home from "@pages/Home/Home";
import WebCam from "@pages/Snapshot/WebCam";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/webcam/:type",
      element: <WebCam />,
    },
  ],
  { basename: "/" }
);

export default router;
