import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import axios from "axios";
import toast from 'react-hot-toast';
import Navbar from "../components/Navbar";


function ResetPassword() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get("email");
  const [otp, setOTP] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');

      return;
    }
    const formData = {
      password: password,
    };
    try {
      const response = await axios.get(
        `api/user/verifyOTP?code=${otp}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data)
      const { success } = data;
      if (success) {
        try {
          const res = await axios.post(
            `api/user/updatePassword/${email}`,
            formData,
            {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            }
          );
          const responseData = res.data;
          if (responseData.success === false) {
            return;
          }

          toast.success('Password Updated Successfully');

          navigate("/sign-in");
        } catch (error) {
          console.log(error.response.data.message || error.message);

          toast.error("Error in updating Password");
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      toast.error("Error verifying OTP");
    }
  };

  return (
    <>
    <Navbar/>
    <div className={`flex items-center justify-center min-h-screen $`}>
      <div className={`shadow-lg rounded p-8 max-w-md w-full `}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-teal-800">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label htmlFor="otp" className="sr-only">
              <strong>OTP</strong>
            </label>
            <input
              type="number"
              placeholder="Enter 6 digit OTP received on your mail"
              autoComplete="off"
              name="otp"
              required
              className="w-full border rounded-lg py-3 px-4 text-black focus:outline-none focus:border-teal-800"
              onChange={(e) => setOTP(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
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
              {/* Use React Icons */}
            </button>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="confirmPassword" className="sr-only">
              Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full text-black border rounded-lg py-3 px-4 focus:outline-none focus:border-teal-800 pr-12"
              id="confirmPassword"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute  inset-y-0 right-0 px-3 py-2 text-teal-800 focus:outline-none"
            >
              {showConfirmPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}{" "}
              {/* Use React Icons */}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-teal-800 text-white py-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
    </>
  );
}

export default ResetPassword;
