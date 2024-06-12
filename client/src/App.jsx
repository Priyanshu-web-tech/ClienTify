import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signOutUserSuccess, updateUserSuccess } from "./redux/user/userSlice";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
        const res = await axios.get(`api/user/check-token`, {
          withCredentials: true, // This ensures cookies are sent
        });
        const data = res.data;
        if (data.success === false) {
          // Token is expired, dispatch sign out actions
          dispatch(signOutUserSuccess({}));
        }
        dispatch(updateUserSuccess(data.data.user));
      } catch (error) {
        console.error(
          "Error checking token validity:",
          error.response.data.message || error.message
        );
      }
    };

    checkTokenValidity();
  }, []);

  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Outlet />
    </>
  );
};

export default App;
