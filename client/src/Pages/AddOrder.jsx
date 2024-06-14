import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Select from 'react-select';

const AddOrder = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    amount: '',
    date: '',
  });
  const [customerOptions, setCustomerOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('api/customers');
        const options = res.data.data.map(customer => ({
          value: customer._id,
          label: `${customer.name} (${customer.email})`
        }));
        setCustomerOptions(options);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
      setIsLoading(false);
    };
    fetchCustomers();
  }, []);

  const handleChange = (selectedOption) => {
    setFormData({
      ...formData,
      customerId: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('api/orders/add', formData);
      toast.success('Order added successfully');
      setFormData({
        customerId: '',
        amount: '',
        date: '',
      });
    } catch (error) {
      console.error('Error adding order:', error);
      toast.error('Failed to add order');
    }
  };

  return (
    <div>
      <div className="p-4 bg-pale-white rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Add Order</h1>
        <hr />
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="customerId">Select Customer:</label>
          <Select
            id="customerId"
            name="customerId"
            value={customerOptions.find(option => option.value === formData.customerId) || null}
            onChange={handleChange}
            options={customerOptions}
            isLoading={isLoading}
            isClearable
            placeholder="Select Customer"
            className=''
            required
          />
          <label htmlFor="amount">Amount:</label>
          <input
            id="amount"
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            name="date"
            placeholder="Date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            onFocus={(e) => e.target.showPicker()}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          
          <button
            type="submit"
            className="w-full bg-dark text-white py-2 rounded-lg hover:opacity-50 transition duration-300"
          >
            Add Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;
