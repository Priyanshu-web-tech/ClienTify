import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";
import { useDispatch } from "react-redux";
import axios from "axios";

import { RiEyeFill, RiEyeOffFill } from "react-icons/ri";
import {
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [signInData, setsignInData] = useState({});
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateInput = (name, value) => {
    switch (name) {
      case "name":
        return /^[A-Za-z\s]+$/.test(value)
          ? ""
          : "Name must contain only alphabets";
      case "password":
        // Password strength check
        if (value.length < 8) {
          return "Password must be at least 8 characters long";
        } else if (!/[a-z]/.test(value)) {
          return "Password must contain at least one lowercase letter";
        } else if (!/[A-Z]/.test(value)) {
          return "Password must contain at least one uppercase letter";
        } else if (!/\d/.test(value)) {
          return "Password must contain at least one digit";
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    const errorMessage = validateInput(id, value);
    setErrors({
      ...errors,
      [id]: errorMessage,
    });
    if (!errorMessage || value === "") {
      setErrors({
        ...errors,
        [id]: "", // Reset error message when input becomes valid
      });
      setFormData({
        ...formData,
        [id]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== "")) {
      return; // Stop form submission if there are errors
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({
        ...errors,
        confirmPassword: "Passwords do not match",
      });
      return;
    }

    try {
      setLoading(true);
      const signUpResponse = await axios.post(
        `api/user/signup`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      const signUpData = signUpResponse.data;

      if (signUpData.success === false) {
        setLoading(false);
        setError(signUpData.message);
        return;
      }

      setLoading(false);
      setError(null);
      const signInData = {
        email: formData.email,
        password: formData.password,
      };

      try {
        setLoading(true);
        const signInResponse = await axios.post(
          `api/user/signin`,
          signInData,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        const signInData = signInResponse.data.data;

        if (signInData.success === false) {
          dispatch(signInFailure(signInData.message));
          return;
        }

        dispatch(signInSuccess(signInData));

        navigate("/home");
      } catch (error) {
        setLoading(false);
        dispatch(signInFailure(error.response.data.message || error.message));
        navigate("/sign-in");
      }
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message || error.message);
    }
  };
  return (
    <>
    <div className={`flex items-center justify-center min-h-screen `}>
      <div className={`shadow-lg rounded p-8 max-w-md w-full `}>
        <h1 className="text-3xl font-semibold text-center mb-6 text-teal-800">
          Sign up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="name"
            className={`appearance-none block w-full   border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
              errors.name ? "border-red" : ""
            }`}
            id="name"
            required
            onChange={handleChange}
          />

          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}

          <input
            type="text"
            placeholder="username"
            className="border p-3 text-black  rounded-lg"
            id="username"
            required
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 text-black  rounded-lg"
            id="email"
            required
            onChange={handleChange}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              className={`appearance-none block w-full   border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
                errors.password ? "border-red" : ""
              }`}
              id="password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password}</p>
            )}
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

          <div className="relative">
            
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className={`appearance-none block w-full   border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white ${
                errors.confirmPassword ? "border-red" : ""
              }`}
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-xs italic">
                {errors.confirmPassword}
              </p>
            )}

            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute  inset-y-1 right-0 px-3 py-2 text-teal-800 focus:outline-none"
            >
              {showConfirmPassword ? (
                <RiEyeOffFill size={24} />
              ) : (
                <RiEyeFill size={24} />
              )}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium bg-dark text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            {loading ? "Loading..." : "Sign Up"}
          </button>
          <OAuth />
        </form>
        <div className="flex  items-center justify-center gap-2 mt-5">
          <p>Have an account?</p>
          <Link
            className="text-teal-800 font-semibold hover:underline"
            to={"/sign-in"}
          >
            <span className="text-teal-700">Sign in</span>
          </Link>
        </div>
        {error && <p className="text-red-500 mt-5">{error}</p>}
      </div>
    </div>
    </>
  );
}
