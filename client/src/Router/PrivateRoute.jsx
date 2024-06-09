import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="m-2">
      {currentUser ? <Outlet /> : <Navigate to="/sign-in" />}
    </div>
  );
};

export default PrivateRoute;
