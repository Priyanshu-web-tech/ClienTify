import React from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await axios.get(`api/user/signout`);
      const data = res.data;
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      console.error("Error signing out:", error);
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <div className="relative w-full p-2 bg-pale-white text-dark">
      <div className="flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="inline-flex items-center space-x-2">
          <Link to="/">
            <span className="font-bold text-3xl ">ClienTify.</span>
          </Link>
        </div>
        <div className="hidden lg:block">
          <ul className="inline-flex space-x-8 ">
            <Link to={"/"} className="hover:text-red transition duration-300">
              Home
            </Link>

            {currentUser ? (
              <div className="space-x-4">
                <Link
                  to={"/home"}
                  className="hover:text-red transition duration-300"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleSignOut}
                  className="hover:text-red transition duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="hover:text-red transition duration-300"
              >
                Sign in
              </Link>
            )}
          </ul>
        </div>

        <div className="lg:hidden">
          <div>
            <FaBarsStaggered
              onClick={toggleMenu}
              className="h-6 w-6 cursor-pointer"
            />
          </div>
        </div>
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right  p-2  lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-pale-white text-dark  shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex  items-center space-x-2">
                    <Link to="/">
                      <span className="font-bold text-2xl ">ClienTify.</span>
                    </Link>{" "}
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2  hover:bg-pale-white hover:text-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black "
                    >
                      <span className="sr-only">Close menu</span>
                      <FaXmark className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex">
                  <nav>
                    <Link
                      to={"/"}
                      className="hover:text-red transition duration-300 ml-5"
                    >
                      Home
                    </Link>

                    {currentUser ? (
                      <div className="flex flex-col">
                        <Link
                          to={"/home"}
                          className="hover:text-red transition duration-300 ml-5"
                        >
                          Dashboard
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="hover:text-red transition duration-300"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <Link to="/sign-in">
                        <button className="hover:text-red transition duration-300">
                          Sign in
                        </button>
                      </Link>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
