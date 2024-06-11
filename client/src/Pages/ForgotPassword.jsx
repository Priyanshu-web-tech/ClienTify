import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while waiting for response
    try {
      const response = await axios.post(
        `api/user/forgot-password`,
        {
          email: email,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate(`/reset-password?email=${email}`);
      }
    } catch (error) {
      console.log(error.response.data.message || error.message);
    } finally {
      setLoading(false); // Reset loading state after response is received
    }
  };

  return (
    <>
      <div className={`flex items-center justify-center min-h-screen `}>
        <div className={`shadow-lg rounded p-8 max-w-md w-full `}>
          <h1 className="text-3xl font-semibold text-center mb-6 text-teal-800">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-4">
              <label htmlFor="email" className="sr-only">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                autoComplete="off"
                name="email"
                value={email}
                className="w-full border rounded-lg py-3 px-4 text-black focus:outline-none focus:border-teal-800"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium bg-dark text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button while loading
            >
              {loading ? "Loading..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
