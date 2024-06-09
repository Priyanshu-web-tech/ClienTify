import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Front from "../Pages/Front";
import Signin from "../Pages/Signin";
import Signup from "../Pages/Signup";
import PrivateRoute from "./PrivateRoute";
import Profile from "../Pages/Profile";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import PageNotFound from "../Pages/PageNotFound";
import Home from "../Pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Front />,
      },
      {
        path: "/sign-in",
        element: <Signin />,
      },
      {
        path: "/sign-up",
        element: <Signup />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/*",
        element: <PageNotFound />,
      },
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "/home",
            element: <Home />,
          },
          
        ],
      },
    ],
  },
]);

export default router;
