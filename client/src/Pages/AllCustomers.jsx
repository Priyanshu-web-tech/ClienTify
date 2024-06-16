import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import EditCustomerModal from "../components/EditCustomerModal";
import toast from "react-hot-toast";

const AllCustomers = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`api/customers/${currentUser._id}`);
      const { data } = res.data;

      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date(dateString));
  };

  const handleCustomerDelete = async (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!shouldDelete || !id) {
      return;
    }

    try {
      await axios.delete(`api/customers/delete-customer/${id}`);
      fetchCustomers();
    } catch (error) {
      toast.error(error.response.data.message || "Error deleting customer")
    }
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    fetchCustomers();
    toast.success("Customer updated successfully");
  };

  return (
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">All Customers</h1>
        <hr className="border-gray-500" />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4 mt-4">
          <input
            type="text"
            placeholder="Search Customers"
            className="border border-gray-300 rounded-md p-2 mb-2"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="block w-full overflow-x-auto">
          <table className="items-center bg-transparent w-full border-collapse mt-2">
            <thead className="">
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Name
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Email
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Total Spends
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Visits
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Last Visit
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Delete Customer
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Update Details
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  className="transition-all duration-300 hover:font-bold hover:bg-pale-white "
                  key={customer._id}
                >
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {customer.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {customer.email}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {customer.totalSpends}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {customer.visits}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {formatDate(customer.lastVisit)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <button
                      className="bg-red hover:scale-110 transition-all duration-300 text-pale-white py-2 px-6 rounded-full"
                      onClick={() => handleCustomerDelete(customer._id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <button
                      className="bg-warn hover:scale-110 transition-all duration-300 text-dark py-2 px-6 rounded-full"
                      onClick={() => handleEditClick(customer)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <EditCustomerModal
          customer={selectedCustomer}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default AllCustomers;
