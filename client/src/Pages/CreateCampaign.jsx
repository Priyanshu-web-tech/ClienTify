import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CreateCampaign = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    message: "",
    userId: currentUser._id,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("api/campaigns/create", formData);
      toast.success("Campaign created successfully");
      setFormData({
        name: "",
        message: "",
        userId: currentUser._id, 

      });
    } catch (error) {
      toast.error("An error occurred while creating the campaign");
      console.error("Error creating campaign:", error);
    }
  };

  return (
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Create Campaign</h1>
        <hr className="border-gray-500" />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="name">Campaign Name:</label>
          <input
            id="name"
            type="text"
            placeholder="Campaign Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <label htmlFor="message">Message:</label>
          <input
            id="message"
            type="text"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-lg hover:opacity-50 transition duration-300"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
