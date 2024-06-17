import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateAudience = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    spendsAbove10000: false,
    spendsAbove10000AndMaxVisits3: false,
    notVisitedLast3Months: false,
  });
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [audienceName, setAudienceName] = useState(""); // State for audience name

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(`api/customers/${currentUser._id}`);
        const { data } = res.data;
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    let newFilteredCustomers = customers;

    if (filters.spendsAbove10000) {
      newFilteredCustomers = newFilteredCustomers.filter(
        (customer) => customer.totalSpends > 10000
      );
    }

    if (filters.spendsAbove10000AndMaxVisits3) {
      newFilteredCustomers = newFilteredCustomers.filter(
        (customer) => customer.totalSpends > 10000 && customer.visits <= 3
      );
    }

    if (filters.notVisitedLast3Months) {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      newFilteredCustomers = newFilteredCustomers.filter(
        (customer) => new Date(customer.lastVisit) < threeMonthsAgo
      );
    }

    setFilteredCustomers(newFilteredCustomers);
  }, [filters, customers]);

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const handleCheckAudienceSize = () => {
    toast.success(`Audience size: ${filteredCustomers.length}`);
  };

  const handleCreateAudience = async () => {
    if (!audienceName) {
      toast.error("Please enter an audience name.");
      return;
    }
    const customerIds = filteredCustomers.map((customer) => customer._id);
    if (customerIds.length === 0) {
      toast.error("No customers found for the selected filters.");
      return;
    }

    if (
      !filters.spendsAbove10000 &&
      !filters.spendsAbove10000AndMaxVisits3 &&
      !filters.notVisitedLast3Months
    ) {
      const confirmAllCustomers = window.confirm(
        "No filters applied. All customers will be added. Are you sure you want to proceed?"
      );
      if (!confirmAllCustomers) {
        return;
      }
    }

    try {
      const formData = {
        customerIds,
        name: audienceName, // Include audience name in form data
        userId: currentUser._id,
      };

      const response = await axios.post("api/audience/create", formData);
      const res = response.data;
      if (res.success) {
        toast.success("Audience created successfully!");
        setFilters({
          spendsAbove10000: false,
          spendsAbove10000AndMaxVisits3: false,
          notVisitedLast3Months: false,
        });
        setAudienceName(""); // Clear audience name after successful creation
        navigate("/home/campaigns-list");
      } else {
        toast.error("Failed to create audience.");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Error creating audience");
    }
  };

  return (
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <div className="flex flex-col md:flex-row justify-between">
          <h1 className="text-3xl font-bold mb-4">Create Audience</h1>
          <div>
            <button
              className="bg-red hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full"
              onClick={handleCheckAudienceSize}
            >
              Check Audience Size
            </button>
          </div>
        </div>
        <hr className="border-gray-500" />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <label
            htmlFor="audienceName"
            className="block mb-2 text-lg font-medium"
          >
            Audience Name
          </label>
          <input
            id="audienceName"
            type="text"
            placeholder="Enter Audience Name"
            className="border border-gray-300 p-2 rounded w-full"
            value={audienceName}
            required
            onChange={(e) => setAudienceName(e.target.value)}
          />
        </div>
        <div className="mb-4 flex flex-col gap-3">
          <p className="text-lg font-medium mb-2">Filters:</p>

          <div className="flex flex-col md:flex-row gap-3">
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filters.spendsAbove10000
                  ? "bg-black text-white"
                  : "bg-gray opacity-50"
              }`}
              onClick={() => handleFilterChange("spendsAbove10000")}
            >
              Spends Above INR 10000
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filters.spendsAbove10000AndMaxVisits3
                  ? "bg-black text-white "
                  : "bg-gray opacity-50"
              }`}
              onClick={() =>
                handleFilterChange("spendsAbove10000AndMaxVisits3")
              }
            >
              Spends Above INR 10000 and Max Visits 3
            </button>
            <button
              className={`mr-2 px-4 py-2 rounded ${
                filters.notVisitedLast3Months
                  ? "bg-black text-white"
                  : "bg-gray opacity-50"
              }`}
              onClick={() => handleFilterChange("notVisitedLast3Months")}
            >
              Not Visited Last 3 Months
            </button>
          </div>

          <button
            className="px-4 py-2 bg-dark hover:opacity-50 text-white rounded"
            onClick={handleCreateAudience}
          >
            Create Audience
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateAudience;
