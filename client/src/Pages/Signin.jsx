import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"; 
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    dispatch(signInFailure(null));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

 
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());

      const response = await axios.post(
        `api/user/signin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data)

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data.data));

      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message || error.message)

      dispatch(signInFailure(error.response.data.message || error.message));
    }
  };

  return (
    <>
    <Navbar />
    
    <div className={`flex items-center justify-center min-h-screen `}>
      <div className={`shadow-lg rounded p-8 max-w-md w-full `}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-teal-800">
          Sign In
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg py-3 px-4 text-black focus:outline-none focus:border-teal-800"
              id="email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full text-black border rounded-lg py-3 px-4 focus:outline-none focus:border-teal-800 pr-12"
              id="password"
              required
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute  inset-y-0 right-0 px-3 py-2 text-teal-800 focus:outline-none"
            >
              {showPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}{" "}
            </button>
          </div>

         
          <button
            disabled={loading}
            className="w-full bg-teal-800 text-white py-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
          <OAuth />
        </form>
        <Link
          className="text-lg text-center mt-4 text-indigo-600 block hover:underline"
          to="/forgot-password"
        >
          Forgot Password
        </Link>

        <div className="flex items-center justify-center mt-6">
          <p className="mr-1">Don't have an account?</p>
          <Link
            to={"/sign-up"}
            className="text-teal-800 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5 text-center">{error}</p>}
      </div>
    </div>
    </>
  );
}
