import "./index.scss";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router/index.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
