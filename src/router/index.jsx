import { createHashRouter } from "react-router-dom";
import Home from "@pages/Home/Home";
import WebCam from "@pages/Snapshot/WebCam";
import SaveEditSnapshot from "@pages/SaveEditSnapshot/SaveEditSnapshot";
import SelectFrame from "@pages/SelectFrame/SelectFrame";

const router = createHashRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/select",
      element: <SelectFrame />,
    },
    {
      path: "/webcam/:type",
      element: <WebCam />,
    },
    {
      path: "/save/:type",
      element: <SaveEditSnapshot />,
    },
  ],
  { basename: "/" }
);

export default router;
