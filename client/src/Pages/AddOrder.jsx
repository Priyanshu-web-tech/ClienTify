import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';


const AddOrder = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await axios.get('api/customers');
      setCustomers(res.data.data);
    };
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = { customerId, amount, date };
    await axios.post('api/orders/add', order);
    toast.success('Order added successfully');
  };

  return (
    <div>
      <h2>Add Order</h2>
      <form onSubmit={handleSubmit}>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
          <option value="">Select Customer</option>
          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <input type="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;
