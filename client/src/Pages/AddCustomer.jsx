import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import UploadExcelModal from "../components/UploadExcelModal";

const AddCustomer = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    totalSpends: "",
    visits: "",
    lastVisit: "",
    addedBy: currentUser._id,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("api/customers/add", formData);
      toast.success("Customer added successfully");
      setFormData({
        name: "",
        email: "",
        totalSpends: "",
        visits: "",
        lastVisit: "",
      });
    } catch (error) {
      toast.error(error.response.data.message || "Error adding customer");
    }
  };

  const handleUpload = async (customers) => {
    await Promise.all(
      customers.map((customer) => axios.post("api/customers/add", customer))
    );
  };

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Add Customer</h1>
        <hr />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label>
            Name:
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label>
            Total Spends:
            <input
              type="number"
              name="totalSpends"
              placeholder="Total Spends"
              value={formData.totalSpends}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label>
            Visits:
            <input
              type="number"
              name="visits"
              placeholder="Visits"
              value={formData.visits}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <label>
            Last Visit:
            <input
              type="date"
              name="lastVisit"
              placeholder="Last Visit"
              value={formData.lastVisit}
              max={getTodayDate()}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-dark text-white py-2 rounded-lg hover:opacity-50 transition duration-300"
          >
            Add Customer
          </button>
        </form>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-dark text-white py-2 mt-4 rounded-lg hover:opacity-50 transition duration-300"
        >
          Upload via Excel File
        </button>
        <UploadExcelModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpload={handleUpload}
          currentUserId={currentUser._id}
        />
      </div>
    </div>
  );
};

export default AddCustomer;
