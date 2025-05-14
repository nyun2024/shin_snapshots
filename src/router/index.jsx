import { createHashRouter } from "react-router-dom";
import Home from "@pages/Home/Home";
import WebCam from "@pages/Snapshot/WebCam";
import EditSnapshot from "@pages/EditSnapshot/EditSnapshot";
import SaveSnapshot from "@pages/SaveSnapshot/SaveSnapshot";

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
    {
      path: "/edit/:type",
      element: <EditSnapshot />,
    },
    {
      path: "/save/:type",
      element: <SaveSnapshot />,
    },
  ],
  { basename: "/" }
);

export default router;
