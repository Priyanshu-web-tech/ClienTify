import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditCustomerModal = ({ customer, isOpen, onClose, onUpdate }) => {
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);

  useEffect(() => {
    setName(customer.name);
    setEmail(customer.email);
  }, [customer]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`api/customers/update-customer/${customer._id}`, { name, email });

      onUpdate();
      onClose();
    } catch (error) {
      toast.error(error.response.data.message || "Error updating customer");
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-0 sm:w-2/3 lg:w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Customer</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className="border border-gray-300 rounded-md p-2 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className="bg-dark hover:opacity-75 text-white font-bold py-2 px-4 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;
