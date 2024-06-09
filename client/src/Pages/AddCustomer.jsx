import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [totalSpends, setTotalSpends] = useState('');
  const [visits, setVisits] = useState('');
  const [lastVisit, setLastVisit] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const customer = { name, email, totalSpends, visits, lastVisit };
    await axios.post('api/customers/add', customer);
    toast.success('Customer added successfully')
  };

  return (
    <div>
      <h2>Add Customer</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="number" placeholder="Total Spends" value={totalSpends} onChange={(e) => setTotalSpends(e.target.value)} required />
        <input type="number" placeholder="Visits" value={visits} onChange={(e) => setVisits(e.target.value)} required />
        <input type="date" placeholder="Last Visit" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} required />
        <button type="submit">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
