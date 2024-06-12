import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { signInSuccess } from "../redux/user/userSlice.js";
import { app } from "../firebase.js";
import { FaGoogle } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      // Use Axios instead of fetch
      const response = await axios.post(
        `api/user/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      dispatch(signInSuccess(data.data));
      navigate("/home");
    } catch (error) {
      toast.error("Could not sign in with Google", error.response.data.message || error.message);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleGoogleClick}
        className={`bg-gray  text-white p-3 rounded-lg uppercase w-full flex items-center justify-center space-x-2 `}
      >
        <span>
          <FaGoogle size={20} />
        </span>
        <span>
          <span>Continue with Google</span>
        </span>
      </button>
    </div>
  );
};

export default OAuth;
