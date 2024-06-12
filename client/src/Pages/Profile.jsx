import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdModeEditOutline } from "react-icons/md";

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(`api/user/current-user`);
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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleFileSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      toast.error("No new file selected");
      return;
    }

    // Check file format
    const allowedFormats = ["jpg", "jpeg", "png"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedFormats.includes(fileExtension)) {
      toast.error(
        "Invalid file format. Please select a JPG, JPEG, or PNG file."
      );
      return;
    }

    // Check file size
    const maxSizeInBytes = 2000 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error("File size exceeds the limit of 2MB.");
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

      if (success) {
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        toast.success("User updated successfully");
      } else {
        dispatch(updateUserFailure(response.data.message));
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message || error.message));
      toast.error("Error uploading file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const response = await axios.post(
        `api/user/update/${currentUser._id}`,
        formData
      );

      const data = response.data;
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data.data));
      setUpdateSuccess(true);

      toast.success("User updated successfully");
    } catch (error) {
      dispatch(updateUserFailure(error.response.data.message || error.message));

      toast.error(error.response.data.message || error.message);
    }
  };

  const handleDeleteUser = async () => {
    const customConfirm = () =>
      new Promise((resolve, reject) => {
        toast(
          (t) => (
            <div>
              <p>Are you sure? You will not be able to recover this account!</p>
              <div className="mt-2 flex justify-end">
                <button
                  className="bg-red-500 text-red px-4 py-2 mr-2 rounded"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Confirm
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          { duration: Infinity }
        );
      });

    const confirmed = await customConfirm();

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
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Manage Profile</h1>
        <hr />
      </div>
      <form
        onSubmit={handleFileSubmit}
        className="flex flex-col gap-4 items-center justify-center mt-4"
      >
        <div className="relative">
          <input type="file" onChange={handleFileChange} hidden ref={fileRef} />

          <img
            onClick={() => fileRef.current.click()}
            src={previewUrl || currentUser.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover cursor-pointer"
          />
          <label className="absolute bottom-0 right-0 rounded-full bg-gray  px-2 py-1 cursor-pointer">
            <MdModeEditOutline />
          </label>
        </div>

        <button className="border rounded-lg   py-2 px-4" type="submit">
          Update Profile Picture
        </button>
      </form>
      <div className="flex flex-col gap-3 items-center justify-center p-8  w-full">
        <form onSubmit={handleSubmit} className="w-full">
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
              className=" bg-black text-white   rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
            >
              {loading ? "Loading..." : "Update"}
            </button>
          </div>
        </form>

        <button
          onClick={handleDeleteUser}
          className="bg-slate-500 bg-black text-white rounded-lg p-3 uppercase hover:opacity-95 w-full"
        >
          Delete Account
        </button>

        {/* Display error messages */}
        <p className="text-slate-500 mt-5">{error ? error : ""}</p>
      </div>
    </div>
  );
}
