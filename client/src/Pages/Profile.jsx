import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `api/user/current-user`
        );
        const userData = userResponse.data.data;
        dispatch(updateUserSuccess(userData));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("No file selected");
      return;
    }

    // Check file format
    const allowedFormats = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      setMessage(
        "Invalid file format. Please select a JPG, JPEG, or PNG file."
      );
      return;
    }

    // Check file size
    const maxSizeInBytes = 2000 * 1024;
    if (file.size > maxSizeInBytes) {
      setMessage("File size exceeds the limit of 2MB.");
      return;
    }

    const imageFormData = new FormData();
    imageFormData.append("file", file);
    dispatch(updateUserStart());

    try {
      const response = await axios.patch(`api/user/avatar`, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, data } = response.data;
      console.log(response.data)

      if (success) {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        toast.success("User updated successfully");
        setMessage("File uploaded successfully");
      } else {
        dispatch(updateUserFailure(response.data.message));
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message || error.message));
      setMessage("Error uploading file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const response = await axios.post(
        `api/user/update/${currentUser._id}`,
        formData,

        {
          withCredentials: true,

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log(data.data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);

      toast.success("User updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message || error.message));

      toast.error("Error in updating User");
    }
  };

  const handleDeleteUser = async () => {
    const confirmed = window.confirm(
      "Are you sure? You will not be able to recover this account!"
    );

    if (confirmed) {
      try {
        dispatch(deleteUserStart());

        const response = await axios.delete(
          `api/user/delete/${currentUser._id}`,
          {
            withCredentials: true,
          }
        );

        const data = response.data;
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          toast.error(data.message);
          return;
        }

        dispatch(deleteUserSuccess(data));
        toast.success("User deleted successfully");
      } catch (error) {
        dispatch(
          deleteUserFailure(error.response.data.message || error.message)
        );
        toast.error("Error in deleting user");
      }
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen   `}>
      <div className=" flex flex-col items-center justify-center">
        <div className="mr-8">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
          />
        </div>

        <form onSubmit={handleFileSubmit} className="flex flex-col">
          <h2 className="mb-4">File Upload</h2>

          <div className="mb-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="border rounded-lg py-2 px-4"
            />
          </div>
          <div className="mb-4">
            <button
              className="border rounded-lg bg-teal-400  py-2 px-4"
              type="submit"
            >
              Upload
            </button>
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </form>
      </div>
      <div className="p-8 max-w-md w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center"
        >
          {/* Input fields  */}
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="name" className="text-sm font-semibold">
              Name
            </label>
            <input
              type="text"
              placeholder="name"
              defaultValue={currentUser.name}
              id="name"
              className="border p-3  text-black rounded-lg w-full"
              onChange={handleChange}
            />

            <label htmlFor="username" className="text-sm font-semibold">
              Username
            </label>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              id="username"
              className="border p-3 text-black rounded-lg w-full"
              onChange={handleChange}
            />

            <label htmlFor="email" className="text-sm font-semibold">
              E-mail
            </label>

            <input
              type="email"
              placeholder="email"
              id="email"
              defaultValue={currentUser.email}
              className="border p-3  text-black   rounded-lg w-full"
              onChange={handleChange}
            />

            <label htmlFor="password" className="text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              placeholder="password"
              onChange={handleChange}
              id="password"
              className="border p-3  text-black  rounded-lg w-full"
            />

            <button
              disabled={loading}
              className="bg-slate-500 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>

        {/* Sign out and Delete account button  */}
        <div className="flex flex-col gap-3 mt-3">
          <button
            onClick={handleDeleteUser}
            className="bg-slate-500 bg-black text-white rounded-lg py-3 uppercase hover:opacity-95"
          >
            Delete Account
          </button>
        </div>

        {/* Display error messages */}
        <p className="text-slate-500 mt-5">{error ? error : ""}</p>
      </div>
    </div>
  );
}
